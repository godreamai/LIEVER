import { createClient } from "@/lib/supabase/server";
import type { Category, Product, ProductAdmin, Spec } from "@/lib/types";

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
// Filtramos `active = true` de forma explícita (no solo vía RLS): si un
// admin logueado navega el sitio público en la misma sesión, la policy
// "select all" de `authenticated` le dejaría ver inactivos por RLS solo.

export async function getPublicProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("active", true)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as ProductRow[]).map(rowToProduct);
}

export async function getPublicProductsByCategory(categoryName: string): Promise<Product[]> {
  const products = await getPublicProducts();
  return products.filter((p) => p.category === categoryName);
}

export async function getPublicProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return rowToProduct(data as unknown as ProductRow);
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data: cats, error } = await supabase
    .from("categories")
    .select("id, name, image, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  if (!cats) return [];

  const { data: activeProducts, error: countError } = await supabase.from("products").select("category_id").eq("active", true);
  if (countError) throw new Error(countError.message);

  const counts = new Map<string, number>();
  (activeProducts ?? []).forEach((p: { category_id: string | null }) => {
    if (!p.category_id) return;
    counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  });

  return cats.map((c, i) => ({
    id: c.id,
    index: String(i + 1).padStart(2, "0"),
    name: c.name,
    image: c.image,
    count: counts.get(c.id) ?? 0,
  }));
}

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
