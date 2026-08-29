import Link from "next/link";
import { Button } from "@/components/ds/Button";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { ProductCard } from "@/components/ds/ProductCard";
import { CategoryCard } from "@/components/ds/CategoryCard";
import { MdfSurface } from "@/components/ds/MdfSurface";
import { Icon } from "@/components/ds/Icon";
import { MeasureTag, MeasureRule, StepCard } from "@/components/ui";
import { CATEGORIES, PHOTOS, PRODUCTS } from "@/lib/data";

function HomeHero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "var(--ink)" }}>
      {/* TODO: video real del taller (uploads/vecteezy_lathe-...mp4) todavia no cargado — placeholder de fondo mientras tanto */}
      <div style={{ position: "absolute", inset: 0, background: "var(--mdf-face-dark)" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(42,36,32,.62)" }} />
      <div className="wrap center" style={{ position: "relative", paddingTop: 110, paddingBottom: 80, minHeight: "72vh", justifyContent: "center" }}>
        <MeasureTag value="± 0,2 mm de tolerancia" at={null} style={{ marginBottom: 22 }} />
        <h1 style={{ color: "var(--white)", fontSize: "clamp(30px,6vw,54px)", lineHeight: 1.05, margin: "0 0 18px", maxWidth: 760 }}>
          Piezas de madera, cortadas con exactitud milimétrica.
        </h1>
        <p className="lead" style={{ fontSize: "clamp(15px,2vw,17px)", color: "rgba(255,252,246,.78)", margin: "0 0 32px" }}>
          Decoración, cartelería y muebles a medida, hechos con una máquina de precisión y terminados a mano en el taller.
        </p>
        <div className="row" style={{ marginBottom: 46 }}>
          <Button as="a" href="/catalogo" iconRight={<Icon name="arrow-right" size={16} color="var(--white)" />}>
            Ver productos
          </Button>
          <Button as="a" href="/personalizado" variant="secondary" style={{ background: "var(--white)", borderColor: "var(--white)", color: "var(--wood)" }}>
            Personalizados
          </Button>
        </div>
        <div className="stats" style={{ paddingTop: 26, borderTop: "1px solid rgba(255,252,246,.22)", width: "100%", maxWidth: 720 }}>
          {[
            ["± 0,2 mm", "Tolerancia de corte"],
            ["2,44 × 1,22 m", "Placa máxima"],
            ["2 a 6 días", "Producción"],
          ].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 500, color: "var(--white)" }}>{v}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,252,246,.6)" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div data-screen-label="Home">
      <HomeHero />

      <section style={{ background: "var(--surface-alt)" }}>
        <div className="wrap center">
          <SectionTitle eyebrow="Explorá por categoría" title="Categorías" size="lg" style={{ textAlign: "center" }} />
          <div className="grid g4 gtight">
            {CATEGORIES.map((c) => (
              <Link key={c.index} href={`/catalogo?categoria=${encodeURIComponent(c.name)}`} style={{ color: "inherit" }}>
                <CategoryCard {...c} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap center">
        <SectionTitle eyebrow="Lo más pedido" title="Productos destacados" size="lg" style={{ textAlign: "center", marginBottom: 12 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginBottom: 30 }}>{PRODUCTS.length} productos en catálogo</span>
        <div className="grid g4">
          {PRODUCTS.slice(0, 4).map((p) => (
            <Link key={p.slug} href={`/producto/${p.slug}`} style={{ color: "inherit" }}>
              <ProductCard name={p.name} price={p.price} measure={p.measure} category={p.category} image={p.image} />
            </Link>
          ))}
        </div>
        <Button as="a" href="/catalogo" variant="secondary" size="sm" style={{ marginTop: 30 }}>
          Ver el catálogo completo
        </Button>
      </section>

      <section style={{ background: "var(--surface-inverse)", color: "var(--text-inverse)" }}>
        <div className="wrap center">
          <Eyebrow tone="inverse" style={{ marginBottom: 12 }}>
            ¿No encontrás lo que buscás?
          </Eyebrow>
          <h2 style={{ color: "var(--white)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(24px,4vw,32px)", margin: "0 0 14px" }}>Lo hacemos a tu medida.</h2>
          <p className="lead" style={{ color: "var(--text-inverse-muted)", margin: "0 0 28px", fontSize: 15 }}>
            Contanos tu idea y te lo cotizamos por WhatsApp, sin vueltas. Mandanos un boceto, una foto o las medidas: con eso alcanza.
          </p>
          <Button as="a" href="/personalizado" variant="onDark" style={{ marginBottom: 40 }}>
            Pedir personalizado
          </Button>
          <MdfSurface height={280} tone="dark" src={PHOTOS.panels} alt="Paneles de MDF recién cortados" style={{ maxWidth: 900 }}>
            <MeasureTag value="2,44 × 1,22 m" at="tl" />
            <MeasureTag value="corte a medida" at="br" />
          </MdfSurface>
        </div>
      </section>

      <section className="wrap wrap--narrow center">
        <SectionTitle eyebrow="Tres pasos" title="Cómo funciona" size="lg" style={{ textAlign: "center" }} />
        <div className="grid g3" style={{ textAlign: "center" }}>
          <StepCard number="01" title="Elegís o pedís tu diseño" description="Del catálogo o a medida, vos decidís." />
          <StepCard number="02" title="Confirmamos por WhatsApp" description="Te mandamos el precio final y el tiempo de entrega." />
          <StepCard number="03" title="Lo recibís" description="Retirás en el taller o te lo enviamos a domicilio." />
        </div>
        <MeasureRule value="Tolerancia de corte ± 0,2 mm" style={{ marginTop: 50 }} />
      </section>
    </div>
  );
}
