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
}

export interface Category {
  index: string;
  name: string;
  icon: string;
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

export interface AdminProduct {
  name: string;
  price: number;
  measure: string;
  stock: number;
  image: string | null;
}
