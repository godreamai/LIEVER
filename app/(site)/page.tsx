import Link from "next/link";
import { Button } from "@/components/ds/Button";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { ProductCard } from "@/components/ds/ProductCard";
import { CategoryCard } from "@/components/ds/CategoryCard";
import { Icon } from "@/components/ds/Icon";
import Image from "next/image";
import { CATEGORIES, HERO_VIDEO, PHOTOS, PRODUCTS, WA } from "@/lib/data";

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
      
      <div className="wrap center" style={{ position: "relative", paddingTop: 100, paddingBottom: 70, minHeight: "70vh", justifyContent: "center" }}>
        <h1 style={{ color: "var(--white)", fontSize: "clamp(32px,5.5vw,56px)", lineHeight: 1.08, margin: "0 0 18px", maxWidth: 740 }}>
          Piezas de madera, cortadas con exactitud milimétrica.
        </h1>
        <p className="lead" style={{ fontSize: "clamp(15px,2vw,17px)", color: "rgba(255,252,246,.82)", margin: "0 0 34px", maxWidth: 620 }}>
          Decoración, cartelería comercial y muebles a medida fabricados con tecnología CNC y terminados a mano en nuestro taller.
        </p>

        <div className="row" style={{ marginBottom: 44, gap: 14 }}>
          <Button as="a" href="/catalogo" iconRight={<Icon name="arrow-right" size={16} color="var(--white)" />}>
            Ver catálogo
          </Button>
          <Button as="a" href="/personalizado" variant="secondary" style={{ background: "rgba(255,255,255,0.92)", borderColor: "transparent", color: "var(--ink)" }}>
            Pedir a medida
          </Button>
        </div>

        {/* Humanized Trust / Workshop badges */}
        <div
          style={{
            paddingTop: 24,
            borderTop: "1px solid rgba(255,252,246,.18)",
            width: "100%",
            maxWidth: 780,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "14px 20px",
          }}
        >
          {[
            { icon: "map-pin", text: "Taller en San Nicolás" },
            { icon: "truck", text: "Envíos a todo el país" },
            { icon: "check", text: "Terminación artesanal" },
          ].map((b) => (
            <div key={b.text} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,252,246,.85)", fontSize: 13, fontWeight: 500 }}>
              <Icon name={b.icon} size={15} color="var(--accent)" />
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const waCustom = WA + encodeURIComponent("Hola Liever! Tengo una idea para un trabajo personalizado y quiero cotizarlo.");

  return (
    <div data-screen-label="Home">
      <HomeHero />

      {/* Categorías en Círculos (Compacto y Visual) */}
      <section style={{ background: "var(--surface-alt)", padding: "52px 20px 48px", borderBottom: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <SectionTitle eyebrow="Explorá por rubro" title="Nuestras Categorías" size="lg" style={{ textAlign: "center", marginBottom: 28 }} />
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap", gap: "24px 40px", width: "100%" }}>
            {CATEGORIES.map((c) => (
              <Link key={c.index} href={`/catalogo?categoria=${encodeURIComponent(c.name)}`} style={{ color: "inherit", textDecoration: "none" }}>
                <CategoryCard {...c} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="wrap center" style={{ padding: "70px 20px" }}>
        <SectionTitle eyebrow="Favoritos del taller" title="Productos destacados" size="lg" style={{ textAlign: "center", marginBottom: 8 }} />
        <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 32px" }}>
          Diseños listos para pedir o personalizar a tu gusto
        </p>

        <div className="grid g4">
          {PRODUCTS.slice(0, 4).map((p) => (
            <Link key={p.slug} href={`/producto/${p.slug}`} style={{ color: "inherit" }}>
              <ProductCard name={p.name} price={p.price} measure={p.measure} category={p.category} image={p.image} />
            </Link>
          ))}
        </div>

        <Button as="a" href="/catalogo" variant="secondary" size="sm" style={{ marginTop: 36 }}>
          Ver todo el catálogo →
        </Button>
      </section>

      {/* Sección Personalizados (Split Banner) */}
      <section style={{ background: "var(--surface-inverse)", color: "var(--text-inverse)", padding: "70px 0" }}>
        <div className="wrap home-custom-grid">
          <div className="home-custom-content">
            <Eyebrow tone="inverse" style={{ marginBottom: 12 }}>
              Trabajos a medida
            </Eyebrow>
            <h2 style={{ color: "var(--white)", fontSize: "clamp(26px,4vw,36px)", margin: "0 0 16px", lineHeight: 1.15 }}>
              ¿Tenés una idea en mente? La cortamos en el taller.
            </h2>
            <p style={{ color: "rgba(255,252,246,.75)", fontSize: 15, lineHeight: 1.65, margin: "0 0 24px", maxWidth: 520 }}>
              Carteles comerciales, letras corpóreas, paneles calados, cuadros y muebles específicos. Mandanos tu boceto, plano o foto de referencia y te preparamos la cotización en el día.
            </p>

            <div className="row" style={{ gap: 14, marginBottom: 28, width: "100%", justifyContent: "flex-start" }}>
              <Button as="a" href={waCustom} target="_blank" variant="onDark" icon={<Icon name="message-circle" size={15} color="var(--white)" />}>
                Cotizar por WhatsApp
              </Button>
              <Button as="a" href="/personalizado" variant="secondary" style={{ color: "var(--white)", borderColor: "rgba(255,255,255,0.25)", background: "transparent" }}>
                Ver cómo trabajamos
              </Button>
            </div>
          </div>

          <div style={{ position: "relative", height: 320, width: "100%", borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 20px 48px rgba(0, 0, 0, 0.45), 0 6px 16px rgba(0, 0, 0, 0.25)" }}>
            <Image
              src={PHOTOS.panels}
              alt="Paneles de madera cortados en CNC"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* Proceso en 3 Pasos con flechas conectoras de línea de tiempo */}
      <section className="wrap wrap--narrow center" style={{ padding: "70px 20px" }}>
        <SectionTitle eyebrow="Simple y sin vueltas" title="Cómo trabajamos" size="lg" style={{ textAlign: "center", marginBottom: 36 }} />
        
        <div className="home-process-grid">
          {[
            {
              step: "01",
              title: "Elegís o nos mandás tu idea",
              desc: "Seleccionás un producto del catálogo o nos enviás tus medidas, bosquejo o logo.",
            },
            {
              step: "02",
              title: "Confirmamos y cotizamos",
              desc: "Ajustamos los detalles técnicos, te pasamos el valor final y el tiempo estimado de entrega.",
            },
            {
              step: "03",
              title: "Corte y entrega",
              desc: "Mecanizamos la pieza con precisión CNC, la terminamos a mano y la retirás o te la enviamos.",
            },
          ].map((item, idx) => (
            <div key={item.step} style={{ display: "contents" }}>
              <div className="home-step-item">
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--accent)",
                    background: "rgba(217, 83, 30, 0.08)",
                    width: "fit-content",
                    padding: "4px 10px",
                    borderRadius: "var(--radius-pill)",
                    letterSpacing: ".04em",
                  }}
                >
                  Paso {item.step}
                </span>
                <h3 style={{ fontSize: 17, margin: 0, fontWeight: 700 }}>{item.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
              </div>

              {idx < 2 && (
                <div className="home-step-arrow" aria-hidden="true">
                  <div className="home-step-arrow-circle">
                    <Icon name="chevron-right" size={16} color="var(--accent)" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
