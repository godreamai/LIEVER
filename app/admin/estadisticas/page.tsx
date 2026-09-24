import Link from "next/link";
import { Card } from "@/components/ds/Card";
import { StatCard } from "@/components/ds/StatCard";
import { createClient } from "@/lib/supabase/server";

interface Row {
  path: string;
  n: number;
}

interface Summary {
  page_views: number;
  whatsapp_clicks: number;
  add_to_cart: number;
  orders_web: number;
  orders_manual: number;
  top_pages: Row[];
  top_products: Row[];
  whatsapp_by_page: Row[];
}

const PERIODS = [7, 30, 90];

function RankList({ title, rows, empty }: { title: string; rows: Row[]; empty: string }) {
  const max = rows[0]?.n ?? 1;
  return (
    <Card style={{ padding: 20 }}>
      <h3 style={{ fontSize: 15, margin: "0 0 14px" }}>{title}</h3>
      {rows.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{empty}</p>
      ) : (
        rows.map((r) => (
          <div key={r.path} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, marginBottom: 5 }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.path}</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{r.n}</span>
            </div>
            <div style={{ height: 4, background: "var(--bg-alt)" }}>
              <div style={{ width: (r.n / max) * 100 + "%", height: 4, background: "var(--wood)" }} />
            </div>
          </div>
        ))
      )}
    </Card>
  );
}

export default async function AdminStatsPage({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  const { dias } = await searchParams;
  const days = PERIODS.includes(Number(dias)) ? Number(dias) : 30;

  const { data, error } = await (await createClient()).rpc("analytics_summary", { p_days: days });
  if (error || !data) {
    return (
      <Card style={{ padding: 32, textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>No se pudieron cargar las estadísticas. Verificá que la migración de estadísticas esté aplicada en Supabase.</p>
      </Card>
    );
  }
  const s = data as Summary;
  const orders = s.orders_web + s.orders_manual;
  const perOrder = s.orders_web > 0 ? Math.round(s.page_views / s.orders_web) : null;

  return (
    <div data-screen-label="Admin · Estadísticas">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, margin: 0 }}>Estadísticas</h2>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>Últimos {days} días · sin cookies ni datos personales</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {PERIODS.map((p) => (
            <Link
              key={p}
              href={`/admin/estadisticas?dias=${p}`}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: ".04em",
                textTransform: "uppercase",
                padding: "6px 11px",
                borderRadius: "var(--radius)",
                border: "1px solid " + (p === days ? "var(--ink)" : "var(--border-strong)"),
                background: p === days ? "var(--ink)" : "transparent",
                color: p === days ? "var(--white)" : "var(--ink-soft)",
              }}
            >
              {p} días
            </Link>
          ))}
        </div>
      </div>

      <div className="grid g4 gtight" style={{ marginBottom: 32 }}>
        <StatCard label="Visitas a páginas" value={s.page_views} hint="páginas vistas" />
        <StatCard label="Clics en WhatsApp" value={s.whatsapp_clicks} hint="botones y enlaces" />
        <StatCard label="Agregados al carrito" value={s.add_to_cart} hint="productos sumados" />
        <StatCard label="Pedidos" value={orders} hint={`${s.orders_web} web · ${s.orders_manual} cargados a mano`} />
      </div>

      {perOrder !== null && (
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "-12px 0 28px" }}>
          Se necesitaron unas <strong style={{ color: "var(--ink)" }}>{perOrder}</strong> páginas vistas por cada pedido hecho desde la web.
        </p>
      )}

      <div className="grid g3">
        <RankList title="Páginas más vistas" rows={s.top_pages} empty="Todavía no hay visitas registradas." />
        <RankList title="Productos más vistos" rows={s.top_products} empty="Todavía no hay visitas a productos." />
        <RankList title="Clics en WhatsApp por página" rows={s.whatsapp_by_page} empty="Todavía no hay clics registrados." />
      </div>

      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 24, maxWidth: 640, lineHeight: 1.5 }}>
        Las visitas no incluyen buscadores, vistas previas de enlaces ni tu propia navegación en el admin. Como no se usan cookies, no se distingue entre personas: son páginas vistas, no visitantes únicos.
      </p>
    </div>
  );
}
