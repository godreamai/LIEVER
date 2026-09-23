"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const STATUSES: OrderStatus[] = ["pendiente", "confirmado", "en_preparacion", "enviado", "entregado", "cancelado"];

function refresh() {
  revalidatePath("/admin", "layout");
}

export async function setOrderStatusAction(id: string, status: OrderStatus): Promise<ActionResult> {
  if (!STATUSES.includes(status)) return { ok: false, error: "Estado inválido." };
  const { error } = await (await createClient()).from("orders").update({ status }).eq("id", id);
  if (error) return { ok: false, error: "No se pudo actualizar el pedido." };
  refresh();
  return { ok: true };
}

export interface ManualOrderInput {
  customer: string;
  phone: string;
  zip: string;
  summary: string;
  total: number;
  status: OrderStatus;
}

export async function createManualOrderAction(input: ManualOrderInput): Promise<ActionResult> {
  if (!input.customer.trim() || !input.summary.trim()) return { ok: false, error: "Completá el cliente y el detalle." };
  if (!Number.isFinite(input.total) || input.total < 0) return { ok: false, error: "El total no es válido." };
  if (!STATUSES.includes(input.status)) return { ok: false, error: "Estado inválido." };

  const { error } = await (await createClient()).from("orders").insert({
    customer: input.customer.trim(),
    phone: input.phone.trim() || null,
    zip: input.zip.trim() || null,
    summary: input.summary.trim(),
    subtotal: input.total,
    shipping: 0,
    total: input.total,
    status: input.status,
    source: "manual",
  });
  if (error) return { ok: false, error: "No se pudo guardar el pedido." };
  refresh();
  return { ok: true };
}
