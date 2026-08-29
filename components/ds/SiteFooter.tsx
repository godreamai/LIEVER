import React from "react";
import { Icon } from "./Icon";

export function SiteFooter({
  contacts = [],
  legal = "Liever — San Nicolás de los Arroyos · Hecho con máquina de precisión",
  style,
}: {
  contacts?: { icon: string; label: string; mono?: boolean }[];
  legal?: string;
  style?: React.CSSProperties;
}) {
  return (
    <footer
      style={{
        background: "var(--surface-alt)",
        padding: 40,
        color: "var(--text-muted)",
        fontSize: 13,
        display: "grid",
        gap: 14,
        justifyItems: "center",
        textAlign: "center",
        ...style,
      }}
    >
      {contacts.length > 0 && (
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center" }}>
          {contacts.map((c) => (
            <span key={c.label} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: c.mono ? "var(--font-mono)" : "var(--font-body)" }}>
              <Icon name={c.icon} size={15} color="var(--wood)" />
              {c.label}
            </span>
          ))}
        </div>
      )}
      <span>{legal}</span>
    </footer>
  );
}
