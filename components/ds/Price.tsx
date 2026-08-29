import React from "react";

export function Price({
  value,
  size = "md",
  tone = "accent",
  strike = false,
  style,
}: {
  value: number | string;
  size?: "sm" | "md" | "lg";
  tone?: "accent" | "ink" | "muted";
  strike?: boolean;
  style?: React.CSSProperties;
}) {
  const sizes = { sm: 13, md: 15, lg: 26 };
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        fontSize: sizes[size],
        color: tone === "ink" ? "var(--text-body)" : tone === "muted" ? "var(--text-muted)" : "var(--text-price)",
        textDecoration: strike ? "line-through" : undefined,
        ...style,
      }}
    >
      {typeof value === "number" ? "$" + value.toLocaleString("es-AR") : value}
    </span>
  );
}
