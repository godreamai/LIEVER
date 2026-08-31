import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { Icon } from "@/components/ds/Icon";
import { Card } from "@/components/ds/Card";
import { PHOTOS, WA } from "@/lib/data";

const WORKS = [
  { src: PHOTOS.wallart, alt: "Panel decorativo de listones", label: "Panel decorativo", slug: "cuadro-geometrico" },
  { src: PHOTOS.panels, alt: "Paneles calados", label: "Calados geométricos", slug: "cartel-nombre" },
  { src: PHOTOS.router, alt: "Corte en proceso", label: "Corte CNC de precisión", slug: "portarretratos-roble" },
  { src: PHOTOS.tools, alt: "Herramientas sobre tablero", label: "Tableros organizadores", slug: "repisa-flotante" },
  { src: PHOTOS.workshop, alt: "Máquina CNC en el taller", label: "Mecanizado a medida", slug: "organizador-escritorio" },
  { src: null, alt: "Tu proyecto", label: "Tu propio diseño", slug: null },
];

export default function CustomLanding() {
  const waCustom = WA + encodeURIComponent("Hola Liever! Quiero consultar por un trabajo personalizado. Tengo una idea / medidas para pasarles.");

  return (
    <div data-screen-label="Personalizado">
      {/* Hero en fondo Taller con imagen difuminada y alto contraste */}
      <section
        style={{
          position: "relative",
          background: "var(--surface-inverse)",
          color: "var(--text-inverse)",
          padding: "86px 20px 92px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Background Image with blur and darkening */}
        <Image
          src="/uploads/liever_fondo.jpg"
          alt="Taller Liever Fondo"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            filter: "blur(3px) brightness(0.55)",
            transform: "scale(1.06)",
            opacity: 0.65,
          }}
        />

        {/* Dark Vignette Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, rgba(34, 29, 26, 0.65) 0%, rgba(34, 29, 26, 0.9) 100%)",
            zIndex: 1,
          }}
        />

        <div className="wrap wrap--narrow center" style={{ padding: 0, position: "relative", zIndex: 2 }}>
          <Eyebrow tone="inverse" style={{ marginBottom: 14 }}>
            Fabricación a medida
          </Eyebrow>
          <h1 style={{ color: "var(--white)", fontSize: "clamp(32px, 5vw, 50px)", margin: "0 0 18px", maxWidth: 700, lineHeight: 1.15, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
            Hacemos realidad tu diseño en madera
          </h1>
          <p style={{ color: "rgba(255, 252, 246, 0.85)", fontSize: 16, margin: "0 auto 34px", maxWidth: 560, lineHeight: 1.6, textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
            Cartelería comercial, paneles decorativos calados, letras corpóreas y piezas de mobiliario a medida. Cotización directa de taller sin intermediarios.
          </p>
          <Button as="a" href={waCustom} target="_blank" variant="onDark" icon={<Icon name="message-circle" size={16} color="var(--white)" />}>
            Cotizar proyecto por WhatsApp
          </Button>
        </div>
      </section>

      {/* Galería de trabajos en fondo blanco cálido */}
      <section style={{ background: "var(--surface-page)", padding: "70px 20px" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <SectionTitle eyebrow="Inspiración" title="Trabajos y posibilidades del taller" size="lg" style={{ textAlign: "center", marginBottom: 10 }} />
          <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 36px", textAlign: "center" }}>
            Algunas de las piezas que fabricamos con nuestra fresadora CNC
          </p>

          <div className="grid g3" style={{ gap: 24 }}>
            {WORKS.map((w, i) => {
              const inner = (
                <div
                  style={{
                    background: "var(--surface-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "var(--radius)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-card)",
                    transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ position: "relative", height: 190, background: "var(--bg-alt)", overflow: "hidden" }}>
                    {w.src ? (
                      <Image
                        src={w.src}
                        alt={w.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(217,83,30,.06)", color: "var(--accent)", fontWeight: 600 }}>
                        + Tu proyecto aquí
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{w.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>{w.slug ? "Ver modelo →" : "Cotizar →"}</span>
                  </div>
                </div>
              );

              return w.slug ? (
                <Link key={i} href={`/producto/${w.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                  {inner}
                </Link>
              ) : (
                <a key={i} href={waCustom} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                  {inner}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Qué necesitamos para cotizar en fondo suave alternado (Contraste claro) */}
      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderTop: "1px solid var(--border-hairline)", borderBottom: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <SectionTitle eyebrow="Presupuesto rápido" title="¿Qué necesitamos para cotizarte?" size="lg" style={{ textAlign: "center", marginBottom: 36 }} />
          
          <div className="grid g3" style={{ gap: 24 }}>
            {[
              {
                icon: "ruler",
                title: "Medidas aproximadas",
                desc: "Ancho, alto y espesor que buscás para tu pieza o cartel.",
              },
              {
                icon: "layers",
                title: "Material deseado",
                desc: "MDF crudo, melamina, multilaminado guatambú o maderas macizas.",
              },
              {
                icon: "file-text",
                title: "Diseño o referencia",
                desc: "Tu archivo vectorial (DXF/SVG/AI/PDF) o simplemente una foto o boceto.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius)",
                  padding: "32px 22px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: "rgba(217,83,30,.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={item.icon} size={22} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700 }}>{item.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0, lineHeight: 1.55 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner de archivos */}
      <section style={{ background: "var(--surface-page)", padding: "70px 20px" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <Card style={{ maxWidth: 720, width: "100%", padding: "40px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, border: "1px solid var(--border-card)", boxShadow: "var(--shadow-card)" }}>
            <h3 style={{ fontSize: 22, margin: 0, fontFamily: "var(--font-display)" }}>¿Ya tenés los archivos listos?</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0, maxWidth: 500, lineHeight: 1.6 }}>
              Aceptamos DXF, SVG, AI, EPS y PDF en curvas. Si no tenés archivo vectorial, nosotros vectorizamos tu boceto sin problema.
            </p>
            <Button as="a" href={waCustom} target="_blank" variant="primary" size="md" style={{ marginTop: 8 }} icon={<Icon name="message-circle" size={16} color="var(--white)" />}>
              Enviar diseño por WhatsApp
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
