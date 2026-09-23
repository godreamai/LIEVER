import React from "react";
import { Card } from "./Card";
import { MdfSurface } from "./MdfSurface";
import { Price } from "./Price";
import { Icon } from "./Icon";
import { stockBadge } from "@/lib/stock";
import type { ProductAdmin } from "@/lib/types";

export function AdminProductCard({
  product,
  onEdit,
  onToggleActive,
  onDelete,
  style,
}: {
  product: ProductAdmin;
  onEdit?: () => void;
  onToggleActive?: () => void;
  onDelete?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <Card style={{ padding: 14, display: "flex", gap: 12, alignItems: "flex-start", opacity: product.active ? 1 : 0.6, ...style }}>
      <MdfSurface height={60} src={product.image} alt={product.name} style={{ width: 60, flex: "0 0 60px" }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, margin: 0 }}>{product.name}</h4>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 7px",
              borderRadius: "var(--radius-pill)",
              background: product.active ? "var(--status-enviado-bg)" : "rgba(42,36,32,.1)",
              color: product.active ? "var(--status-enviado-fg)" : "var(--ink-soft)",
            }}
          >
            {product.active ? "Activo" : "Inactivo"}
          </span>
          {stockBadge(product.stock) && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: "var(--radius-pill)", background: "rgba(181,103,61,.12)", color: "var(--accent)" }}>{stockBadge(product.stock)}</span>
          )}
        </div>
        <Price value={product.price} size="sm" />
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
          {product.measure}
          {product.categoryName && ` · ${product.categoryName}`}
        </div>
      </div>
      <div style={{ display: "flex", gap: 2 }}>
        <button
          onClick={onToggleActive}
          aria-label={product.active ? "Desactivar producto" : "Activar producto"}
          title={product.active ? "Desactivar" : "Activar"}
          style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4 }}
        >
          <Icon name={product.active ? "x" : "check"} size={15} />
        </button>
        <button onClick={onEdit} aria-label="Editar producto" title="Editar" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4 }}>
          <Icon name="pencil" size={15} />
        </button>
        <button onClick={onDelete} aria-label="Eliminar producto" title="Eliminar" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4 }}>
          <Icon name="trash-2" size={15} />
        </button>
      </div>
    </Card>
  );
}
