"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CATALOG_TAG } from "@/lib/products";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

function refresh() {
  updateTag(CATALOG_TAG);
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/productos");
}

function failure(error: { code?: string }, fallback: string): ActionResult {
  return { ok: false, error: error.code === "23505" ? "Ya existe una categoría con ese nombre." : fallback };
}

export async function createCategoryAction(name: string, image: string | null): Promise<ActionResult> {
  const clean = name.trim();
  if (!clean) return { ok: false, error: "El nombre es obligatorio." };

  const supabase = await createClient();
  const { data: last } = await supabase.from("categories").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { error } = await supabase.from("categories").insert({ name: clean, image, sort_order: (last?.sort_order ?? 0) + 1 });
  if (error) return failure(error, "No se pudo crear la categoría.");

  refresh();
  return { ok: true };
}

export async function updateCategoryAction(id: string, name: string, image: string | null): Promise<ActionResult> {
  const clean = name.trim();
  if (!clean) return { ok: false, error: "El nombre es obligatorio." };

  const { error } = await (await createClient()).from("categories").update({ name: clean, image }).eq("id", id);
  if (error) return failure(error, "No se pudo guardar la categoría.");

  refresh();
  return { ok: true };
}

/** Intercambia el orden con la categoría vecina (dir -1 = subir, 1 = bajar). */
export async function moveCategoryAction(id: string, dir: -1 | 1): Promise<ActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("id, sort_order").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
  if (error || !data) return { ok: false, error: "No se pudo reordenar." };

  const at = data.findIndex((c) => c.id === id);
  const other = data[at + dir];
  if (at === -1 || !other) return { ok: true };

  // Se reasignan posiciones consecutivas, para no depender de que los valores viejos sean únicos.
  const ids = data.map((c) => c.id);
  [ids[at], ids[at + dir]] = [ids[at + dir], ids[at]];
  for (const [i, catId] of ids.entries()) {
    const res = await supabase.from("categories").update({ sort_order: i + 1 }).eq("id", catId);
    if (res.error) return { ok: false, error: "No se pudo reordenar." };
  }

  refresh();
  return { ok: true };
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { count, error: countError } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("category_id", id);
  if (countError) return { ok: false, error: "No se pudo eliminar la categoría." };
  if ((count ?? 0) > 0) return { ok: false, error: "Tiene productos asignados: movelos a otra categoría antes de eliminarla." };

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, error: "No se pudo eliminar la categoría." };

  refresh();
  return { ok: true };
}
