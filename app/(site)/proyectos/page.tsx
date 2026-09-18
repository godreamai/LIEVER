import Image from "next/image";
import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { PROJECTS } from "@/lib/projects";

export default function ProyectosPage() {
  return (
    <div data-screen-label="Proyectos">
      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderBottom: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <Eyebrow style={{ marginBottom: 12 }}>Trabajos realizados</Eyebrow>
          <h1 style={{ fontSize: "clamp(30px,4.5vw,44px)", margin: "0 0 18px", maxWidth: 700 }}>
            Proyectos que pensamos, diseñamos y fabricamos.
          </h1>
          <p className="lead" style={{ color: "var(--text-muted)", fontSize: 16, margin: 0, maxWidth: 620 }}>
            Estamos documentando los primeros proyectos de esta nueva etapa de LIEVER. Estos son ejemplos representativos del tipo de trabajo que hacemos.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ padding: "70px 20px" }}>
        <SectionTitle eyebrow="Selección de trabajos" title="Algunos proyectos" size="lg" style={{ textAlign: "center" }} />
        <div className="grid g3">
          {PROJECTS.map((p) => (
            <article
              key={p.slug}
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div style={{ position: "relative", height: 200, background: "var(--bg-alt)" }}>
                <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
              </div>
              <div style={{ padding: "18px 20px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    color: "var(--wood)",
                    background: "rgba(139, 90, 60, 0.08)",
                    padding: "3px 8px",
                    borderRadius: "var(--radius-xs)",
                    display: "inline-block",
                    marginBottom: 10,
                  }}
                >
                  {p.category}
                </span>
                <h3 style={{ fontSize: 16, margin: "0 0 8px" }}>{p.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0, lineHeight: 1.55 }}>{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--surface-alt)", padding: "60px 20px", borderTop: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <h2 style={{ fontSize: "clamp(22px,3vw,28px)", margin: "0 0 14px" }}>¿Tenés un proyecto en mente?</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15, margin: "0 0 26px", maxWidth: 560 }}>
            Contanos qué necesitás para tu comercio, tu proyecto o tu espacio y te ayudamos a diseñar la solución.
          </p>
          <Button as="a" href="/contacto">
            Contanos tu proyecto
          </Button>
        </div>
      </section>
    </div>
  );
}
