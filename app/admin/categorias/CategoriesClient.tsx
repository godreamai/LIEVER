"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ds/Button";
import { Card } from "@/components/ds/Card";
import { Icon } from "@/components/ds/Icon";
import { MdfSurface } from "@/components/ds/MdfSurface";
import { uploadProductImageAction } from "@/app/admin/productos/actions";
import { slugify } from "@/lib/slug";
import { createCategoryAction, deleteCategoryAction, moveCategoryAction, updateCategoryAction, type ActionResult } from "./actions";

export interface AdminCategory {
  id: string;
  name: string;
  image: string | null;
  products: number;
}

const fieldStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 14,
  padding: "8px 10px",
  border: "1px solid var(--border-strong)",
  borderRadius: "var(--radius)",
  background: "var(--white)",
  color: "var(--ink)",
  minWidth: 0,
};

const iconButton: React.CSSProperties = { background: "transparent", border: "none", cursor: "pointer", padding: 6, color: "var(--ink-soft)" };

function ImagePicker({ image, onChange }: { image: string | null; onChange: (url: string | null) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadProductImageAction(fd);
    setUploading(false);
    if (res.ok && res.url) onChange(res.url);
    else setError(res.error ?? "No se pudo subir la imagen.");
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <MdfSurface height={48} src={image} alt="" style={{ width: 48, flex: "0 0 48px", borderRadius: "50%" }} />
      <label style={{ fontSize: 12, color: "var(--accent)", cursor: "pointer", textDecoration: "underline" }}>
        {uploading ? "Subiendo…" : image ? "Cambiar imagen" : "Subir imagen"}
        <input type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
      </label>
      {error && <span style={{ fontSize: 12, color: "var(--accent)" }}>{error}</span>}
    </div>
  );
}

function CategoryRow({ category, isFirst, isLast, run }: { category: AdminCategory; isFirst: boolean; isLast: boolean; run: (fn: () => Promise<ActionResult>) => void }) {
  const [name, setName] = useState(category.name);
  const [image, setImage] = useState<string | null>(category.image);
  const dirty = name.trim() !== category.name || image !== category.image;
  const renamed = name.trim() !== category.name && name.trim() !== "";

  return (
    <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button aria-label="Subir" disabled={isFirst} onClick={() => run(() => moveCategoryAction(category.id, -1))} style={{ ...iconButton, padding: 2, opacity: isFirst ? 0.3 : 1 }}>
            <Icon name="chevron-down" size={14} style={{ transform: "rotate(180deg)" }} />
          </button>
          <button aria-label="Bajar" disabled={isLast} onClick={() => run(() => moveCategoryAction(category.id, 1))} style={{ ...iconButton, padding: 2, opacity: isLast ? 0.3 : 1 }}>
            <Icon name="chevron-down" size={14} />
          </button>
        </div>
        <ImagePicker image={image} onChange={setImage} />
        <input aria-label="Nombre de la categoría" value={name} onChange={(e) => setName(e.target.value)} style={{ ...fieldStyle, flex: "1 1 200px" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
          {category.products} {category.products === 1 ? "producto" : "productos"}
        </span>
        <Button size="sm" disabled={!dirty || name.trim() === ""} onClick={() => run(() => updateCategoryAction(category.id, name, image))}>
          Guardar
        </Button>
        <button
          aria-label="Eliminar categoría"
          title={category.products > 0 ? "Movés primero sus productos a otra categoría" : "Eliminar"}
          onClick={() => {
            if (confirm(`¿Eliminar la categoría “${category.name}”?`)) run(() => deleteCategoryAction(category.id));
          }}
          style={iconButton}
        >
          <Icon name="trash-2" size={16} />
        </button>
      </div>
      {renamed && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Al cambiar el nombre, el link del filtro pasa a ser /productos?categoria={slugify(name)}. Los links anteriores dejan de filtrar.</span>}
    </div>
  );
}

export function CategoriesClient({ categories }: { categories: AdminCategory[] }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);

  const run = (fn: () => Promise<ActionResult>) => {
    setMessage(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setMessage(res.error ?? "No se pudo completar la acción.");
    });
  };

  const create = () => {
    run(async () => {
      const res = await createCategoryAction(newName, newImage);
      if (res.ok) {
        setNewName("");
        setNewImage(null);
      }
      return res;
    });
  };

  return (
    <div style={{ opacity: pending ? 0.7 : 1, transition: "opacity .15s ease" }}>
      {message && (
        <Card style={{ padding: "12px 16px", marginBottom: 14, borderColor: "var(--accent)" }}>
          <span style={{ fontSize: 13 }}>{message}</span>
        </Card>
      )}

      <Card>
        {categories.map((c, i) => (
          <div key={c.id} style={{ borderTop: i ? "1px solid rgba(42,36,32,.06)" : "none" }}>
            <CategoryRow category={c} isFirst={i === 0} isLast={i === categories.length - 1} run={run} />
          </div>
        ))}
        {categories.length === 0 && <p style={{ padding: 24, margin: 0, color: "var(--text-muted)", fontSize: 14 }}>Todavía no hay categorías.</p>}
      </Card>

      <Card style={{ padding: 18, marginTop: 20 }}>
        <h3 style={{ fontSize: 16, margin: "0 0 12px" }}>Nueva categoría</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <ImagePicker image={newImage} onChange={setNewImage} />
          <input aria-label="Nombre de la nueva categoría" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej: Estanterías" style={{ ...fieldStyle, flex: "1 1 200px" }} />
          <Button size="sm" icon={<Icon name="plus" size={14} color="var(--white)" />} disabled={newName.trim() === "" || pending} onClick={create}>
            Crear
          </Button>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "10px 0 0" }}>La imagen es la que aparece en la tarjeta de la home. Si no subís una, se usa una foto del taller.</p>
      </Card>
    </div>
  );
}
