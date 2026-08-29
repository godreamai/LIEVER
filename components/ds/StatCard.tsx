import React from "react";
import { Card } from "./Card";

export function StatCard({
  label,
  value,
  unit,
  alert = false,
  hint,
  small = false,
  style,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  alert?: boolean;
  hint?: string;
  small?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <Card style={{ padding: 20, ...style }}>
      <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-label)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: small ? 16 : 28, marginTop: 8, color: alert ? "var(--accent)" : "var(--text-body)", lineHeight: 1.1 }}>
        {value}
        {unit && <span style={{ fontSize: 14, marginLeft: 4, color: "var(--text-muted)" }}>{unit}</span>}
      </div>
      {hint && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{hint}</div>}
    </Card>
  );
}
