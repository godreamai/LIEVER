// Parte pura de las tarifas de envío: sin acceso a Supabase, para poder usarla también en el navegador.

export interface ShippingZone {
  id: string;
  name: string;
  cpFrom: number | null;
  cpTo: number | null;
  price: number;
  isDefault: boolean;
}

/** Precio de envío para un CP de 4 dígitos, o null si el CP todavía no es válido. */
export function quoteShipping(zones: ShippingZone[], zip: string): number | null {
  if (!/^\d{4}$/.test(zip)) return null;
  const cp = Number(zip);
  const zone = zones.find((z) => !z.isDefault && z.cpFrom !== null && z.cpTo !== null && cp >= z.cpFrom && cp <= z.cpTo) ?? zones.find((z) => z.isDefault);
  return zone ? zone.price : 0;
}
