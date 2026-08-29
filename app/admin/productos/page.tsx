"use client";

import { useState } from "react";
import { Button } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { Card } from "@/components/ds/Card";
import { Input } from "@/components/ds/Input";
import { MdfSurface } from "@/components/ds/MdfSurface";
import { AdminProductCard } from "@/components/ds/AdminProductCard";
import { ADMIN_PRODUCTS } from "@/lib/adminData";
import type { AdminProduct } from "@/lib/types";

export default function AdminProductsPage() {
  const [editing, setEditing] = useState<Partial<AdminProduct> | null>(null);
  return (
    <div data-screen-label="Admin · Productos">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h2 style={{ fontSize: 26, margin: 0 }}>Productos</h2>
        <Button size="sm" icon={<Icon name="plus" size={14} color="var(--white)" />} onClick={() => setEditing({ name: "", price: undefined, measure: "", stock: undefined })}>
          Nuevo producto
        </Button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>{ADMIN_PRODUCTS.length} productos cargados</span>
        <span style={{ display: "flex", gap: 7, alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-technical)" }}>
          <Icon name="search" size={14} color="var(--line)" /> buscar por nombre o medida
        </span>
      </div>
      {editing && (
        <Card style={{ padding: 22, marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, margin: "0 0 16px" }}>{editing.name ? "Editar producto" : "Nuevo producto"}</h3>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, alignItems: "end" }}>
            <Input label="Nombre" defaultValue={editing.name} placeholder="Ej: Repisa flotante 80 cm" mono={false} />
            <Input label="Precio" defaultValue={editing.price} placeholder="21300" />
            <Input label="Medidas" defaultValue={editing.measure} placeholder="60 × 12 cm" />
            <Input label="Stock" defaultValue={editing.stock} placeholder="4" />
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 18, alignItems: "flex-end" }}>
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Foto</span>
              <MdfSurface height={70} style={{ width: 110 }} />
            </div>
            <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
              <Button variant="secondary" size="sm" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={() => setEditing(null)}>
                Guardar producto
              </Button>
            </div>
          </div>
        </Card>
      )}
      <div className="grid g3 gtight">
        {ADMIN_PRODUCTS.map((p) => (
          <AdminProductCard key={p.name} {...p} onEdit={() => setEditing(p)} />
        ))}
      </div>
    </div>
  );
}
