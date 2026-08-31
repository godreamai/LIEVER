"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/lib/types";

const STORAGE_KEY = "liever_cart_items_v1";

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
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
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

    setItems((prev) => {
      const exists = prev.find((i) => i.slug === p.slug);
      if (exists) {
        return prev.map((i) => (i.slug === p.slug ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, newItem];
    });

    setIsDrawerOpen(true);
  };

  const inc = (slug: string) => {
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty: i.qty + 1 } : i)));
  };

  const dec = (slug: string) => {
    setItems((prev) =>
      prev.flatMap((i) => (i.slug === slug ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i]))
    );
  };

  const remove = (slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
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
