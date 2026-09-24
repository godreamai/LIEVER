import { Card } from "@/components/ds/Card";
import { createClient } from "@/lib/supabase/server";
import { CategoriesClient, type AdminCategory } from "./CategoriesClient";

async function getAdminCategories(): Promise<AdminCategory[]> {
  const supabase = await createClient();
  const [cats, products] = await Promise.all([
    supabase.from("categories").select("id, name, image").order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
    supabase.from("products").select("category_id"),
  ]);
  if (cats.error) throw new Error(cats.error.message);
  if (products.error) throw new Error(products.error.message);

  const counts = new Map<string, number>();
  products.data.forEach((p: { category_id: string | null }) => {
    if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  });
  return cats.data.map((c) => ({ id: c.id, name: c.name, image: c.image, products: counts.get(c.id) ?? 0 }));
}

export default async function AdminCategoriesPage() {
  let categories;
  try {
    categories = await getAdminCategories();
  } catch {
    return (
      <Card style={{ padding: 32, textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>No se pudieron cargar las categorías.</p>
      </Card>
    );
  }

  return (
    <div data-screen-label="Admin · Categorías">
      <h2 style={{ fontSize: 26, margin: "0 0 12px" }}>Categorías</h2>
      <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 640, margin: "0 0 20px" }}>
        Son los filtros del catálogo y las tarjetas de la home. El orden de esta lista es el orden en que se muestran.
      </p>
      <CategoriesClient categories={categories} />
    </div>
  );
}
