import Link from "next/link";
import { Button } from "@/components/ds/Button";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { ProductCard } from "@/components/ds/ProductCard";
import { Icon } from "@/components/ds/Icon";
import Image from "next/image";
import { HERO_VIDEO, PHOTOS } from "@/lib/data";
import { getCategories, getPublicProducts } from "@/lib/products";
import { slugify } from "@/lib/slug";


function HomeHero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "var(--ink)" }}>
      <video
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(42,36,32,.65)" }} />

      <div className="wrap center" style={{ position: "relative", paddingTop: 100, paddingBottom: 100, minHeight: "70vh", justifyContent: "center" }}>
        <h1 style={{ color: "var(--white)", fontSize: "clamp(32px,5.5vw,56px)", lineHeight: 1.08, margin: "0 0 18px", maxWidth: 740 }}>
          Diseño que resuelve.
        </h1>
        <p className="lead" style={{ fontSize: "clamp(15px,2vw,17px)", color: "rgba(255,252,246,.82)", margin: "0 0 34px", maxWidth: 600 }}>
          Diseñamos y fabricamos soluciones pensadas para tu espacio: mobiliario, paneles ranurados y proyectos a medida para comercios, profesionales y hogares.
        </p>

        <div className="row" style={{ gap: 14 }}>
          <Button as="a" href="/productos" iconRight={<Icon name="arrow-right" size={16} color="var(--white)" />}>
            Ver productos
          </Button>
          <Button as="a" href="/contacto" variant="secondary" style={{ background: "rgba(255,255,255,0.92)", borderColor: "transparent", color: "var(--ink)" }}>
            Contanos tu proyecto
          </Button>
        </div>
      </div>
    </section>
  );
}

function NeedCard({ title, desc, href, image }: { title: string; desc: string; href: string; image: string }) {
  return (
    <Link href={href} className="need-card">
      <div className="need-card-circle">
        <Image src={image} alt={title} fill sizes="120px" className="need-card-img" />
      </div>
      <h3 className="need-card-title" style={{ fontSize: 16, margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>
        {title}
      </h3>
      <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0, lineHeight: 1.5, maxWidth: 200 }}>{desc}</p>
    </Link>
  );
}

export default async function Home() {
  const [products, allCategories] = await Promise.all([getPublicProducts().catch(() => []), getCategories().catch(() => [])]);
  const categories = allCategories.filter((c) => c.count > 0);
  const paneles = products.filter((p) => p.category === "Paneles ranurados").slice(0, 2);
  const otros = products.filter((p) => p.category !== "Paneles ranurados").slice(0, 2);
  const destacados = [...paneles, ...otros];
  const nuevos = products.filter((p) => !destacados.includes(p)).slice(-4).reverse();

  return (
    <div data-screen-label="Home">
      <HomeHero />

      {/* Categorías */}
      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderBottom: "1px solid var(--border-hairline)" }}>
        <div className="wrap center" style={{ padding: 0 }}>
          <SectionTitle eyebrow="Explorá el catálogo" title="Comprá por categoría" size="lg" style={{ textAlign: "center", marginBottom: 32 }} />
          <div className="home-cat-row">
            {categories.map((c) => (
              <NeedCard key={c.id} title={c.name} desc={`${c.count} ${c.count === 1 ? "producto" : "productos"}`} href={`/productos?categoria=${slugify(c.name)}`} image={c.image || PHOTOS.panels} />
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="wrap center" style={{ padding: "70px 20px" }}>
        <SectionTitle eyebrow="Destacados" title="Productos para pedir ya" size="lg" style={{ textAlign: "center", marginBottom: 8 }} />
        <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 32px" }}>
          Listos para pedir o personalizar a tu gusto
        </p>

        {destacados.length > 0 && (
          <div className="grid g4">
            {destacados.map((p) => (
              <Link key={p.slug} href={`/producto/${p.slug}`} style={{ color: "inherit" }}>
                <ProductCard name={p.name} price={p.price} measure={p.measure} category={p.category} image={p.image} stock={p.stock} />
              </Link>
            ))}
          </div>
        )}

        <Button as="a" href="/productos" variant="secondary" size="sm" style={{ marginTop: 36 }}>
          Ver todos los productos →
        </Button>
      </section>

      {/* Soluciones a tu medida (Split Banner) */}
      <section style={{ background: "var(--surface-inverse)", color: "var(--text-inverse)", padding: "70px 0" }}>
        <div className="wrap home-custom-grid">
          <div className="home-custom-content">
            <Eyebrow tone="inverse" style={{ marginBottom: 12 }}>
              Soluciones a tu medida
            </Eyebrow>
            <h2 style={{ color: "var(--white)", fontSize: "clamp(26px,4vw,36px)", margin: "0 0 16px", lineHeight: 1.15 }}>
              ¿Tenés una idea en mente? La diseñamos y fabricamos.
            </h2>
            <p style={{ color: "rgba(255,252,246,.75)", fontSize: 15, lineHeight: 1.65, margin: "0 0 24px", maxWidth: 520 }}>
              Mobiliario comercial, paneles ranurados, divisores, exhibidores y piezas específicas. Mandanos tu medida, boceto o foto de referencia y te preparamos una propuesta.
            </p>

            <div className="row" style={{ gap: 14, marginBottom: 28, width: "100%", justifyContent: "flex-start" }}>
              <Button as="a" href="/contacto" variant="onDark" icon={<Icon name="message-circle" size={15} color="var(--white)" />}>
                Cotizar proyecto
              </Button>
              <Button as="a" href="/nosotros" variant="secondary" style={{ color: "var(--white)", borderColor: "rgba(255,255,255,0.25)", background: "transparent" }}>
                Ver cómo trabajamos
              </Button>
            </div>
          </div>

          <div style={{ position: "relative", height: 320, width: "100%", borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 20px 48px rgba(0, 0, 0, 0.45), 0 6px 16px rgba(0, 0, 0, 0.25)" }}>
            <Image
              src={PHOTOS.panels}
              alt="Panel ranurado fabricado a medida"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {nuevos.length > 0 && (
        <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderTop: "1px solid var(--border-hairline)" }}>
          <div className="wrap center" style={{ padding: 0 }}>
            <SectionTitle eyebrow="Novedades" title="Recién agregados" size="lg" style={{ textAlign: "center", marginBottom: 32 }} />
            <div className="grid g4">
              {nuevos.map((p) => (
                <Link key={p.slug} href={`/producto/${p.slug}`} style={{ color: "inherit" }}>
                  <ProductCard name={p.name} price={p.price} measure={p.measure} category={p.category} image={p.image} stock={p.stock} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
