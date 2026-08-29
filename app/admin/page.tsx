"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ds/Icon";
import { StatCard } from "@/components/ds/StatCard";
import { OrdersTable } from "@/components/ds/OrdersTable";
import { Card } from "@/components/ds/Card";
import { Badge } from "@/components/ds/Badge";
import { useAdminOrders } from "@/components/admin-orders-context";
import { NEXT_STEP } from "@/lib/adminData";
import { money } from "@/lib/data";

export default function AdminDashboard() {
  const { orders, advance, whatsapp } = useAdminOrders();
  const router = useRouter();
  const pend = orders.filter((o) => o.status === "pendiente").length;
  const enCurso = orders.filter((o) => o.status === "confirmado" || o.status === "en_preparacion").length;
  const facturado = orders.filter((o) => o.status !== "cancelado").reduce((s, o) => s + o.total, 0);

  return (
    <div data-screen-label="Admin · Dashboard">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 30 }}>
        <div>
          <h2 style={{ fontSize: 26, margin: 0 }}>Dashboard</h2>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>Martes 12/03 · últimos 30 días</span>
        </div>
        <span style={{ display: "flex", gap: 7, alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-technical)" }}>
          <Icon name="clock" size={14} color="var(--line)" /> actualizado hace 2 min
        </span>
      </div>
      <div className="grid g4 gtight" style={{ marginBottom: 36 }}>
        <StatCard label="Pedidos pendientes" value={pend} alert hint="sin confirmar por WhatsApp" />
        <StatCard label="En curso" value={enCurso} hint="confirmados + en preparación" />
        <StatCard label="Tiempo prom. entrega" value="2.4" unit="días" hint="confirmación → entrega" />
        <StatCard label="Facturado 30 días" value={money(facturado)} small hint="6 pedidos" />
      </div>
      <div className="grid" style={{ gridTemplateColumns: "minmax(0,1.7fr) minmax(260px,1fr)", gap: 24, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <h3 style={{ fontSize: 17, margin: 0 }}>Últimos pedidos</h3>
            <span onClick={() => router.push("/admin/pedidos")} style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)", cursor: "pointer" }}>
              ver todos →
            </span>
          </div>
          <div className="table-scroll">
            <OrdersTable orders={orders.slice(0, 4).map((o) => ({ ...o, nextLabel: NEXT_STEP[o.status]?.label }))} onAdvance={advance} onWhatsApp={whatsapp} />
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: 17, margin: "0 0 14px" }}>Más pedidos del mes</h3>
          <Card style={{ padding: 20 }}>
            {[
              ["Portarretratos roble", 9],
              ["Cartel nombre a medida", 7],
              ["Set posavasos", 5],
              ["Repisa flotante 60 cm", 3],
            ].map(([n, q]) => (
              <div key={n} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                  <span>{n}</span>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{q}</span>
                </div>
                <div style={{ height: 4, background: "var(--bg-alt)" }}>
                  <div style={{ width: (Number(q) / 9) * 100 + "%", height: 4, background: "var(--wood)" }} />
                </div>
              </div>
            ))}
          </Card>
          <Card style={{ padding: 20, marginTop: 18 }}>
            <h4 style={{ fontSize: 14, margin: "0 0 10px" }}>Pendientes hace más de 24 h</h4>
            {orders
              .filter((o) => o.status === "pendiente")
              .map((o) => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", fontSize: 13 }}>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{o.id}</span>
                  <span>{o.customer}</span>
                  <Badge status="pendiente" />
                </div>
              ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
