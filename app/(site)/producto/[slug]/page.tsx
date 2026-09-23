import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ds/Icon";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { ProductCard } from "@/components/ds/ProductCard";
import { Card } from "@/components/ds/Card";
import { getPublicProductBySlug, getPublicProducts } from "@/lib/products";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { schemaAvailability } from "@/lib/stock";
import { ProductGallery } from "./ProductGallery";
import { AddToCart } from "./AddToCart";

// Sin generateStaticParams: el catálogo se edita en cualquier momento desde
// el admin, así que cada visita renderiza con los datos vigentes en Supabase
// (~15-20 productos, el costo de no pre-generar es insignificante).

const shortText = (text: string, max = 155) => {
  const clean = text.replace(/s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + "…" : clean;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPublicProductBySlug(slug).catch(() => null);
  if (!p) return { title: "Producto no encontrado" };

  const description = shortText(p.desc || `${p.name}: ${p.category}. Fabricación propia, envíos a todo el país.`);
  return {
    title: p.name,
    description,
    alternates: { canonical: `/producto/${p.slug}` },
    openGraph: { title: p.name, description, type: "website", ...(p.image ? { images: [{ url: p.image, alt: p.name }] } : {}) },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let p;
  let loadError = false;
  try {
    p = await getPublicProductBySlug(slug);
  } catch {
    loadError = true;
  }

  if (loadError) {
    return (
      <div className="wrap center" style={{ paddingTop: 60 }}>
        <Card style={{ padding: 40, textAlign: "center", maxWidth: 480 }}>
          <p className="lead" style={{ color: "var(--text-muted)", margin: 0 }}>
            No pudimos cargar este producto. Probá de nuevo en unos minutos.
          </p>
        </Card>
      </div>
    );
  }
  if (!p) notFound();

  // Primero los de la misma categoría; si son pocos, se completa con otros productos.
  const others = (await getPublicProducts().catch(() => [])).filter((x) => x.slug !== p.slug);
  const sameCategory = others.filter((x) => x.category === p.category);
  const related = [...sameCategory, ...others.filter((x) => x.category !== p.category)].slice(0, 4);
  const relatedEyebrow = sameCategory.length >= 2 ? p.category : "Del mismo taller";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.desc || undefined,
    category: p.category || undefined,
    image: p.image ? [p.image] : undefined,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: { "@type": "Offer", url: `${SITE_URL}/producto/${p.slug}`, priceCurrency: "ARS", price: p.price, availability: schemaAvailability(p.stock) },
  };
  // Solo la foto real del producto: nada de imágenes genéricas del taller que parezcan del artículo.
  const shots = [{ src: p.image, alt: p.name }];

  return (
    <div data-screen-label="Detalle de producto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="wrap wrap--tight" style={{ paddingBottom: 0, fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-muted)", display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
        <Link href="/productos" style={{ color: "inherit" }}>
          Productos
        </Link>
        <Icon name="chevron-right" size={12} />
        <span>{p.category}</span>
      </div>
      <section className="wrap" style={{ paddingTop: 26 }}>
        <div className="grid g2">
          <ProductGallery shots={shots} />
          <div className="center">
            <Eyebrow style={{ marginBottom: 14 }}>{p.category}</Eyebrow>
            <h1 style={{ fontSize: "clamp(26px,4vw,34px)", margin: "0 0 14px" }}>{p.name}</h1>
            <AddToCart product={p} />
            <div style={{ marginTop: 22, display: "flex", gap: 8, alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-technical)" }}>
              <Icon name="truck" size={15} color="var(--line)" />
              Envío a todo el país · costo estimado con tu CP
            </div>
          </div>
        </div>
      </section>
      <section className="wrap center" style={{ paddingTop: 0 }}>
        <SectionTitle eyebrow={relatedEyebrow} title="También te puede servir" size="lg" style={{ textAlign: "center" }} />
        <div className="grid g4">
          {related.map((r) => (
            <Link key={r.slug} href={`/producto/${r.slug}`} style={{ color: "inherit" }}>
              <ProductCard name={r.name} price={r.price} measure={r.measure} category={r.category} image={r.image} stock={r.stock} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
