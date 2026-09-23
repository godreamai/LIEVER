"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ds/Card";
import { Icon } from "@/components/ds/Icon";
import { OrdersTable } from "@/components/ds/OrdersTable";
import { setOrderStatusAction } from "@/app/admin/pedidos/actions";
import { NEXT_STEP } from "@/lib/adminData";
import { WA } from "@/lib/data";
import type { Order } from "@/lib/types";

function customerLink(o: Order, text: string) {
  const digits = o.phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : WA + encodeURIComponent(text);
}

/** Tabla de pedidos con sus acciones (avanzar de estado y escribirle al cliente por WhatsApp). */
export function OrdersPanel({ orders }: { orders: Order[] }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const rows = orders.map((o) => ({ ...o, nextLabel: NEXT_STEP[o.status]?.label }));

  const advance = (o: Order) => {
    const next = NEXT_STEP[o.status];
    if (!next) return;
    setError(null);
    startTransition(async () => {
      const res = await setOrderStatusAction(o.id, next.status);
      if (!res.ok) setError(res.error ?? "No se pudo actualizar el pedido.");
      // Avanzar el estado deja el aviso al cliente listo en una pestaña de WhatsApp.
      else window.open(customerLink(o, next.msg(o)), "_blank");
    });
  };

  const whatsapp = (o: Order) => {
    const next = NEXT_STEP[o.status];
    const text = next ? next.msg(o) : `Hola ${o.customer.split(" ")[0]}! Te escribo por el pedido #${o.number}.`;
    window.open(customerLink(o, text), "_blank");
  };

  if (orders.length === 0) {
    return (
      <Card style={{ padding: 32, textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>Todavía no hay pedidos. Cuando alguien envíe uno desde el carrito, va a aparecer acá.</p>
      </Card>
    );
  }

  return (
    <>
      {error && (
        <Card style={{ padding: "12px 16px", marginBottom: 14, display: "flex", gap: 10, alignItems: "center", borderColor: "var(--accent)" }}>
          <Icon name="x" size={14} color="var(--accent)" />
          <span style={{ fontSize: 13 }}>{error}</span>
        </Card>
      )}
      <div className="table-scroll" style={{ opacity: pending ? 0.6 : 1, transition: "opacity .15s ease" }}>
        <OrdersTable orders={rows} onAdvance={advance} onWhatsApp={whatsapp} />
      </div>
    </>
  );
}
