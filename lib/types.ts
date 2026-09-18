export interface Spec {
  label: string;
  value: string;
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
  medidas?: string[];
  colores?: string[];
  personalizable?: boolean;
  accesorios?: string[];
  tiempoFabricacion?: string;
  entrega?: { envio: boolean; retiro: boolean; nota?: string };
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
  medidas?: string[];
  colores?: string[];
  personalizable?: boolean;
  accesorios?: string[];
  tiempoFabricacion?: string;
  entrega?: { envio: boolean; retiro: boolean; nota?: string };
  active: boolean;
}
