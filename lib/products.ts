import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { Category, Product, ProductAdmin, Spec, StockStatus } from "@/lib/types";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  price: number;
  measure: string | null;
  category_id: string | null;
  image: string | null;
  description: string;
  specs: Spec[] | null;
  medidas: string[] | null;
  colores: string[] | null;
  personalizable: boolean;
  accesorios: string[] | null;
  tiempo_fabricacion: string | null;
  envio: boolean;
  retiro: boolean;
  entrega_nota: string | null;
  active: boolean;
  stock_status: StockStatus | null;
  category: { id: string; name: string } | null;
}

const PRODUCT_SELECT = "*, category:categories(id, name)";

function rowToProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    measure: row.measure ?? "",
    category: row.category?.name ?? "",
    stock: row.stock_status ?? "disponible",
    image: row.image,
    desc: row.description,
    specs: row.specs ?? [],
    medidas: row.medidas ?? undefined,
    colores: row.colores ?? undefined,
    personalizable: row.personalizable,
    accesorios: row.accesorios ?? undefined,
    tiempoFabricacion: row.tiempo_fabricacion ?? undefined,
    entrega: { envio: row.envio, retiro: row.retiro, nota: row.entrega_nota ?? undefined },
  };
}

function rowToProductAdmin(row: ProductRow): ProductAdmin {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    measure: row.measure ?? "",
    categoryId: row.category_id,
    categoryName: row.category?.name ?? null,
    stock: row.stock_status ?? "disponible",
    image: row.image,
    desc: row.description,
    specs: row.specs ?? [],
    medidas: row.medidas ?? undefined,
    colores: row.colores ?? undefined,
    personalizable: row.personalizable,
    accesorios: row.accesorios ?? undefined,
    tiempoFabricacion: row.tiempo_fabricacion ?? undefined,
    entrega: { envio: row.envio, retiro: row.retiro, nota: row.entrega_nota ?? undefined },
    active: row.active,
  };
}

// --- Storefront público -----------------------------------------------
// Lecturas cacheadas (tag "catalog"): el admin las invalida al guardar cambios
// (ver revalidateStorefront) y, por las dudas, expiran solas a los 5 minutos.
// Filtramos `active = true` de forma explícita, sin depender solo de RLS.

export const CATALOG_TAG = "catalog";
const CACHE_OPTIONS = { tags: [CATALOG_TAG], revalidate: 300 };

export const getPublicProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const { data, error } = await createPublicClient()
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return ((data ?? []) as unknown as ProductRow[]).map(rowToProduct);
  },
  ["public-products"],
  CACHE_OPTIONS
);

export const getPublicProductBySlug = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    const { data, error } = await createPublicClient()
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToProduct(data as unknown as ProductRow) : null;
  },
  ["public-product-by-slug"],
  CACHE_OPTIONS
);

export const getCategories = unstable_cache(
  async (): Promise<Category[]> => {
    // Los conteos salen de los productos activos ya traídos: sin una tercera consulta.
    const [cats, products] = await Promise.all([
      createPublicClient().from("categories").select("id, name, image, sort_order").order("sort_order", { ascending: true }),
      createPublicClient().from("products").select("category_id").eq("active", true),
    ]);
    if (cats.error) throw new Error(cats.error.message);
    if (products.error) throw new Error(products.error.message);

    const counts = new Map<string, number>();
    (products.data ?? []).forEach((p: { category_id: string | null }) => {
      if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
    });

    return (cats.data ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      count: counts.get(c.id) ?? 0,
    }));
  },
  ["public-categories"],
  CACHE_OPTIONS
);

// --- Panel de administración --------------------------------------------

export async function getAdminProducts(): Promise<ProductAdmin[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as ProductRow[]).map(rowToProductAdmin);
}

export async function getCategoryOptions(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("id, name").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}
