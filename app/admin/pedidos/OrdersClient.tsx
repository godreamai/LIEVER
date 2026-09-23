"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ds/Card";
import { Icon } from "@/components/ds/Icon";
import { Badge } from "@/components/ds/Badge";
import { Button } from "@/components/ds/Button";
import { Input } from "@/components/ds/Input";
import { OrdersPanel } from "@/components/admin/OrdersPanel";
import { createManualOrderAction } from "./actions";
import type { Order, OrderStatus } from "@/lib/types";

const ORDER_FILTERS: { id: OrderStatus | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "pendiente", label: "Pendientes" },
  { id: "confirmado", label: "Confirmados" },
  { id: "en_preparacion", label: "En preparación" },
  { id: "enviado", label: "Enviados" },
  { id: "entregado", label: "Entregados" },
  { id: "cancelado", label: "Cancelados" },
];

const STATUS_OPTIONS = ORDER_FILTERS.filter((f): f is { id: OrderStatus; label: string } => f.id !== "todos");

const EMPTY_CUSTOM_ORDER = { customer: "", phone: "", summary: "", total: "", zip: "", status: "pendiente" as OrderStatus };

export function OrdersClient({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<OrderStatus | "todos">("todos");
  const [creating, setCreating] = useState<typeof EMPTY_CUSTOM_ORDER | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  const rows = filter === "todos" ? orders : orders.filter((o) => o.status === filter);
  const canSave = !!creating && creating.customer.trim() !== "" && creating.summary.trim() !== "" && creating.total !== "";

  const saveCustomOrder = () => {
    if (!creating || !canSave) return;
    setError(null);
    startSaving(async () => {
      const res = await createManualOrderAction({
        customer: creating.customer,
        phone: creating.phone,
        zip: creating.zip,
        summary: creating.summary,
        total: Number(creating.total),
        status: creating.status,
      });
      if (res.ok) setCreating(null);
      else setError(res.error ?? "No se pudo guardar el pedido.");
    });
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
          {error && <p style={{ color: "var(--accent)", fontSize: 13, margin: "14px 0 0" }}>{error}</p>}
          <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
            <Button variant="secondary" size="sm" onClick={() => setCreating(null)}>
              Cancelar
            </Button>
            <Button size="sm" disabled={!canSave || saving} onClick={saveCustomOrder}>
              {saving ? "Guardando…" : "Guardar pedido"}
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
      <OrdersPanel orders={rows} />
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
