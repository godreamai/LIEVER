import React from "react";
import type { OrderStatus } from "@/lib/types";

const STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  pendiente: { label: "Pendiente", bg: "var(--status-pendiente-bg)", fg: "var(--status-pendiente-fg)" },
  confirmado: { label: "Confirmado", bg: "var(--status-confirmado-bg)", fg: "var(--status-confirmado-fg)" },
  en_preparacion: { label: "En preparación", bg: "var(--status-preparacion-bg)", fg: "var(--status-preparacion-fg)" },
  enviado: { label: "Enviado", bg: "var(--status-enviado-bg)", fg: "var(--status-enviado-fg)" },
  entregado: { label: "Entregado", bg: "var(--status-entregado-bg)", fg: "var(--status-entregado-fg)" },
  cancelado: { label: "Cancelado", bg: "rgba(42,36,32,.10)", fg: "var(--ink-soft)" },
};

export const ORDER_STATUSES = Object.keys(STATUS);

export function Badge({
  status = "pendiente",
  children,
  style,
}: {
  status?: OrderStatus;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const s = STATUS[status] || STATUS.pendiente;
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        lineHeight: 1.4,
        padding: "4px 9px",
        borderRadius: "var(--radius)",
        border: "none",
        display: "inline-block",
        whiteSpace: "nowrap",
        background: s.bg,
        color: s.fg,
        ...style,
      }}
    >
      {children || s.label}
    </span>
  );
}
