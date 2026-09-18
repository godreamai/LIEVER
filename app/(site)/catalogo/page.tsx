import { Suspense } from "react";
import { Card } from "@/components/ds/Card";
import { getCategories, getPublicProducts } from "@/lib/products";
import { CatalogFilters } from "./CatalogFilters";
import type { Category, Product } from "@/lib/types";

export default async function CatalogPage() {
  let products: Product[] = [];
  let categories: Category[] = [];
  let loadError = false;
  try {
    [products, categories] = await Promise.all([getPublicProducts(), getCategories()]);
  } catch {
    loadError = true;
  }

  if (loadError) {
    return (
      <div className="wrap center" style={{ paddingTop: 60 }}>
        <Card style={{ padding: 40, textAlign: "center", maxWidth: 480 }}>
          <p className="lead" style={{ color: "var(--text-muted)", margin: 0 }}>
            No pudimos cargar el catálogo. Probá de nuevo en unos minutos.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <Suspense fallback={null}>
      <CatalogFilters products={products} categories={categories} />
    </Suspense>
  );
}
