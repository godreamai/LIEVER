import { createClient } from "@/lib/supabase/server";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";

interface OrderRow {
  id: string;
  number: number;
  customer: string;
  phone: string | null;
  zip: string | null;
  items: OrderItem[] | null;
  summary: string;
  total: number;
  status: OrderStatus;
  created_at: string;
}

function rowToOrder(r: OrderRow): Order {
  return {
    id: r.id,
    number: Number(r.number),
    customer: r.customer,
    phone: r.phone ?? "",
    summary: r.summary,
    items: r.items ?? [],
    status: r.status,
    total: Number(r.total),
    createdAt: r.created_at,
    zip: r.zip ?? "",
  };
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await (await createClient()).from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as OrderRow[]).map(rowToOrder);
}

/** Cantidad de pedidos pendientes, para el contador del menú del admin. */
export async function getPendingOrdersCount(): Promise<number> {
  const { count } = await (await createClient()).from("orders").select("id", { count: "exact", head: true }).eq("status", "pendiente");
  return count ?? 0;
}
