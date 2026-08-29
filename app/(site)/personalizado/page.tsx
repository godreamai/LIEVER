import Link from "next/link";
import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { MdfSurface } from "@/components/ds/MdfSurface";
import { Icon } from "@/components/ds/Icon";
import { Card } from "@/components/ds/Card";
import { MeasureTag, MeasureRule, StepCard } from "@/components/ui";
import { PHOTOS, WA } from "@/lib/data";

const WORKS: { src: string | null; alt: string; measure: string; label: string; slug: string | null }[] = [
  { src: PHOTOS.wallart, alt: "Panel decorativo de listones", measure: "90 × 60 cm", label: "Panel de pared", slug: "cuadro-geometrico" },
  { src: PHOTOS.panels, alt: "Paneles calados", measure: "20 × 20 cm", label: "Calados geométricos", slug: "cartel-nombre" },
  { src: PHOTOS.router, alt: "Corte en proceso", measure: "± 0,2 mm", label: "Corte en proceso", slug: "portarretratos-roble" },
  { src: PHOTOS.tools, alt: "Herramientas sobre tablero", measure: "120 × 80 cm", label: "Tablero de taller", slug: "repisa-flotante" },
  { src: PHOTOS.workshop, alt: "Máquina CNC en el taller", measure: "2,4 × 1,2 m", label: "Área de corte", slug: "organizador-escritorio" },
  { src: null, alt: "", measure: "a medida", label: "Tu pieza", slug: null },
];

export default function CustomLanding() {
  const waCustom = WA + encodeURIComponent("Hola! Quiero un trabajo personalizado. Te cuento: medida aproximada, material y para qué lo necesito.");
  return (
    <div data-screen-label="Personalizado">
      <div className="wrap center" style={{ paddingTop: 80, paddingBottom: 40 }}>
        <Eyebrow style={{ marginBottom: 14 }}>Diseño a medida</Eyebrow>
        <h1 style={{ fontSize: "clamp(28px,5vw,42px)", margin: "0 0 18px" }}>¿Tenés una idea en mente?</h1>
        <p className="lead" style={{ color: "var(--text-muted)", margin: "0 0 30px" }}>
          Contanos qué necesitás — tamaño, diseño, material — y te lo cotizamos directo por WhatsApp.
        </p>
        <Button as="a" href={waCustom} target="_blank" icon={<Icon name="message-circle" size={16} color="var(--white)" />}>
          Consultar por WhatsApp
        </Button>
        <MeasureRule value="Placas de hasta 2,44 × 1,22 m" style={{ marginTop: 44 }} />
      </div>

      <section className="wrap wrap--narrow center" style={{ paddingTop: 20 }}>
        <SectionTitle eyebrow="Trabajos previos" title="Lo que salió del taller" size="lg" style={{ textAlign: "center" }} />
        <p className="lead" style={{ color: "var(--text-muted)", fontSize: 14, margin: "-20px 0 28px" }}>
          Tocá cualquiera para ver la ficha del producto, con medidas y precio.
        </p>
        <div className="grid g3 gtight">
          {WORKS.map((w, i) => {
            const inner = (
              <>
                <MdfSurface height={180} src={w.src} alt={w.alt}>
                  <MeasureTag value={w.measure} at="bl" />
                  <MeasureTag value={w.slug ? "ver ficha →" : "consultar →"} at="tr" />
                </MdfSurface>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 10, textAlign: "center" }}>{w.label}</div>
              </>
            );
            return w.slug ? (
              <Link key={i} href={`/producto/${w.slug}`} style={{ color: "inherit" }}>
                {inner}
              </Link>
            ) : (
              <a key={i} href={waCustom} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
                {inner}
              </a>
            );
          })}
        </div>
      </section>

      <section className="wrap wrap--narrow center" style={{ paddingTop: 0 }}>
        <SectionTitle eyebrow="Cómo cotizamos" title="Tres datos y te pasamos precio" size="lg" style={{ textAlign: "center" }} />
        <div className="grid g3" style={{ textAlign: "center" }}>
          <StepCard number="01" title="La medida" description="Aunque sea aproximada: ancho, alto y espesor." />
          <StepCard number="02" title="El material" description="MDF, multilaminado o madera maciza." />
          <StepCard number="03" title="Para qué es" description="Con eso definimos el espesor y la terminación." />
        </div>
      </section>

      <div style={{ background: "var(--surface-alt)" }}>
        <div className="wrap wrap--tight center">
          <Card style={{ maxWidth: 760, width: "100%", padding: 30, textAlign: "center" }}>
            <h3 style={{ fontSize: 19, margin: "0 0 8px" }}>Mandanos el archivo si ya lo tenés</h3>
            <p className="lead" style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 auto 18px" }}>
              Trabajamos con DXF, SVG o AI. Si sólo tenés una foto o un boceto en papel, también sirve.
            </p>
            <Button as="a" href={waCustom} target="_blank" variant="secondary" size="sm">
              Enviar archivo por WhatsApp
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
