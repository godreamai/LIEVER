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
    return Array.isArray(value) ? value : [];
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
  add: (p: Product) => void;
  inc: (slug: string) => void;
  dec: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  count: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  lastAddedItem: CartItem | null;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => EMPTY);
  const items = useMemo(() => parse(raw), [raw]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  const add = (p: Product) => {
    const newItem: CartItem = {
      slug: p.slug,
      name: p.name,
      price: p.price,
      measure: p.measure,
      image: p.image,
      qty: 1,
    };
    setLastAddedItem(newItem);
    trackEvent("add_to_cart", `/producto/${p.slug}`);

    writeItems((prev) => {
      const exists = prev.find((i) => i.slug === p.slug);
      if (exists) return prev.map((i) => (i.slug === p.slug ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, newItem];
    });

    setIsDrawerOpen(true);
  };

  const inc = (slug: string) => writeItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty: i.qty + 1 } : i)));

  const dec = (slug: string) =>
    writeItems((prev) => prev.flatMap((i) => (i.slug === slug ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i])));

  const remove = (slug: string) => writeItems((prev) => prev.filter((i) => i.slug !== slug));

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
