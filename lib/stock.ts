import type { StockStatus } from "@/lib/types";

export const STOCK_OPTIONS: { value: StockStatus; label: string }[] = [
  { value: "disponible", label: "Disponible" },
  { value: "a_pedido", label: "A pedido (se fabrica al comprarlo)" },
  { value: "sin_stock", label: "Sin stock" },
];

/** Etiqueta corta para tarjetas y listados; null si no hace falta mostrar nada. */
export function stockBadge(stock: StockStatus): string | null {
  if (stock === "sin_stock") return "Sin stock";
  if (stock === "a_pedido") return "A pedido";
  return null;
}

/** Disponibilidad en el vocabulario de schema.org, para los datos estructurados de Google. */
export function schemaAvailability(stock: StockStatus): string {
  if (stock === "sin_stock") return "https://schema.org/OutOfStock";
  if (stock === "a_pedido") return "https://schema.org/MadeToOrder";
  return "https://schema.org/InStock";
}
