import React from "react";
import { Badge } from "./Badge";
import { Icon } from "./Icon";
import type { Order } from "@/lib/types";

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 16px",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: ".04em",
  color: "var(--text-muted)",
  borderBottom: "1px solid var(--border-divider)",
  fontWeight: 600,
};

const td: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: 14,
  borderBottom: "1px solid rgba(42,36,32,.06)",
  verticalAlign: "middle",
};

function ActionButton({ tone = "default", children, onClick }: { tone?: "default" | "wa"; children?: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: 11,
        border: `1px solid ${tone === "wa" ? "var(--green)" : "var(--border-strong)"}`,
        color: tone === "wa" ? "var(--green)" : "var(--ink)",
        background: "var(--white)",
        padding: "5px 9px",
        cursor: "pointer",
        borderRadius: "var(--radius)",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      {children}
    </button>
  );
}

export type OrderRow = Order & { nextLabel?: string };

export function OrdersTable({
  orders = [],
  showActions = true,
  onAdvance,
  onWhatsApp,
  style,
}: {
  orders: OrderRow[];
  showActions?: boolean;
  onAdvance?: (o: OrderRow) => void;
  onWhatsApp?: (o: OrderRow) => void;
  style?: React.CSSProperties;
}) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface-card)", border: "1px solid var(--border-card)", ...style }}>
      <thead>
        <tr>
          <th style={th}>Pedido</th>
          <th style={th}>Cliente</th>
          <th style={th}>Producto</th>
          <th style={th}>Estado</th>
          <th style={{ ...th, textAlign: "right" }}>Total</th>
          {showActions && <th style={th}>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td style={{ ...td, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>{o.id}</td>
            <td style={{ ...td, fontWeight: 500 }}>{o.customer}</td>
            <td style={td}>{o.summary}</td>
            <td style={td}>
              <Badge status={o.status} />
            </td>
            <td style={{ ...td, fontFamily: "var(--font-mono)", textAlign: "right" }}>{"$" + o.total.toLocaleString("es-AR")}</td>
            {showActions && (
              <td style={td}>
                <div style={{ display: "flex", gap: 6 }}>
                  {o.nextLabel && (
                    <ActionButton onClick={() => onAdvance && onAdvance(o)}>
                      <Icon name="check" size={12} />
                      {o.nextLabel}
                    </ActionButton>
                  )}
                  <ActionButton tone="wa" onClick={() => onWhatsApp && onWhatsApp(o)}>
                    <Icon name="message-circle" size={12} color="var(--green)" />
                    WhatsApp
                  </ActionButton>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
