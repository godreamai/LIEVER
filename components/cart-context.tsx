"use client";

import React, { createContext, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { trackEvent } from "@/lib/track";
import type { CartItem, Product } from "@/lib/types";

const STORAGE_KEY = "liever_cart_items_v1";
const CART_EVENT = "liever-cart-change";
const EMPTY = "[]";

// El carrito vive en localStorage. Se lee con useSyncExternalStore (la forma que React
// recomienda para datos externos): en el servidor y durante la hidratación es un carrito
// vacío, y en el navegador pasa a mostrar el guardado sin un efecto que cambie el estado.
function readRaw(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? EMPTY;
  } catch {
    return EMPTY;
  }
}

function parse(raw: string): CartItem[] {
  try {
    const value = JSON.parse(raw);
    // Carritos guardados antes de los seleccionables no tienen lineId.
    return Array.isArray(value) ? (value as CartItem[]).map((i) => ({ ...i, lineId: i.lineId ?? i.slug })) : [];
  } catch {
    return [];
  }
}

function subscribe(onChange: () => void) {
  // "storage" avisa los cambios hechos desde otra pestaña; CART_EVENT, los de esta.
  window.addEventListener("storage", onChange);
  window.addEventListener(CART_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CART_EVENT, onChange);
  };
}

function writeItems(update: (current: CartItem[]) => CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(update(parse(readRaw()))));
  } catch {
    // sin acceso a localStorage (modo privado, cuota llena): el carrito no persiste
  }
  window.dispatchEvent(new Event(CART_EVENT));
}

interface CartContextValue {
  items: CartItem[];
  add: (p: Product, selection?: CartSelection) => void;
  inc: (lineId: string) => void;
  dec: (lineId: string) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  count: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  lastAddedItem: CartItem | null;
}

// Opciones elegidas en la ficha: precio final de la combinación y su texto ("Medida: 150x70 · Color: Roble").
export interface CartSelection {
  price: number;
  label: string;
  values: Record<string, string>; // { Medida: "150x70", Color: "Roble" }: el servidor recalcula el precio con esto
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => EMPTY);
  const items = useMemo(() => parse(raw), [raw]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  const add = (p: Product, selection?: CartSelection) => {
    const newItem: CartItem = {
      lineId: selection ? `${p.slug}|${selection.label}` : p.slug,
      slug: p.slug,
      name: p.name,
      price: selection?.price ?? p.price,
      measure: selection?.label ?? p.measure,
      selection: selection?.values,
      image: p.image,
      qty: 1,
    };
    setLastAddedItem(newItem);
    trackEvent("add_to_cart", `/producto/${p.slug}`);

    writeItems((prev) => {
      const exists = prev.find((i) => i.lineId === newItem.lineId);
      if (exists) return prev.map((i) => (i.lineId === newItem.lineId ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, newItem];
    });

    setIsDrawerOpen(true);
  };

  const inc = (lineId: string) => writeItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, qty: i.qty + 1 } : i)));

  const dec = (lineId: string) =>
    writeItems((prev) => prev.flatMap((i) => (i.lineId === lineId ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i])));

  const remove = (lineId: string) => writeItems((prev) => prev.filter((i) => i.lineId !== lineId));

  const clear = () => writeItems(() => []);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        inc,
        dec,
        remove,
        clear,
        count,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
