import type { ProductOption, ProductVariant } from "@/lib/types";

// Tope de combinaciones en la matriz de precios de un producto.
export const MAX_COMBOS = 60;

export type Combo = Record<string, string>;

export function priceOptions(options: ProductOption[]): ProductOption[] {
  return options.filter((o) => o.affectsPrice && o.values.length > 0);
}

// Producto cartesiano de las opciones que afectan el precio.
export function buildCombos(options: ProductOption[]): Combo[] {
  return priceOptions(options).reduce<Combo[]>(
    (acc, o) => acc.flatMap((c) => o.values.map((v) => ({ ...c, [o.name]: v }))),
    [{}],
  );
}

export function comboKey(combo: Combo): string {
  return Object.keys(combo)
    .sort()
    .map((k) => `${k}:${combo[k]}`)
    .join("|");
}

// Variante cargada para la selección actual (solo mira las opciones que afectan el precio).
export function findVariant(options: ProductOption[], variants: ProductVariant[], selection: Combo): ProductVariant | undefined {
  const combo: Combo = {};
  priceOptions(options).forEach((o) => {
    combo[o.name] = selection[o.name];
  });
  const key = comboKey(combo);
  return variants.find((v) => comboKey(v.combo) === key);
}

// Texto para carrito y mensaje de WhatsApp: "Medida: 150x70 · Color: Roble".
export function selectionLabel(options: ProductOption[], selection: Combo): string {
  return options
    .filter((o) => selection[o.name])
    .map((o) => `${o.name}: ${selection[o.name]}`)
    .join(" · ");
}
