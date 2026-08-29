"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { CartItem, Product } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  add: (p: Product) => void;
  inc: (slug: string) => void;
  dec: (slug: string) => void;
  remove: (slug: string) => void;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (p: Product) =>
    setItems((prev) =>
      prev.some((i) => i.slug === p.slug)
        ? prev.map((i) => (i.slug === p.slug ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { slug: p.slug, name: p.name, price: p.price, measure: p.measure, image: p.image, qty: 1 }]
    );
  const inc = (slug: string) => setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty: i.qty + 1 } : i)));
  const dec = (slug: string) =>
    setItems((prev) => prev.flatMap((i) => (i.slug === slug ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i])));
  const remove = (slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug));

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  return <CartContext.Provider value={{ items, add, inc, dec, remove, count }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
