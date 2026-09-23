import { Card } from "@/components/ds/Card";
import { getAdminProducts, getCategoryOptions } from "@/lib/products";
import { ProductsAdminClient } from "./ProductsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  let loadError = false;
  let products: Awaited<ReturnType<typeof getAdminProducts>> = [];
  let categories: Awaited<ReturnType<typeof getCategoryOptions>> = [];
  try {
    [products, categories] = await Promise.all([getAdminProducts(), getCategoryOptions()]);
  } catch {
    loadError = true;
  }

  if (loadError) {
    return (
      <div data-screen-label="Admin · Productos">
        <h2 style={{ fontSize: 26, margin: "0 0 22px" }}>Productos</h2>
        <Card style={{ padding: 40, textAlign: "center" }}>
          <p className="lead" style={{ color: "var(--text-muted)", margin: 0 }}>
            No pudimos conectar con la base de datos. Recargá la página en unos minutos.
          </p>
        </Card>
      </div>
    );
  }

  return <ProductsAdminClient products={products} categories={categories} />;
}
