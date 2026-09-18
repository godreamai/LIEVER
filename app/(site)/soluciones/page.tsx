import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { SOLUTIONS } from "@/lib/solutions";

export default function SolucionesPage() {
  return (
    <div data-screen-label="Soluciones">
      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderBottom: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <Eyebrow style={{ marginBottom: 12 }}>Soluciones por necesidad</Eyebrow>
          <h1 style={{ fontSize: "clamp(30px,4.5vw,44px)", margin: "0 0 18px", maxWidth: 700 }}>
            ¿Qué necesitás resolver hoy?
          </h1>
          <p className="lead" style={{ color: "var(--text-muted)", fontSize: 16, margin: 0, maxWidth: 620 }}>
            No siempre es fácil saber qué producto pedir. Elegí la situación que más se parece a la tuya y te contamos cómo podemos ayudarte.
          </p>
        </div>
      </section>

      <section className="wrap wrap--narrow" style={{ padding: "60px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {SOLUTIONS.map((s, i) => (
            <div
              key={s.slug}
              id={s.slug}
              style={{
                scrollMarginTop: 96,
                background: i % 2 === 0 ? "var(--surface-card)" : "var(--surface-alt)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius-lg)",
                padding: "32px 30px",
                display: "flex",
                alignItems: "flex-start",
                gap: 22,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "rgba(181,103,61,.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name={s.icon} size={24} color="var(--accent)" />
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <h2 style={{ fontSize: 20, margin: "0 0 10px" }}>{s.title}</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, margin: "0 0 18px", maxWidth: 560 }}>{s.description}</p>
                <Button as="a" href={s.cta.href} size="sm">
                  {s.cta.label}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
