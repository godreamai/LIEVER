import Link from "next/link";
import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { ProductCard } from "@/components/ds/ProductCard";
import { Icon } from "@/components/ds/Icon";
import { MOBILIARIO, WA } from "@/lib/data";

export default function MobiliarioPage() {
  const waCotizar = WA + encodeURIComponent("Hola Liever! Quiero cotizar mobiliario para mi comercio.");

  return (
    <div data-screen-label="Mobiliario comercial">
      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderBottom: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <Eyebrow tone="wood" style={{ marginBottom: 12 }}>
            Mobiliario comercial
          </Eyebrow>
          <h1 style={{ fontSize: "clamp(30px,4.5vw,44px)", margin: "0 0 18px", maxWidth: 720 }}>
            Todo lo que necesitás para transformar y equipar tu comercio.
          </h1>
          <p className="lead" style={{ color: "var(--text-muted)", fontSize: 16, margin: 0, maxWidth: 640 }}>
            Mostradores, estanterías, exhibidores y divisores diseñados y fabricados a medida. Algunos productos están listos para comprar online; otros requieren un presupuesto a medida de tu espacio.
          </p>
        </div>
      </section>

      <section className="wrap center" style={{ padding: "70px 20px" }}>
        <SectionTitle eyebrow="Catálogo en crecimiento" title="Modelos disponibles" size="lg" style={{ textAlign: "center" }} />
        <div className="grid g4">
          {MOBILIARIO.map((p) => (
            <Link key={p.slug} href={`/producto/${p.slug}`} style={{ color: "inherit" }}>
              <ProductCard name={p.name} price={p.price} measure={p.measure} category={p.category} image={p.image} />
            </Link>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--surface-alt)", padding: "60px 20px", borderTop: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <h2 style={{ fontSize: "clamp(22px,3vw,28px)", margin: "0 0 14px" }}>¿Necesitás una pieza o una medida especial?</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15, margin: "0 0 26px", maxWidth: 560 }}>
            Diseñamos mobiliario a partir del espacio real de tu comercio: contanos las medidas, el uso que le vas a dar y te preparamos una propuesta.
          </p>
          <Button as="a" href={waCotizar} target="_blank" icon={<Icon name="message-circle" size={16} color="var(--white)" />}>
            Cotizar proyecto
          </Button>
        </div>
      </section>
    </div>
  );
}
