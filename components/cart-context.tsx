"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/lib/types";

const STORAGE_KEY = "liever_cart_items_v1";

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
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Carritos guardados antes de los seleccionables no tienen lineId.
        setItems((JSON.parse(saved) as CartItem[]).map((i) => ({ ...i, lineId: i.lineId ?? i.slug })));
      }
    } catch {
      // ignore parsing error
    }
    setHydrated(true);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage error
    }
  }, [items, hydrated]);

  const add = (p: Product, selection?: CartSelection) => {
    const newItem: CartItem = {
      lineId: selection ? `${p.slug}|${selection.label}` : p.slug,
      slug: p.slug,
      name: p.name,
      price: selection?.price ?? p.price,
      measure: selection?.label ?? p.measure,
      image: p.image,
      qty: 1,
    };
    setLastAddedItem(newItem);

    setItems((prev) => {
      const exists = prev.find((i) => i.lineId === newItem.lineId);
      if (exists) {
        return prev.map((i) => (i.lineId === newItem.lineId ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, newItem];
    });

    setIsDrawerOpen(true);
  };

  const inc = (lineId: string) => {
    setItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, qty: i.qty + 1 } : i)));
  };

  const dec = (lineId: string) => {
    setItems((prev) =>
      prev.flatMap((i) => (i.lineId === lineId ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i]))
    );
  };

  const remove = (lineId: string) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  };

  const clear = () => {
    setItems([]);
  };

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
