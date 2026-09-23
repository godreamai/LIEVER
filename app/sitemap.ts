import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

const STATIC_PATHS = ["", "/productos", "/soluciones", "/nosotros", "/personalizado", "/contacto"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublicProducts().catch(() => []);

  return [
    ...STATIC_PATHS.map((path) => ({ url: SITE_URL + path, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${SITE_URL}/producto/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
