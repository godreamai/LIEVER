"use server";

import { revalidatePath } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

export interface PlaceOrderInput {
  customer: string;
  phone: string;
  zip: string;
  items: { slug: string; qty: number; selection?: Record<string, string> }[];
}

export type PlaceOrderResult =
  | { ok: true; number: number; subtotal: number; shipping: number; total: number }
  | { ok: false; error: string };

const ERRORS: Record<string, string> = {
  invalid_customer: "Ingresá tu nombre.",
  invalid_zip: "El código postal tiene que ser de 4 números.",
  invalid_items: "Revisá las cantidades de tu carrito.",
  out_of_stock: "Alguno de los productos se quedó sin stock. Quitalo del carrito y probá de nuevo.",
  too_many_orders: "Hay muchos pedidos en este momento. Probá de nuevo en unos minutos.",
  invalid_selection: "Alguna de las opciones elegidas ya no está disponible. Quitá el producto del carrito y volvé a elegirlo.",
  unknown_product: "Alguno de los productos ya no está disponible. Quitalo del carrito y probá de nuevo.",
};

// Los montos NO se toman del navegador: place_order (Supabase) recalcula precios y envío.
export async function placeOrderAction(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const { data, error } = await createPublicClient().rpc("place_order", {
    p_customer: input.customer,
    p_phone: input.phone,
    p_zip: input.zip,
    p_items: input.items,
  });

  if (error) {
    const known = Object.keys(ERRORS).find((code) => error.message.includes(code));
    return { ok: false, error: known ? ERRORS[known] : "No pudimos registrar el pedido." };
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return { ok: false, error: "No pudimos registrar el pedido." };

  revalidatePath("/admin", "layout");
  return { ok: true, number: Number(row.out_number), subtotal: Number(row.out_subtotal), shipping: Number(row.out_shipping), total: Number(row.out_total) };
}
