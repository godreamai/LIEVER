import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ds/Card";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { Icon } from "@/components/ds/Icon";
import { PHOTOS } from "@/lib/data";

const PROCESO = [
  { icon: "pencil", title: "Diseño", desc: "Pensamos la solución a partir de la necesidad real del espacio, no al revés." },
  { icon: "settings", title: "Tecnología CNC", desc: "El corte de precisión amplía lo que podemos diseñar y fabricar." },
  { icon: "layers", title: "Materiales", desc: "Elegimos el material y el espesor según el uso que va a tener cada pieza." },
  { icon: "hammer", title: "Fabricación y armado", desc: "Mecanizamos, armamos y terminamos cada pieza a mano en el taller." },
];

export const metadata: Metadata = {
  title: "Nosotros",
  description: "LIEVER combina diseño, tecnología CNC y carpintería para resolver necesidades reales de comercios y espacios.",
};

export default function NosotrosPage() {
  return (
    <div data-screen-label="Nosotros">
      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderBottom: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <Eyebrow style={{ marginBottom: 12 }}>Nosotros</Eyebrow>
          <h1 style={{ fontSize: "clamp(30px,4.5vw,44px)", margin: "0 0 18px", maxWidth: 720 }}>
            Hay una persona que sabe lo que hace detrás de cada proyecto.
          </h1>
          <p className="lead" style={{ color: "var(--text-muted)", fontSize: 16, margin: 0, maxWidth: 640 }}>
            LIEVER nace de la experiencia de Fer en cartelería y fabricación, y de las ganas de ir más allá: combinar diseño, tecnología y carpintería para resolver necesidades reales de comercios y espacios.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ padding: "70px 20px" }}>
        <div className="grid g2">
          <div>
            <SectionTitle eyebrow="Cómo empezó" title="De la cartelería a las soluciones para espacios" style={{ marginBottom: 18 }} />
            <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7, margin: "0 0 16px" }}>
              El origen de LIEVER está en la experiencia de Fer en cartelería y fabricación, junto con su interés por la carpintería y el diseño. La incorporación de tecnología CNC amplió las posibilidades del proyecto y permitió ir más allá de la cartelería tradicional.
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
              No buscamos limitarnos a fabricar productos estándar. Nuestra esencia está en detectar una necesidad, pensar una solución y transformarla en un producto concreto: diseño, funcionalidad, tecnología y una fabricación cuidada.
            </p>
          </div>
          <div style={{ position: "relative", height: 320, borderRadius: "var(--radius)", overflow: "hidden" }}>
            <Image src={PHOTOS.workshop} alt="Taller LIEVER" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderTop: "1px solid var(--border-hairline)", borderBottom: "1px solid var(--border-hairline)" }}>
        <div className="wrap center" style={{ padding: 0 }}>
          <SectionTitle eyebrow="El proceso real" title="Pensamos la solución. La diseñamos. La fabricamos." size="lg" style={{ textAlign: "center", marginBottom: 32 }} />
          <div className="grid g4">
            {PROCESO.map((s) => (
              <div key={s.title} className="home-step-item" style={{ alignItems: "center", textAlign: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(181,103,61,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={s.icon} size={20} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: 16, margin: 0 }}>{s.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0, lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap" style={{ padding: "70px 20px" }}>
        <div className="grid g2">
          {/* Placeholder de taller: reemplazar por una foto real de Fer */}
          <div style={{ position: "relative", height: 320, borderRadius: "var(--radius)", overflow: "hidden" }}>
            <Image src={PHOTOS.tools} alt="Taller LIEVER" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
          </div>
          <div>
            <Eyebrow tone="wood" style={{ marginBottom: 12 }}>La cara de LIEVER</Eyebrow>
            <h2 style={{ fontSize: "clamp(22px,3vw,30px)", margin: "0 0 16px" }}>Fer</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7, margin: "0 0 16px" }}>
              Detrás de cada corte, cada decisión de diseño y cada pieza que sale del taller hay una persona pensando cómo resolver mejor el problema de cada cliente.
            </p>
            <p style={{ fontStyle: "italic", fontSize: 16, color: "var(--ink)", margin: 0, borderLeft: "3px solid var(--accent)", paddingLeft: 16 }}>
              &ldquo;No siempre hay que quedarse con la solución convencional. Hay espacio para pensar algo diferente.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderTop: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <SectionTitle eyebrow="Y ahora" title="Mirá lo que hacemos" size="lg" style={{ textAlign: "center", marginBottom: 28 }} />
          <div className="grid g2" style={{ width: "100%" }}>
            {[
              { href: "/personalizado", title: "Trabajos a medida", desc: "Contanos tu idea, tus medidas o una referencia y la diseñamos con vos." },
              { href: "/productos?categoria=todos", title: "Catálogo", desc: "Paneles ranurados, mobiliario y más, listos para pedir." },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ color: "inherit" }}>
                <Card style={{ padding: 28, height: "100%", textAlign: "left" }}>
                  <h3 style={{ fontSize: 18, margin: "0 0 8px" }}>{l.title} →</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{l.desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
