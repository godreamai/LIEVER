"use client";

import { useState } from "react";
import { Card } from "@/components/ds/Card";
import { Icon } from "@/components/ds/Icon";
import { Badge } from "@/components/ds/Badge";
import { Button } from "@/components/ds/Button";
import { Input } from "@/components/ds/Input";
import { OrdersTable } from "@/components/ds/OrdersTable";
import { useAdminOrders } from "@/components/admin-orders-context";
import { NEXT_STEP } from "@/lib/adminData";
import type { Order, OrderStatus } from "@/lib/types";

const ORDER_FILTERS: { id: OrderStatus | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "pendiente", label: "Pendientes" },
  { id: "confirmado", label: "Confirmados" },
  { id: "en_preparacion", label: "En preparación" },
  { id: "enviado", label: "Enviados" },
  { id: "entregado", label: "Entregados" },
];

const STATUS_OPTIONS: { id: OrderStatus; label: string }[] = [
  { id: "pendiente", label: "Pendiente" },
  { id: "confirmado", label: "Confirmado" },
  { id: "en_preparacion", label: "En preparación" },
  { id: "enviado", label: "Enviado" },
  { id: "entregado", label: "Entregado" },
  { id: "cancelado", label: "Cancelado" },
];

const EMPTY_CUSTOM_ORDER = { customer: "", phone: "", summary: "", total: "", zip: "", status: "pendiente" as OrderStatus };

export default function AdminOrdersPage() {
  const { orders, advance, whatsapp, lastMessage, addOrder } = useAdminOrders();
  const [filter, setFilter] = useState<OrderStatus | "todos">("todos");
  const [creating, setCreating] = useState<typeof EMPTY_CUSTOM_ORDER | null>(null);
  const rows = (filter === "todos" ? orders : orders.filter((o) => o.status === filter)).map((o) => ({ ...o, nextLabel: NEXT_STEP[o.status]?.label }));

  const canSave = !!creating && creating.customer.trim() !== "" && creating.summary.trim() !== "" && creating.total !== "";

  const saveCustomOrder = () => {
    if (!creating || !canSave) return;
    const order: Omit<Order, "id" | "date"> = {
      customer: creating.customer.trim(),
      phone: creating.phone.trim(),
      summary: creating.summary.trim(),
      status: creating.status,
      total: Number(creating.total) || 0,
      zip: creating.zip.trim(),
    };
    addOrder(order);
    setCreating(null);
  };

  return (
    <div data-screen-label="Admin · Pedidos">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h2 style={{ fontSize: 26, margin: 0 }}>Pedidos</h2>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
            {rows.length} de {orders.length}
          </span>
          <Button size="sm" icon={<Icon name="plus" size={14} color="var(--white)" />} onClick={() => setCreating(EMPTY_CUSTOM_ORDER)}>
            Nuevo pedido personalizado
          </Button>
        </div>
      </div>
      {creating && (
        <Card style={{ padding: 22, marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, margin: "0 0 16px" }}>Nuevo pedido personalizado</h3>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, alignItems: "end" }}>
            <Input label="Cliente" value={creating.customer} onChange={(e) => setCreating({ ...creating, customer: e.target.value })} placeholder="Ej: Marina G." mono={false} />
            <Input label="Teléfono" value={creating.phone} onChange={(e) => setCreating({ ...creating, phone: e.target.value })} placeholder="+54 9 336 400-1122" />
            <Input label="CP" value={creating.zip} onChange={(e) => setCreating({ ...creating, zip: e.target.value })} placeholder="2900" />
            <Input label="Total" value={creating.total} onChange={(e) => setCreating({ ...creating, total: e.target.value })} placeholder="21300" />
          </div>
          <div style={{ marginTop: 14 }}>
            <Input
              label="Pedido / detalle"
              value={creating.summary}
              onChange={(e) => setCreating({ ...creating, summary: e.target.value })}
              placeholder="Ej: Mesa ratona a medida, roble, 90 × 50 cm"
              mono={false}
            />
          </div>
          <div style={{ marginTop: 14 }}>
            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Estado inicial</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {STATUS_OPTIONS.map((s) => (
                <div key={s.id} onClick={() => setCreating({ ...creating, status: s.id })} style={{ cursor: "pointer", opacity: creating.status === s.id ? 1 : 0.45 }}>
                  <Badge status={s.id} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
            <Button variant="secondary" size="sm" onClick={() => setCreating(null)}>
              Cancelar
            </Button>
            <Button size="sm" disabled={!canSave} onClick={saveCustomOrder}>
              Guardar pedido
            </Button>
          </div>
        </Card>
      )}
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
