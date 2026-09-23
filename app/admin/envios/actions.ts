"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SHIPPING_TAG } from "@/lib/shipping";

export interface ZoneInput {
  /** Vacío en las zonas nuevas: lo asigna la base. */
  id: string | null;
  name: string;
  cpFrom: number | null;
  cpTo: number | null;
  price: number;
  isDefault: boolean;
}

export async function saveShippingZonesAction(zones: ZoneInput[]): Promise<{ ok: boolean; error?: string }> {
  if (zones.filter((z) => z.isDefault).length !== 1) return { ok: false, error: "Tiene que haber exactamente una zona “Resto del país”." };
  for (const z of zones) {
    if (!z.name.trim()) return { ok: false, error: "Todas las zonas necesitan un nombre." };
    if (!Number.isFinite(z.price) || z.price < 0) return { ok: false, error: `El precio de “${z.name}” no es válido.` };
    if (!z.isDefault && (z.cpFrom === null || z.cpTo === null || z.cpFrom > z.cpTo)) return { ok: false, error: `El rango de CP de “${z.name}” no es válido.` };
  }

  const supabase = await createClient();
  const keep = zones.filter((z) => z.id).map((z) => z.id as string);

  const del = keep.length ? await supabase.from("shipping_zones").delete().not("id", "in", `(${keep.join(",")})`) : await supabase.from("shipping_zones").delete().not("id", "is", null);
  if (del.error) return { ok: false, error: "No se pudieron guardar las tarifas." };

  for (const [i, z] of zones.entries()) {
    const row = {
      name: z.name.trim(),
      cp_from: z.isDefault ? null : z.cpFrom,
      cp_to: z.isDefault ? null : z.cpTo,
      price: z.price,
      is_default: z.isDefault,
      sort_order: i + 1,
    };
    const res = z.id ? await supabase.from("shipping_zones").update(row).eq("id", z.id) : await supabase.from("shipping_zones").insert(row);
    if (res.error) return { ok: false, error: "No se pudieron guardar las tarifas." };
  }

  updateTag(SHIPPING_TAG);
  revalidatePath("/admin/envios");
  return { ok: true };
}
