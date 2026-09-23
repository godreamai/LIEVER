"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { MAX_COMBOS, buildCombos } from "@/lib/options";
import type { ProductOption, ProductVariant, Spec } from "@/lib/types";

export interface ProductInput {
  slug: string;
  name: string;
  price: number;
  measure: string;
  categoryId: string;
  desc: string;
  specs: Spec[];
  personalizable: boolean;
  accesorios: string[];
  tiempoFabricacion: string;
  envio: boolean;
  retiro: boolean;
  entregaNota: string;
  image: string | null;
  options: ProductOption[];
  variants: ProductVariant[];
}

export interface ActionResult {
  ok: boolean;
  error?: string;
}

function toRow(input: ProductInput) {
  return {
    slug: input.slug,
    name: input.name,
    price: input.price,
    measure: input.measure || null,
    category_id: input.categoryId,
    image: input.image,
    description: input.desc,
    specs: input.specs,
    personalizable: input.personalizable,
    accesorios: input.accesorios.length ? input.accesorios : null,
    tiempo_fabricacion: input.tiempoFabricacion || null,
    envio: input.envio,
    retiro: input.retiro,
    entrega_nota: input.entregaNota || null,
    options: input.options,
    variants: input.variants,
  };
}

function validate(input: ProductInput): string | null {
  if (!input.name.trim()) return "El nombre es obligatorio.";
  if (!input.slug.trim()) return "El slug es obligatorio.";
  if (!input.categoryId) return "Elegí una categoría.";
  if (!Number.isFinite(input.price) || input.price <= 0) return "El precio debe ser un número mayor a 0.";

  const names = new Set<string>();
  for (const o of input.options) {
    const name = o.name.trim();
    if (!name) return "Todos los seleccionables necesitan un nombre.";
    if (names.has(name)) return `El seleccionable "${name}" está repetido.`;
    names.add(name);
    if (o.values.length === 0) return `El seleccionable "${name}" no tiene opciones.`;
    if (new Set(o.values).size !== o.values.length) return `El seleccionable "${name}" tiene opciones repetidas.`;
  }
  if (buildCombos(input.options).length > MAX_COMBOS) return `Demasiadas combinaciones con precio (máximo ${MAX_COMBOS}). Marcá alguna opción como "sin precio".`;
  if (input.variants.some((v) => !Number.isFinite(v.price) || v.price <= 0)) return "Los precios de la matriz deben ser mayores a 0.";
  return null;
}

function revalidateStorefront(slug: string) {
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/paneles-ranurados");
  revalidatePath("/mobiliario");
  revalidatePath(`/producto/${slug}`);
  revalidatePath("/admin/productos");
}

export async function createProductAction(input: ProductInput): Promise<ActionResult> {
  const validationError = validate(input);
  if (validationError) return { ok: false, error: validationError };

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert(toRow(input));

  if (error) {
    if (error.code === "23505") return { ok: false, error: "Ya existe un producto con ese slug." };
    return { ok: false, error: "No se pudo crear el producto." };
  }

  revalidateStorefront(input.slug);
  return { ok: true };
}

export async function updateProductAction(id: string, previousSlug: string, input: ProductInput): Promise<ActionResult> {
  const validationError = validate(input);
  if (validationError) return { ok: false, error: validationError };

  const supabase = await createClient();
  const { error } = await supabase.from("products").update(toRow(input)).eq("id", id);

  if (error) {
    if (error.code === "23505") return { ok: false, error: "Ya existe un producto con ese slug." };
    return { ok: false, error: "No se pudo guardar el producto." };
  }

  revalidateStorefront(previousSlug);
  if (input.slug !== previousSlug) revalidateStorefront(input.slug);
  return { ok: true };
}

export async function deleteProductAction(id: string, slug: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: "No se pudo eliminar el producto." };

  revalidateStorefront(slug);
  return { ok: true };
}

export async function setProductActiveAction(id: string, slug: string, active: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ active }).eq("id", id);
  if (error) return { ok: false, error: "No se pudo actualizar el estado." };

  revalidateStorefront(slug);
  return { ok: true };
}

export interface UploadResult {
  ok: boolean;
  url?: string;
  error?: string;
}

export async function uploadProductImageAction(formData: FormData): Promise<UploadResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Elegí un archivo." };
  if (!file.type.startsWith("image/")) return { ok: false, error: "El archivo tiene que ser una imagen." };

  const supabase = await createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) return { ok: false, error: "No se pudo subir la imagen." };

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
