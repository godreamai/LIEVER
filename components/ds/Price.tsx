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
  const sizes = { sm: 14, md: 16, lg: 26 };
  return (
    <span
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        fontSize: sizes[size],
        color: tone === "ink" ? "var(--text-body)" : tone === "muted" ? "var(--text-muted)" : "var(--text-price)",
        textDecoration: strike ? "line-through" : undefined,
        letterSpacing: "-0.01em",
        ...style,
      }}
    >
      {typeof value === "number" ? "$" + value.toLocaleString("es-AR") : value}
    </span>
  );
}
