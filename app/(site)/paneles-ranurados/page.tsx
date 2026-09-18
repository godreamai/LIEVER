import Link from "next/link";
import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { ProductCard } from "@/components/ds/ProductCard";
import { Icon } from "@/components/ds/Icon";
import { PANELES, WA } from "@/lib/data";

export default function PanelesRanuradosPage() {
  const waPersonalizar = WA + encodeURIComponent("Hola Liever! Quiero personalizar un panel ranurado (medida, color o logo).");

  return (
    <div data-screen-label="Paneles ranurados">
      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderBottom: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <Eyebrow tone="wood" style={{ marginBottom: 12 }}>
            Nuestra línea protagonista
          </Eyebrow>
          <h1 style={{ fontSize: "clamp(30px,4.5vw,44px)", margin: "0 0 18px", maxWidth: 720 }}>
            Organizá, exhibí y personalizá tu espacio.
          </h1>
          <p className="lead" style={{ color: "var(--text-muted)", fontSize: 16, margin: "0 0 12px", maxWidth: 640 }}>
            Los paneles ranurados LIEVER no son solo placas ranuradas: son un sistema para aprovechar paredes, exhibir mercadería, organizar herramientas e incorporar la identidad de tu comercio.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0, maxWidth: 640 }}>
            Estamos ampliando esta colección a distintas medidas, colores y accesorios — hoy podés ver los primeros modelos y pedir tu configuración a medida.
          </p>
        </div>
      </section>

      <section className="wrap center" style={{ padding: "70px 20px" }}>
        <SectionTitle eyebrow="Modelos disponibles" title="Elegí tu panel ranurado" size="lg" style={{ textAlign: "center" }} />
        <div className="grid g4">
          {PANELES.map((p) => (
            <Link key={p.slug} href={`/producto/${p.slug}`} style={{ color: "inherit" }}>
              <ProductCard name={p.name} price={p.price} measure={p.measure} category={p.category} image={p.image} />
            </Link>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--surface-alt)", padding: "60px 20px", borderTop: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <h2 style={{ fontSize: "clamp(22px,3vw,28px)", margin: "0 0 14px" }}>¿No encontrás la medida o el color que buscás?</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15, margin: "0 0 26px", maxWidth: 560 }}>
            Todos nuestros paneles admiten medidas especiales, colores a pedido e incorporación de logo. Contanos tu proyecto y te asesoramos.
          </p>
          <Button as="a" href={waPersonalizar} target="_blank" icon={<Icon name="message-circle" size={16} color="var(--white)" />}>
            Personalizar producto
          </Button>
        </div>
      </section>
    </div>
  );
}
