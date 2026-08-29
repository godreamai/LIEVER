import React from "react";
import { Card } from "./Card";
import { Icon } from "./Icon";

export function CategoryCard({
  index,
  name,
  count,
  icon,
  onClick,
  style,
}: {
  index: string;
  name: string;
  count?: number;
  icon?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <Card interactive onClick={onClick} style={{ padding: "26px 20px", ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--wood)" }}>{index}</span>
        {icon && <Icon name={icon} size={18} color="var(--wood)" />}
      </div>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, margin: "8px 0 0" }}>{name}</h3>
      {count != null && (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{count} productos</span>
      )}
    </Card>
  );
}
