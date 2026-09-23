import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { quoteShipping, type ShippingZone } from "@/lib/shippingQuote";

interface ZoneRow {
  id: string;
  name: string;
  cp_from: number | null;
  cp_to: number | null;
  price: number;
  is_default: boolean;
}

export type { ShippingZone };
export { quoteShipping };

export const SHIPPING_TAG = "shipping";

// Se usan solo si la tabla shipping_zones no responde, para que el carrito no quede sin estimación.
const FALLBACK_ZONES: ShippingZone[] = [
  { id: "fallback-1", name: "Zona 1 — San Nicolás y alrededores", cpFrom: 2900, cpTo: 2901, price: 4200, isDefault: false },
  { id: "fallback-2", name: "Zona 2 — Rosario / Santa Fe sur", cpFrom: 2000, cpTo: 2100, price: 5100, isDefault: false },
  { id: "fallback-3", name: "Zona 3 — AMBA", cpFrom: 1000, cpTo: 1900, price: 5800, isDefault: false },
  { id: "fallback-4", name: "Zona 4 — Resto del país", cpFrom: null, cpTo: null, price: 7400, isDefault: true },
];

const SELECT = "id, name, cp_from, cp_to, price, is_default";

function rowToZone(r: ZoneRow): ShippingZone {
  return { id: r.id, name: r.name, cpFrom: r.cp_from, cpTo: r.cp_to, price: Number(r.price), isDefault: r.is_default };
}

const fetchZones = unstable_cache(
  async (): Promise<ShippingZone[]> => {
    const { data, error } = await createPublicClient().from("shipping_zones").select(SELECT).order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data as ZoneRow[]).map(rowToZone);
  },
  ["shipping-zones"],
  { tags: [SHIPPING_TAG], revalidate: 300 }
);

export async function getShippingZones(): Promise<ShippingZone[]> {
  return fetchZones().then((z) => (z.length ? z : FALLBACK_ZONES)).catch(() => FALLBACK_ZONES);
}

export async function getAdminShippingZones(): Promise<ShippingZone[]> {
  const { data, error } = await (await createClient()).from("shipping_zones").select(SELECT).order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as ZoneRow[]).map(rowToZone);
}
