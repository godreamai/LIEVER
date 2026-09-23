import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ds/Button";
import { Card } from "@/components/ds/Card";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { WA } from "@/lib/data";
import { SOLUTIONS } from "@/lib/solutions";

export const metadata: Metadata = {
  title: "Soluciones por necesidad",
  description: "Abrir o renovar un comercio, dividir un ambiente, elegir un panel ranurado o resolver un proyecto a medida: te mostramos por dónde empezar.",
};

export default function SolucionesPage() {
  const waAyuda = WA + encodeURIComponent("Hola Liever! No sé bien qué necesito para mi espacio, ¿me pueden asesorar?");

  return (
    <div data-screen-label="Soluciones">
      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderBottom: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <Eyebrow style={{ marginBottom: 12 }}>Soluciones por necesidad</Eyebrow>
          <h1 style={{ fontSize: "clamp(30px,4.5vw,44px)", margin: "0 0 18px", maxWidth: 700 }}>¿Qué necesitás resolver hoy?</h1>
          <p className="lead" style={{ color: "var(--text-muted)", fontSize: 16, margin: "0 0 28px", maxWidth: 620 }}>
            No siempre es fácil saber qué producto pedir. Elegí la situación que más se parece a la tuya y te mostramos por dónde empezar.
          </p>
          <div className="row" style={{ gap: 14 }}>
            <Button as="a" href="/productos?categoria=todos">
              Ver el catálogo
            </Button>
            <Button as="a" href={waAyuda} target="_blank" variant="secondary" icon={<Icon name="message-circle" size={16} />}>
              Consultanos
            </Button>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ padding: "70px 20px" }}>
        <div className="grid g3">
          {SOLUTIONS.map((s) => (
            <Card key={s.slug} style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(181,103,61,.1)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={s.icon} size={22} color="var(--accent)" />
              </span>
              <h2 style={{ fontSize: 19, margin: 0 }}>{s.title}</h2>
              <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, margin: 0, flex: 1 }}>{s.description}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                <Button as="a" href={s.cta.href} size="sm">
                  {s.cta.label}
                </Button>
                {s.catalog && (
                  <Link href={s.catalog.href} style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>
                    {s.catalog.label} →
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderTop: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <SectionTitle eyebrow="Dos caminos" title="¿Del catálogo o a medida?" size="lg" style={{ textAlign: "center", marginBottom: 28 }} />
          <div className="grid g2" style={{ width: "100%" }}>
            {[
              {
                title: "Comprar del catálogo",
                desc: "Productos listos para pedir online, con precio y medidas a la vista. Es lo más rápido si ya encontraste lo que buscás.",
                cta: { label: "Ver el catálogo", href: "/productos?categoria=todos" },
              },
              {
                title: "Pedir algo a medida",
                desc: "Si necesitás otra medida, un color, tu logo o una pieza que no está publicada, la diseñamos con vos y te pasamos un presupuesto.",
                cta: { label: "Pedir a medida", href: "/personalizado" },
              },
            ].map((o) => (
              <Card key={o.title} style={{ padding: 28, display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
                <h3 style={{ fontSize: 19, margin: 0 }}>{o.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, margin: 0, flex: 1 }}>{o.desc}</p>
                <Button as="a" href={o.cta.href} size="sm" variant="secondary" style={{ alignSelf: "flex-start" }}>
                  {o.cta.label}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
