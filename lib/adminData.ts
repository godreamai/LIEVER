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
  { id: "dash", label: "Dashboard", icon: "layout-dashboard", href: "/panel-de-administrador" },
  { id: "pedidos", label: "Pedidos", icon: "clipboard-list", href: "/panel-de-administrador/pedidos" },
  { id: "productos", label: "Productos", icon: "box", href: "/panel-de-administrador/productos" },
  { id: "categorias", label: "Categorías", icon: "layers", href: "/panel-de-administrador/categorias" },
  { id: "estadisticas", label: "Estadísticas", icon: "file-text", href: "/panel-de-administrador/estadisticas" },
  { id: "envios", label: "Tarifas de envío", icon: "truck", href: "/panel-de-administrador/envios" },
  { id: "perfil", label: "Mi perfil", icon: "user", href: "/panel-de-administrador/perfil" },
];
