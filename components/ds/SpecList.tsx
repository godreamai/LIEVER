import React from "react";
import type { Spec } from "@/lib/types";

export function SpecList({ items = [], style }: { items: Spec[]; style?: React.CSSProperties }) {
  return (
    <div style={{ borderTop: "1px solid rgba(42,36,32,.12)", paddingTop: 20, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", ...style }}>
      {items.map((it) => (
        <div key={it.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", gap: 24 }}>
          <span>{it.label}</span>
          <span style={{ color: "var(--text-body)", textAlign: "right" }}>{it.value}</span>
        </div>
      ))}
    </div>
  );
}
