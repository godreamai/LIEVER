import React from "react";
import { Card } from "./Card";
import { MdfSurface } from "./MdfSurface";
import { DimensionLine } from "./DimensionLine";
import { Price } from "./Price";

export function ProductCard({
  name,
  price,
  measure,
  category,
  image,
  thumbHeight = 150,
  onClick,
  style,
}: {
  name: string;
  price: number;
  measure?: string;
  category?: string;
  image: string | null;
  thumbHeight?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <Card interactive as="article" onClick={onClick} style={{ overflow: "hidden", ...style }}>
      <MdfSurface height={thumbHeight} src={image} alt={name} style={{ borderRadius: 0 }}>
        {measure && (
          <DimensionLine
            value={measure}
            tone="onWood"
            length={Math.max(80, thumbHeight * 0.8)}
            style={{ position: "absolute", left: 12, bottom: 12 }}
          />
        )}
      </MdfSurface>
      <div style={{ padding: 16 }}>
        {category && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--wood)",
              display: "block",
              marginBottom: 6,
            }}
          >
            {category}
          </span>
        )}
        <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, margin: "0 0 6px" }}>{name}</h4>
        <Price value={price} />
      </div>
    </Card>
  );
}
