"use client";

import { useState } from "react";
import { Card } from "@/components/ds/Card";
import { Icon } from "@/components/ds/Icon";
import { Badge } from "@/components/ds/Badge";
import { OrdersTable } from "@/components/ds/OrdersTable";
import { useAdminOrders } from "@/components/admin-orders-context";
import { NEXT_STEP } from "@/lib/adminData";
import type { OrderStatus } from "@/lib/types";

const ORDER_FILTERS: { id: OrderStatus | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "pendiente", label: "Pendientes" },
  { id: "confirmado", label: "Confirmados" },
  { id: "en_preparacion", label: "En preparación" },
  { id: "enviado", label: "Enviados" },
  { id: "entregado", label: "Entregados" },
];

export default function AdminOrdersPage() {
  const { orders, advance, whatsapp, lastMessage } = useAdminOrders();
  const [filter, setFilter] = useState<OrderStatus | "todos">("todos");
  const rows = (filter === "todos" ? orders : orders.filter((o) => o.status === filter)).map((o) => ({ ...o, nextLabel: NEXT_STEP[o.status]?.label }));

  return (
    <div data-screen-label="Admin · Pedidos">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h2 style={{ fontSize: 26, margin: 0 }}>Pedidos</h2>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
          {rows.length} de {orders.length}
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {ORDER_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: ".04em",
              textTransform: "uppercase",
              padding: "6px 11px",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              border: "1px solid " + (filter === f.id ? "var(--ink)" : "var(--border-strong)"),
              background: filter === f.id ? "var(--ink)" : "transparent",
              color: filter === f.id ? "var(--white)" : "var(--ink-soft)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      {lastMessage && (
        <Card style={{ padding: "14px 16px", marginBottom: 16, display: "flex", gap: 12, alignItems: "flex-start", borderColor: "var(--green)" }}>
          <Icon name="message-circle" size={16} color="var(--green)" />
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--green)", marginBottom: 4 }}>Mensaje pre-cargado — listo para enviar</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{lastMessage}</div>
          </div>
        </Card>
      )}
      <div className="table-scroll">
        <OrdersTable orders={rows} onAdvance={advance} onWhatsApp={whatsapp} />
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 20, alignItems: "center", flexWrap: "wrap", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
        <span>Flujo:</span>
        <Badge status="pendiente" />
        <Icon name="chevron-right" size={12} />
        <Badge status="confirmado" />
        <Icon name="chevron-right" size={12} />
        <Badge status="en_preparacion" />
        <Icon name="chevron-right" size={12} />
        <Badge status="enviado" />
        <Icon name="chevron-right" size={12} />
        <Badge status="entregado" />
      </div>
    </div>
  );
}
