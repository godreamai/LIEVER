import React from "react";
import { MdfSurface } from "./MdfSurface";
import { Icon } from "./Icon";
import { Price } from "./Price";

const stepBtn: React.CSSProperties = {
  width: 26,
  height: 26,
  display: "grid",
  placeItems: "center",
  background: "transparent",
  border: "1px solid var(--border-strong)",
  borderRadius: "var(--radius)",
  cursor: "pointer",
  color: "var(--ink)",
};

export function CartLineItem({
  name,
  qty = 1,
  measure,
  price,
  image,
  onInc,
  onDec,
  onRemove,
  style,
}: {
  name: string;
  qty?: number;
  measure?: string;
  price: number;
  image: string | null;
  onInc?: () => void;
  onDec?: () => void;
  onRemove?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "18px 0", borderBottom: "1px solid var(--border-divider)", ...style }}>
      <MdfSurface height={70} src={image} alt={name} style={{ width: 70, flex: "0 0 70px" }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
        {measure && <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)" }}>{measure}</div>}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <button aria-label="Quitar uno" style={stepBtn} onClick={onDec}>
            <Icon name="minus" size={13} />
          </button>
          <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, minWidth: 16, textAlign: "center" }}>{qty}</span>
          <button aria-label="Agregar uno" style={stepBtn} onClick={onInc}>
            <Icon name="plus" size={13} />
          </button>
          {onRemove && (
            <button aria-label="Eliminar" style={{ ...stepBtn, border: "none", marginLeft: 4, color: "var(--ink-soft)" }} onClick={onRemove}>
              <Icon name="trash-2" size={14} />
            </button>
          )}
        </div>
      </div>
      <div style={{ marginLeft: "auto" }}>
        <Price value={price} tone="ink" />
      </div>
    </div>
  );
}
