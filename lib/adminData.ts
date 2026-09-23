import { money } from "./data";
import type { Order, OrderStatus } from "./types";

export interface NextStep {
  status: OrderStatus;
  label: string;
  msg: (o: Order) => string;
}

const firstName = (o: Order) => o.customer.split(" ")[0];

export const NEXT_STEP: Partial<Record<OrderStatus, NextStep>> = {
  pendiente: {
    status: "confirmado",
    label: "Confirmar",
    msg: (o) => `Hola ${firstName(o)}! Confirmamos tu pedido #${o.number}. Total ${money(o.total)}. Lo empezamos a producir hoy.`,
  },
  confirmado: {
    status: "en_preparacion",
    label: "En preparación",
    msg: (o) => `Hola ${firstName(o)}! Tu pedido #${o.number} ya está en producción. Te aviso cuando salga del taller.`,
  },
  en_preparacion: {
    status: "enviado",
    label: "Despachar",
    msg: (o) => `Hola ${firstName(o)}! Despachamos tu pedido #${o.number}${o.zip ? ` al CP ${o.zip}` : ""}. Te paso el seguimiento en cuanto lo tenga.`,
  },
  enviado: {
    status: "entregado",
    label: "Entregado",
    msg: (o) => `Hola ${firstName(o)}! Nos figura entregado el pedido #${o.number}. ¿Llegó todo bien?`,
  },
};

export const ADMIN_NAV = [
  { id: "dash", label: "Dashboard", icon: "layout-dashboard", href: "/admin" },
  { id: "pedidos", label: "Pedidos", icon: "clipboard-list", href: "/admin/pedidos" },
  { id: "productos", label: "Productos", icon: "box", href: "/admin/productos" },
  { id: "categorias", label: "Categorías", icon: "layers", href: "/admin/categorias" },
  { id: "estadisticas", label: "Estadísticas", icon: "file-text", href: "/admin/estadisticas" },
  { id: "envios", label: "Tarifas de envío", icon: "truck", href: "/admin/envios" },
  { id: "perfil", label: "Mi perfil", icon: "user", href: "/admin/perfil" },
];
