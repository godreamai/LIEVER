import React from "react";
import type { Spec } from "@/lib/types";

export function SpecList({ items = [], style }: { items: Spec[]; style?: React.CSSProperties }) {
  return (
    <div style={{ borderTop: "1px solid var(--border-divider)", paddingTop: 20, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", ...style }}>
      {items.map((it) => (
        <div key={it.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--border-hairline)", gap: 24 }}>
          <span>{it.label}</span>
          <span style={{ color: "var(--text-body)", fontWeight: 500, textAlign: "right" }}>{it.value}</span>
        </div>
      ))}
    </div>
  );
}
