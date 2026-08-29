"use client";

import React, { createContext, useContext, useState } from "react";
import { NEXT_STEP, ORDERS } from "@/lib/adminData";
import type { Order } from "@/lib/types";

interface AdminOrdersContextValue {
  orders: Order[];
  lastMessage: string | null;
  advance: (o: Order) => void;
  whatsapp: (o: Order) => void;
  clearMessage: () => void;
}

const AdminOrdersContext = createContext<AdminOrdersContextValue | null>(null);

export function AdminOrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const advance = (o: Order) => {
    const next = NEXT_STEP[o.status];
    if (!next) return;
    setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: next.status } : x)));
    setLastMessage(next.msg(o));
  };

  const whatsapp = (o: Order) => {
    const next = NEXT_STEP[o.status];
    setLastMessage((next ? next.msg(o) : `Hola ${o.customer.split(" ")[0]}! Te escribo por el pedido ${o.id}.`) + "  →  " + o.phone);
  };

  return (
    <AdminOrdersContext.Provider value={{ orders, lastMessage, advance, whatsapp, clearMessage: () => setLastMessage(null) }}>
      {children}
    </AdminOrdersContext.Provider>
  );
}

export function useAdminOrders() {
  const ctx = useContext(AdminOrdersContext);
  if (!ctx) throw new Error("useAdminOrders debe usarse dentro de <AdminOrdersProvider>");
  return ctx;
}
