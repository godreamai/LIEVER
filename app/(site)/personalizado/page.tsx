import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { Icon } from "@/components/ds/Icon";
import { Card } from "@/components/ds/Card";
import { ProductCard } from "@/components/ds/ProductCard";
import { WA } from "@/lib/data";
import { getPublicProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Trabajos a medida",
  description: "Pedinos una pieza personalizada: medida, color, logo o un diseño propio. Te asesoramos y te pasamos un presupuesto.",
};

export default async function CustomLanding() {
  const personalizables = (await getPublicProducts().catch(() => [])).filter((p) => p.personalizable);
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

      {personalizables.length > 0 && (
        <section className="wrap center" style={{ padding: "70px 20px" }}>
          <SectionTitle eyebrow="Punto de partida" title="Productos que podés personalizar" size="lg" style={{ textAlign: "center", marginBottom: 10 }} />
          <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 32px" }}>Elegí uno y pedinos la medida, el color o el logo que necesitás.</p>
          <div className="grid g4">
            {personalizables.map((p) => (
              <Link key={p.slug} href={`/producto/${p.slug}`} style={{ color: "inherit" }}>
                <ProductCard name={p.name} price={p.price} measure={p.measure} category={p.category} image={p.image} stock={p.stock} />
              </Link>
            ))}
          </div>
        </section>
      )}

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
                    background: "rgba(181,103,61,.08)",
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
