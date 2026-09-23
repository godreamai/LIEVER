export interface Spec {
  label: string;
  value: string;
}

// Seleccionable de un producto (ej: "Color"). Si `affectsPrice`, entra a la matriz de precios.
export interface ProductOption {
  name: string;
  values: string[];
  affectsPrice: boolean;
}

// Precio final de una combinación de opciones.
export interface ProductVariant {
  combo: Record<string, string>;
  price: number;
}

export interface Product {
  slug: string;
  name: string;
  price: number;
  measure: string;
  category: string;
  image: string | null;
  desc: string;
  specs: Spec[];
  personalizable?: boolean;
  accesorios?: string[];
  tiempoFabricacion?: string;
  entrega?: { envio: boolean; retiro: boolean; nota?: string };
  options: ProductOption[];
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  index: string;
  name: string;
  icon?: string;
  image?: string | null;
  count: number;
}

export interface CartItem {
  lineId: string; // slug + selección: el mismo producto con otras opciones es otra línea
  slug: string;
  name: string;
  price: number;
  measure: string;
  image: string | null;
  qty: number;
}

export type OrderStatus =
  | "pendiente"
  | "confirmado"
  | "en_preparacion"
  | "enviado"
  | "entregado"
  | "cancelado";

export interface Order {
  id: string;
  customer: string;
  phone: string;
  summary: string;
  status: OrderStatus;
  total: number;
  date: string;
  zip: string;
}

// Modelo real de producto usado por el CRUD del admin (Supabase), a diferencia
// del Product público que solo expone el nombre de categoría, no su id.
export interface ProductAdmin {
  id: string;
  slug: string;
  name: string;
  price: number;
  measure: string;
  categoryId: string | null;
  categoryName: string | null;
  image: string | null;
  desc: string;
  specs: Spec[];
  personalizable?: boolean;
  accesorios?: string[];
  tiempoFabricacion?: string;
  entrega?: { envio: boolean; retiro: boolean; nota?: string };
  options: ProductOption[];
  variants: ProductVariant[];
  active: boolean;
}
