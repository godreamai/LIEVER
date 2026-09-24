"use client";

import React, { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { Card } from "@/components/ds/Card";
import { Input } from "@/components/ds/Input";
import { Modal } from "@/components/ds/Modal";
import { MdfSurface } from "@/components/ds/MdfSurface";
import { AdminProductCard } from "@/components/ds/AdminProductCard";
import { slugify } from "@/lib/slugify";
import { STOCK_OPTIONS } from "@/lib/stock";
import { OptionsEditor, draftsToOptions, optionsToDrafts, pricesToVariants, variantsToPrices, type OptionDraft, type VariantPrices } from "./OptionsEditor";
import type { ProductAdmin, Spec, StockStatus } from "@/lib/types";
import {
  createProductAction,
  deleteProductAction,
  setProductActiveAction,
  updateProductAction,
  uploadProductImageAction,
  type ProductInput,
} from "./actions";

type StatusFilter = "todos" | "activos" | "inactivos";

interface FormState {
  id?: string;
  originalSlug?: string;
  slug: string;
  slugTouched: boolean;
  name: string;
  price: string;
  measure: string;
  categoryId: string;
  desc: string;
  specs: Spec[];
  personalizable: boolean;
  accesoriosText: string;
  tiempoFabricacion: string;
  envio: boolean;
  retiro: boolean;
  entregaNota: string;
  stock: StockStatus;
  image: string | null;
  options: OptionDraft[];
  variantPrices: VariantPrices;
}

function emptyForm(defaultCategoryId: string): FormState {
  return {
    slug: "",
    slugTouched: false,
    name: "",
    price: "",
    measure: "",
    categoryId: defaultCategoryId,
    desc: "",
    specs: [],
    personalizable: false,
    accesoriosText: "",
    tiempoFabricacion: "",
    envio: true,
    retiro: true,
    entregaNota: "",
    stock: "disponible",
    image: null,
    options: [],
    variantPrices: {},
  };
}

function fromProduct(p: ProductAdmin): FormState {
  return {
    id: p.id,
    originalSlug: p.slug,
    slug: p.slug,
    slugTouched: true,
    name: p.name,
    price: String(p.price),
    measure: p.measure,
    categoryId: p.categoryId ?? "",
    desc: p.desc,
    specs: p.specs,
    personalizable: p.personalizable ?? false,
    accesoriosText: (p.accesorios ?? []).join(", "),
    tiempoFabricacion: p.tiempoFabricacion ?? "",
    envio: p.entrega?.envio ?? true,
    retiro: p.entrega?.retiro ?? true,
    entregaNota: p.entrega?.nota ?? "",
    stock: p.stock,
    image: p.image,
    options: optionsToDrafts(p.options),
    variantPrices: variantsToPrices(p.variants),
  };
}

function splitCsv(text: string): string[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Normaliza "60x20" / "60 x 20" a "60 × 20" para que las medidas se vean
// consistentes con las que ya estaban cargadas (ej: "30 × 18 cm"), sin
// tocar texto libre como "medida especial" que no tiene números a los lados.
function normalizeMeasure(input: string): string {
  return input.trim().replace(/(\d)\s*[xX]\s*(\d)/g, "$1 × $2");
}

function toInput(form: FormState): ProductInput {
  const options = draftsToOptions(form.options);
  return {
    options,
    variants: pricesToVariants(options, form.variantPrices),
    slug: slugify(form.slug),
    name: form.name.trim(),
    price: Number(form.price),
    measure: normalizeMeasure(form.measure),
    categoryId: form.categoryId,
    desc: form.desc.trim(),
    specs: form.specs.filter((s) => s.label.trim() && s.value.trim()),
    personalizable: form.personalizable,
    accesorios: splitCsv(form.accesoriosText),
    tiempoFabricacion: form.tiempoFabricacion.trim(),
    envio: form.envio,
    retiro: form.retiro,
    entregaNota: form.entregaNota.trim(),
    stock: form.stock,
    image: form.image,
  };
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-technical)" }}>{title}</span>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{children}</div>
    </div>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: 13,
        padding: "7px 12px",
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        border: "1px solid " + (active ? "var(--accent)" : "var(--border-card)"),
        background: active ? "var(--surface-card)" : "transparent",
        color: active ? "var(--accent)" : "var(--text-body)",
      }}
    >
      {children}
    </button>
  );
}

const checkboxLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "var(--font-body)",
  fontSize: 13,
  color: "var(--text-body)",
  cursor: "pointer",
};

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: 12,
  color: "var(--text-muted)",
  marginBottom: 6,
};

const hintTextStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: 11.5,
  color: "var(--text-muted)",
  marginTop: 5,
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  border: "1px solid var(--border-input)",
  borderRadius: "var(--radius)",
  background: "var(--surface-card)",
  fontFamily: "var(--font-body)",
  fontSize: 14,
  color: "var(--text-body)",
  outline: "none",
  resize: "vertical",
};

export function ProductsAdminClient({ products, categories }: { products: ProductAdmin[]; categories: { id: string; name: string }[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("Todas");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");

  const flash = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2200);
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (statusFilter === "activos" && !p.active) return false;
      if (statusFilter === "inactivos" && p.active) return false;
      if (categoryFilter !== "Todas" && p.categoryName !== categoryFilter) return false;
      if (q.trim() && !(p.name + " " + p.measure).toLowerCase().includes(q.trim().toLowerCase())) return false;
      return true;
    });
  }, [products, q, categoryFilter, statusFilter]);

  const openNew = () => {
    setFormError(null);
    setEditing(emptyForm(categories[0]?.id ?? ""));
  };

  const openEdit = (p: ProductAdmin) => {
    setFormError(null);
    setEditing(fromProduct(p));
  };

  const closeEditor = () => {
    setEditing(null);
    setFormError(null);
  };

  const onNameChange = (name: string) => {
    setEditing((f) => (f ? { ...f, name, slug: f.slugTouched ? f.slug : slugify(name) } : f));
  };

  const onSlugChange = (slug: string) => {
    setEditing((f) => (f ? { ...f, slug, slugTouched: true } : f));
  };

  const addSpec = () => setEditing((f) => (f ? { ...f, specs: [...f.specs, { label: "", value: "" }] } : f));
  const removeSpec = (idx: number) => setEditing((f) => (f ? { ...f, specs: f.specs.filter((_, i) => i !== idx) } : f));
  const updateSpec = (idx: number, key: "label" | "value", val: string) =>
    setEditing((f) => (f ? { ...f, specs: f.specs.map((s, i) => (i === idx ? { ...s, [key]: val } : s)) } : f));

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setFormError(null);
    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadProductImageAction(fd);
    setUploading(false);
    if (!result.ok) {
      setFormError(result.error ?? "No se pudo subir la imagen.");
      return;
    }
    setEditing((f) => (f ? { ...f, image: result.url ?? f.image } : f));
  };

  const submit = async () => {
    if (!editing) return;
    setFormError(null);
    const input = toInput(editing);
    setSaving(true);
    const result = editing.id ? await updateProductAction(editing.id, editing.originalSlug ?? input.slug, input) : await createProductAction(input);
    setSaving(false);
    if (!result.ok) {
      setFormError(result.error ?? "Ocurrió un error.");
      return;
    }
    flash(editing.id ? "Producto actualizado." : "Producto creado.");
    closeEditor();
    startTransition(() => router.refresh());
  };

  const toggleActive = async (p: ProductAdmin) => {
    setBusyId(p.id);
    const result = await setProductActiveAction(p.id, p.slug, !p.active);
    setBusyId(null);
    if (result.ok) {
      flash(p.active ? "Producto desactivado." : "Producto activado.");
      startTransition(() => router.refresh());
    } else {
      flash(result.error ?? "No se pudo actualizar.");
    }
  };

  const remove = async (p: ProductAdmin) => {
    if (!window.confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return;
    setBusyId(p.id);
    const result = await deleteProductAction(p.id, p.slug);
    setBusyId(null);
    if (result.ok) {
      flash("Producto eliminado.");
      startTransition(() => router.refresh());
    } else {
      flash(result.error ?? "No se pudo eliminar.");
    }
  };

  return (
    <div data-screen-label="Admin · Productos">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontSize: 26, margin: 0 }}>Productos</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {feedback && <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)" }}>{feedback}</span>}
          <Button size="sm" icon={<Icon name="plus" size={14} color="var(--white)" />} onClick={openNew}>
            Nuevo producto
          </Button>
        </div>
      </div>

      <Card style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "minmax(200px,320px) 1fr" }}>
          <Input placeholder="Buscar por nombre o medida" value={q} onChange={(e) => setQ(e.target.value)} mono={false} wrapStyle={{ alignSelf: "start" }} />
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <FilterGroup title="Categoría">
              <Choice active={categoryFilter === "Todas"} onClick={() => setCategoryFilter("Todas")}>
                Todas
              </Choice>
              {categories.map((c) => (
                <Choice key={c.id} active={categoryFilter === c.name} onClick={() => setCategoryFilter(c.name)}>
                  {c.name}
                </Choice>
              ))}
            </FilterGroup>
            <FilterGroup title="Estado">
              <Choice active={statusFilter === "todos"} onClick={() => setStatusFilter("todos")}>
                Todos
              </Choice>
              <Choice active={statusFilter === "activos"} onClick={() => setStatusFilter("activos")}>
                Activos
              </Choice>
              <Choice active={statusFilter === "inactivos"} onClick={() => setStatusFilter("inactivos")}>
                Inactivos
              </Choice>
            </FilterGroup>
          </div>
        </div>
      </Card>

      {editing && (
        <Modal
          title={editing.id ? "Editar producto" : "Nuevo producto"}
          maxWidth={860}
          onClose={closeEditor}
          footer={
            <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
              <Button variant="secondary" size="sm" onClick={closeEditor} type="button">
                Cancelar
              </Button>
              <Button size="sm" onClick={submit} disabled={saving} type="button">
                {saving ? "Guardando…" : "Guardar producto"}
              </Button>
            </div>
          }
        >
          {formError && (
            <div style={{ background: "var(--status-pendiente-bg)", color: "var(--status-pendiente-fg)", padding: "10px 14px", borderRadius: "var(--radius)", fontSize: 13, marginBottom: 16 }}>{formError}</div>
          )}

          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 14 }}>
            <Input label="Nombre" value={editing.name} onChange={(e) => onNameChange(e.target.value)} placeholder="Ej: Repisa flotante 80 cm" mono={false} />
            <Input label="Slug (URL)" value={editing.slug} onChange={(e) => onSlugChange(e.target.value)} placeholder="repisa-flotante-80" />
            <Input label="Precio" type="number" value={editing.price} onChange={(e) => setEditing((f) => (f ? { ...f, price: e.target.value } : f))} placeholder="21300" />
            <div>
              <Input label="Medida" value={editing.measure} onChange={(e) => setEditing((f) => (f ? { ...f, measure: e.target.value } : f))} placeholder="60 × 12 cm" mono={false} />
              <span style={hintTextStyle}>Escribí la unidad (cm/mm). &quot;60x12&quot; se guarda como &quot;60 × 12&quot;, agregale &quot; cm&quot; si corresponde.</span>
            </div>
            <div>
              <span style={fieldLabelStyle}>Categoría</span>
              <select
                value={editing.categoryId}
                onChange={(e) => setEditing((f) => (f ? { ...f, categoryId: e.target.value } : f))}
                style={{ width: "100%", padding: 10, border: "1px solid var(--border-input)", borderRadius: "var(--radius)", background: "var(--surface-card)", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-body)" }}
              >
                <option value="">Elegí una categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span style={fieldLabelStyle}>Disponibilidad</span>
              <select
                value={editing.stock}
                onChange={(e) => setEditing((f) => (f ? { ...f, stock: e.target.value as StockStatus } : f))}
                style={{ width: "100%", padding: 10, border: "1px solid var(--border-input)", borderRadius: "var(--radius)", background: "var(--surface-card)", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-body)" }}
              >
                {STOCK_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span style={hintTextStyle}>&quot;Sin stock&quot; se ve en el catálogo pero no se puede comprar.</span>
            </div>
            <Input label="Tiempo de fabricación" value={editing.tiempoFabricacion} onChange={(e) => setEditing((f) => (f ? { ...f, tiempoFabricacion: e.target.value } : f))} placeholder="5 a 7 días hábiles" mono={false} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <span style={fieldLabelStyle}>Descripción</span>
            <textarea
              value={editing.desc}
              onChange={(e) => setEditing((f) => (f ? { ...f, desc: e.target.value } : f))}
              rows={3}
              placeholder="Descripción que ve el cliente en la página del producto"
              style={textareaStyle}
            />
          </div>

          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 14 }}>
            <Input label="Accesorios compatibles (separados por coma)" value={editing.accesoriosText} onChange={(e) => setEditing((f) => (f ? { ...f, accesoriosText: e.target.value } : f))} placeholder="Ganchos simples, Repisas flotantes" mono={false} />
            <Input label="Nota de envío / retiro" value={editing.entregaNota} onChange={(e) => setEditing((f) => (f ? { ...f, entregaNota: e.target.value } : f))} placeholder="Envío a todo el país · retiro en taller" mono={false} />
          </div>

          <div style={{ display: "flex", gap: 20, marginBottom: 18, flexWrap: "wrap" }}>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" checked={editing.personalizable} onChange={(e) => setEditing((f) => (f ? { ...f, personalizable: e.target.checked } : f))} />
              Personalizable
            </label>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" checked={editing.envio} onChange={(e) => setEditing((f) => (f ? { ...f, envio: e.target.checked } : f))} />
              Envío
            </label>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" checked={editing.retiro} onChange={(e) => setEditing((f) => (f ? { ...f, retiro: e.target.checked } : f))} />
              Retiro en taller
            </label>
          </div>

          <OptionsEditor
            options={editing.options}
            prices={editing.variantPrices}
            basePrice={Number(editing.price) || 0}
            otherProducts={products.filter((p) => p.id !== editing.id)}
            onChange={(options, variantPrices) => setEditing((f) => (f ? { ...f, options, variantPrices } : f))}
          />

          <div style={{ marginBottom: 18 }}>
            <span style={fieldLabelStyle}>Especificaciones técnicas</span>
            <span style={{ ...hintTextStyle, marginTop: 0, marginBottom: 8 }}>
              El valor es texto libre: escribilo completo, ej. &quot;Material&quot; → &quot;MDF 18 mm&quot; (no solo &quot;18mm&quot;).
            </span>
            {editing.specs.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <Input value={s.label} onChange={(e) => updateSpec(i, "label", e.target.value)} placeholder="Material" mono={false} wrapStyle={{ flex: 1 }} />
                <Input value={s.value} onChange={(e) => updateSpec(i, "value", e.target.value)} placeholder="MDF 18 mm" mono={false} wrapStyle={{ flex: 1 }} />
                <button onClick={() => removeSpec(i)} aria-label="Quitar especificación" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 6 }}>
                  <Icon name="x" size={16} />
                </button>
              </div>
            ))}
            <Button variant="ghost" size="sm" icon={<Icon name="plus" size={13} />} onClick={addSpec} type="button">
              Agregar especificación
            </Button>
          </div>

          <div style={{ display: "flex", gap: 20, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div>
              <span style={fieldLabelStyle}>Foto</span>
              <MdfSurface height={90} src={editing.image} style={{ width: 140 }} />
              <label style={{ display: "inline-block", marginTop: 8 }}>
                <input type="file" accept="image/*" onChange={onImageChange} style={{ display: "none" }} disabled={uploading} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--accent)", cursor: "pointer", textDecoration: "underline" }}>{uploading ? "Subiendo…" : "Subir imagen"}</span>
              </label>
            </div>
          </div>
        </Modal>
      )}

      {filtered.length === 0 ? (
        <Card style={{ padding: 40, textAlign: "center" }}>
          <p className="lead" style={{ color: "var(--text-muted)", margin: 0 }}>
            {products.length === 0 ? "Todavía no cargaste productos." : "No encontramos productos con esos filtros."}
          </p>
        </Card>
      ) : (
        <div className="grid g3 gtight">
          {filtered.map((p) => (
            <AdminProductCard
              key={p.id}
              product={p}
              onEdit={() => openEdit(p)}
              onToggleActive={() => toggleActive(p)}
              onDelete={() => remove(p)}
              style={busyId === p.id ? { pointerEvents: "none", opacity: 0.5 } : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
