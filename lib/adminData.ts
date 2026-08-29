import { money, PHOTOS } from "./data";
import type { AdminProduct, Order, OrderStatus } from "./types";

export const ORDERS: Order[] = [
  { id: "#1042", customer: "Marina G.", phone: "+54 9 336 400-1122", summary: "Portarretratos roble ×2", status: "pendiente", total: 29000, date: "12/03 · 09:41", zip: "2900" },
  { id: "#1041", customer: "Julián R.", phone: "+54 9 341 555-8890", summary: "Cartel nombre a medida", status: "pendiente", total: 9800, date: "12/03 · 08:02", zip: "2000" },
  { id: "#1040", customer: "Sofía A.", phone: "+54 9 336 411-2030", summary: "Repisa flotante 60 cm", status: "confirmado", total: 21300, date: "11/03 · 19:15", zip: "2900" },
  { id: "#1039", customer: "Nico F.", phone: "+54 9 11 6070-1234", summary: "Set posavasos geométrico ×2", status: "en_preparacion", total: 14400, date: "11/03 · 12:48", zip: "1000" },
  { id: "#1038", customer: "Vale M.", phone: "+54 9 351 202-9911", summary: "Organizador escritorio", status: "enviado", total: 16900, date: "10/03 · 17:30", zip: "5000" },
  { id: "#1037", customer: "Diego P.", phone: "+54 9 336 477-6655", summary: "Cuadro geométrico 40 cm", status: "entregado", total: 12400, date: "08/03 · 10:05", zip: "2900" },
];

export interface NextStep {
  status: OrderStatus;
  label: string;
  msg: (o: Order) => string;
}

export const NEXT_STEP: Partial<Record<OrderStatus, NextStep>> = {
  pendiente: {
    status: "confirmado",
    label: "Confirmar",
    msg: (o) => `Hola ${o.customer.split(" ")[0]}! Confirmamos tu pedido ${o.id}. Total ${money(o.total)}. Lo empezamos a producir hoy.`,
  },
  confirmado: {
    status: "en_preparacion",
    label: "En preparación",
    msg: (o) => `Hola! Tu pedido ${o.id} ya está en producción. Te aviso cuando salga del taller.`,
  },
  en_preparacion: {
    status: "enviado",
    label: "Despachar",
    msg: (o) => `Hola! Despachamos tu pedido ${o.id} al CP ${o.zip}. Te paso el seguimiento en cuanto lo tenga.`,
  },
  enviado: {
    status: "entregado",
    label: "Entregado",
    msg: (o) => `Hola! Nos figura entregado el pedido ${o.id}. ¿Llegó todo bien?`,
  },
};

export const ADMIN_NAV = [
  { id: "dash", label: "Dashboard", icon: "layout-dashboard", href: "/admin" },
  { id: "pedidos", label: "Pedidos", icon: "clipboard-list", href: "/admin/pedidos" },
  { id: "productos", label: "Productos", icon: "box", href: "/admin/productos" },
  { id: "envios", label: "Tarifas de envío", icon: "truck", href: "/admin/envios" },
];

export const ADMIN_PRODUCTS: AdminProduct[] = [
  { name: "Portarretratos roble", price: 14500, measure: "30 × 18 cm", stock: 6, image: PHOTOS.router },
  { name: "Cartel nombre a medida", price: 9800, measure: "40 × 12 cm", stock: 3, image: PHOTOS.panels },
  { name: "Repisa flotante 60 cm", price: 21300, measure: "60 × 12 cm", stock: 4, image: PHOTOS.tools },
  { name: "Set posavasos geométrico", price: 7200, measure: "10 × 10 cm", stock: 12, image: PHOTOS.wallart },
  { name: "Organizador escritorio", price: 16900, measure: "28 × 14 cm", stock: 2, image: PHOTOS.workshop },
  { name: "Cuadro geométrico 40 cm", price: 12400, measure: "40 × 40 cm", stock: 5, image: PHOTOS.wallart },
];

export const SHIP_ZONES = [
  { zone: "Zona 1 — San Nicolás y alrededores", cp: "2900 · 2901", price: 4200 },
  { zone: "Zona 2 — Rosario / Santa Fe sur", cp: "2000 · 2100", price: 5100 },
  { zone: "Zona 3 — AMBA", cp: "1000 – 1900", price: 5800 },
  { zone: "Zona 4 — Resto del país", cp: "otros", price: 7400 },
];

export const ZONES: Record<string, number> = { "2900": 4200, "2000": 5100, "1000": 5800, "5000": 7400 };
