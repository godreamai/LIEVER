import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ds/Icon";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { ProductCard } from "@/components/ds/ProductCard";
import { PRODUCTS, PHOTOS } from "@/lib/data";
import { ProductGallery } from "./ProductGallery";
import { AddToCart } from "./AddToCart";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) notFound();

  const related = PRODUCTS.filter((x) => x.slug !== p.slug).slice(0, 4);
  const shots = [
    { src: p.image, alt: p.name },
    { src: PHOTOS.panels, alt: "Detalle del corte" },
    { src: PHOTOS.router, alt: "Corte en proceso" },
    { src: PHOTOS.workshop, alt: "Taller" },
  ];

  return (
    <div data-screen-label="Detalle de producto">
      <div className="wrap wrap--tight" style={{ paddingBottom: 0, fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-muted)", display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
        <Link href="/catalogo" style={{ color: "inherit" }}>
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
        <SectionTitle eyebrow="Del mismo corte" title="También te puede servir" size="lg" style={{ textAlign: "center" }} />
        <div className="grid g4">
          {related.map((r) => (
            <Link key={r.slug} href={`/producto/${r.slug}`} style={{ color: "inherit" }}>
              <ProductCard name={r.name} price={r.price} measure={r.measure} category={r.category} image={r.image} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
