import Link from "next/link";
import { StatCard } from "@/components/ds/StatCard";
import { Card } from "@/components/ds/Card";
import { Badge } from "@/components/ds/Badge";
import { OrdersPanel } from "@/components/admin/OrdersPanel";
import { getOrders } from "@/lib/orders";
import { money } from "@/lib/data";

const DAY = 24 * 60 * 60 * 1000;
const currentTime = () => Date.now();

export default async function AdminDashboard() {
  let orders;
  try {
    orders = await getOrders();
  } catch {
    return (
      <Card style={{ padding: 32, textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>No se pudieron cargar los pedidos. Verificá que la migración de pedidos esté aplicada en Supabase.</p>
      </Card>
    );
  }

  const now = currentTime();
  const last30 = orders.filter((o) => o.status !== "cancelado" && now - new Date(o.createdAt).getTime() <= 30 * DAY);
  const pending = orders.filter((o) => o.status === "pendiente");
  const stale = pending.filter((o) => now - new Date(o.createdAt).getTime() > DAY);
  const inProgress = orders.filter((o) => o.status === "confirmado" || o.status === "en_preparacion").length;
  const revenue = last30.reduce((s, o) => s + o.total, 0);
  const average = last30.length ? Math.round(revenue / last30.length) : 0;

  // Productos más pedidos en los últimos 30 días (solo pedidos del carrito, que tienen detalle por producto).
  const byProduct = new Map<string, number>();
  last30.forEach((o) => o.items.forEach((i) => byProduct.set(i.name, (byProduct.get(i.name) ?? 0) + i.qty)));
  const top = [...byProduct.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  const topMax = top[0]?.[1] ?? 1;

  const today = new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div data-screen-label="Admin · Dashboard">
      <div style={{ marginBottom: 30 }}>
        <h2 style={{ fontSize: 26, margin: 0 }}>Dashboard</h2>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", textTransform: "capitalize" }}>{today} · últimos 30 días</span>
      </div>
      <div className="grid g4 gtight" style={{ marginBottom: 36 }}>
        <StatCard label="Pedidos pendientes" value={pending.length} alert={pending.length > 0} hint="sin confirmar" />
        <StatCard label="En curso" value={inProgress} hint="confirmados + en preparación" />
        <StatCard label="Ticket promedio" value={money(average)} small hint="por pedido" />
        <StatCard label="Facturado 30 días" value={money(revenue)} small hint={`${last30.length} ${last30.length === 1 ? "pedido" : "pedidos"}`} />
      </div>
      <div className="grid" style={{ gridTemplateColumns: "minmax(0,1.7fr) minmax(260px,1fr)", gap: 24, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <h3 style={{ fontSize: 17, margin: 0 }}>Últimos pedidos</h3>
            <Link href="/panel-de-administrador/pedidos" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)" }}>
              ver todos →
            </Link>
          </div>
          <OrdersPanel orders={orders.slice(0, 4)} />
        </div>
        <div>
          <h3 style={{ fontSize: 17, margin: "0 0 14px" }}>Más pedidos del mes</h3>
          <Card style={{ padding: 20 }}>
            {top.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Todavía no hay pedidos este mes.</p>
            ) : (
              top.map(([name, qty]) => (
                <div key={name} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                    <span>{name}</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{qty}</span>
                  </div>
                  <div style={{ height: 4, background: "var(--bg-alt)" }}>
                    <div style={{ width: (qty / topMax) * 100 + "%", height: 4, background: "var(--wood)" }} />
                  </div>
                </div>
              ))
            )}
          </Card>
          <Card style={{ padding: 20, marginTop: 18 }}>
            <h4 style={{ fontSize: 14, margin: "0 0 10px" }}>Pendientes hace más de 24 h</h4>
            {stale.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Nada atrasado.</p>
            ) : (
              stale.map((o) => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", fontSize: 13 }}>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>#{o.number}</span>
                  <span>{o.customer}</span>
                  <Badge status="pendiente" />
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
