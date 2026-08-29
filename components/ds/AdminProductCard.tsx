import React from "react";
import { Card } from "./Card";
import { MdfSurface } from "./MdfSurface";
import { Price } from "./Price";
import { Icon } from "./Icon";
import type { AdminProduct } from "@/lib/types";

export function AdminProductCard({ name, price, measure, stock, image, onEdit, style }: AdminProduct & { onEdit?: () => void; style?: React.CSSProperties }) {
  return (
    <Card style={{ padding: 14, display: "flex", gap: 12, alignItems: "flex-start", ...style }}>
      <MdfSurface height={60} src={image} alt={name} style={{ width: 60, flex: "0 0 60px" }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>{name}</h4>
        <Price value={price} size="sm" />
        {measure && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
            {measure}
            {stock != null && ` · stock ${stock}`}
          </div>
        )}
      </div>
      <button onClick={onEdit} aria-label="Editar producto" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 2 }}>
        <Icon name="pencil" size={15} />
      </button>
    </Card>
  );
}
