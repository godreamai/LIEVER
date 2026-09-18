import Link from "next/link";
import { Button } from "@/components/ds/Button";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { ProductCard } from "@/components/ds/ProductCard";
import { Card } from "@/components/ds/Card";
import { Icon } from "@/components/ds/Icon";
import Image from "next/image";
import { HERO_VIDEO, PHOTOS, PRODUCTS } from "@/lib/data";

const NECESIDADES = [
  {
    title: "Equipar un comercio",
    desc: "Mobiliario, paneles, exhibidores, estanterías, mostradores y más.",
    href: "/soluciones#abrir-comercio",
    image: PHOTOS.workshop,
  },
  {
    title: "Dividir un ambiente",
    desc: "Soluciones funcionales y personalizables para reorganizar espacios.",
    href: "/soluciones#dividir-ambiente",
    image: PHOTOS.wallart,
  },
  {
    title: "Buscar un panel ranurado",
    desc: "Elegí modelo, medida, color y opciones de personalización.",
    href: "/paneles-ranurados",
    image: PHOTOS.panels,
  },
  {
    title: "Tenés un proyecto",
    desc: "Contanos qué necesitás y desarrollamos una solución a medida.",
    href: "/contacto",
    image: PHOTOS.router,
  },
];

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
        <Eyebrow tone="inverse" style={{ marginBottom: 16, letterSpacing: "0.14em" }}>
          Arte · Diseño · Innovación
        </Eyebrow>
        <h1 style={{ color: "var(--white)", fontSize: "clamp(32px,5.5vw,56px)", lineHeight: 1.08, margin: "0 0 18px", maxWidth: 740 }}>
          Diseño que resuelve.
        </h1>
        <p className="lead" style={{ fontSize: "clamp(15px,2vw,17px)", color: "rgba(255,252,246,.82)", margin: "0 0 34px", maxWidth: 600 }}>
          Diseñamos y fabricamos soluciones pensadas para tu espacio: mobiliario, paneles ranurados y proyectos a medida para comercios, profesionales y hogares.
        </p>

        <div className="row" style={{ marginBottom: 44, gap: 14 }}>
          <Button as="a" href="/catalogo" iconRight={<Icon name="arrow-right" size={16} color="var(--white)" />}>
            Ver productos
          </Button>
          <Button as="a" href="/contacto" variant="secondary" style={{ background: "rgba(255,255,255,0.92)", borderColor: "transparent", color: "var(--ink)" }}>
            Contanos tu proyecto
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
            { icon: "check", text: "Fabricación propia" },
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

export default function Home() {
  const paneles = PRODUCTS.filter((p) => p.category === "Paneles ranurados").slice(0, 2);
  const otros = PRODUCTS.filter((p) => p.category !== "Paneles ranurados").slice(0, 2);
  const destacados = [...paneles, ...otros];

  return (
    <div data-screen-label="Home">
      <HomeHero />

      {/* Bloque de necesidades */}
      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderBottom: "1px solid var(--border-hairline)" }}>
        <div className="wrap center" style={{ padding: 0 }}>
          <SectionTitle eyebrow="Empezá por acá" title="¿Qué necesitás resolver?" size="lg" style={{ textAlign: "center", marginBottom: 32 }} />
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap", gap: "28px 36px", width: "100%" }}>
            {NECESIDADES.map((n) => (
              <NeedCard key={n.title} {...n} />
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="wrap center" style={{ padding: "70px 20px" }}>
        <SectionTitle eyebrow="Nuestra línea protagonista" title="Paneles ranurados y más" size="lg" style={{ textAlign: "center", marginBottom: 8 }} />
        <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 32px" }}>
          Diseños listos para pedir o personalizar a tu gusto
        </p>

        <div className="grid g4">
          {destacados.map((p) => (
            <Link key={p.slug} href={`/producto/${p.slug}`} style={{ color: "inherit" }}>
              <ProductCard name={p.name} price={p.price} measure={p.measure} category={p.category} image={p.image} />
            </Link>
          ))}
        </div>

        <Button as="a" href="/catalogo" variant="secondary" size="sm" style={{ marginTop: 36 }}>
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

      {/* ¿Estás por abrir o renovar tu comercio? */}
      <section className="wrap" style={{ padding: "70px 20px" }}>
        <Card padding={0} style={{ overflow: "hidden" }}>
          <div className="home-custom-grid" style={{ padding: "44px 40px" }}>
            <div className="home-custom-content">
              <Eyebrow tone="wood" style={{ marginBottom: 12 }}>
                Para comercios y negocios
              </Eyebrow>
              <h2 style={{ fontSize: "clamp(24px,3.4vw,32px)", margin: "0 0 16px", lineHeight: 1.15 }}>
                ¿Estás por abrir o renovar tu comercio?
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.65, margin: "0 0 24px", maxWidth: 480 }}>
                Podemos ayudarte a diseñar y fabricar el mobiliario, exhibidores, paneles y otras soluciones que necesitás para tu espacio.
              </p>
              <Button as="a" href="/soluciones#abrir-comercio">
                Quiero equipar mi comercio
              </Button>
            </div>
            <div style={{ position: "relative", height: 240, width: "100%", borderRadius: "var(--radius)", overflow: "hidden" }}>
              <Image src={PHOTOS.tools} alt="Equipamiento para comercios" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </Card>
      </section>

      {/* Sección profesionales / arquitectos */}
      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderTop: "1px solid var(--border-hairline)", borderBottom: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <Eyebrow style={{ marginBottom: 12 }}>Para profesionales</Eyebrow>
          <h2 style={{ fontSize: "clamp(24px,3.4vw,32px)", margin: "0 0 16px", maxWidth: 640 }}>
            ¿Sos arquitecto, diseñador o profesional?
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.65, margin: "0 0 28px", maxWidth: 560 }}>
            Incorporá soluciones LIEVER a tus proyectos. Diseñamos y fabricamos mobiliario, divisores, paneles y piezas especiales a partir de las necesidades de cada espacio.
          </p>
          <Button as="a" href="/soluciones#profesionales">
            Trabajemos juntos
          </Button>
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
              desc: "Seleccionás un producto del catálogo o nos contás tu necesidad, medidas y referencias.",
            },
            {
              step: "02",
              title: "Diseñamos y cotizamos",
              desc: "Pensamos la solución, ajustamos los detalles técnicos y te pasamos el valor final y el tiempo estimado.",
            },
            {
              step: "03",
              title: "Fabricamos y entregamos",
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
                    background: "rgba(181, 103, 61, 0.08)",
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

        <Button as="a" href="/nosotros" variant="secondary" size="sm" style={{ marginTop: 36 }}>
          Conocé el proceso completo →
        </Button>
      </section>
    </div>
  );
}
