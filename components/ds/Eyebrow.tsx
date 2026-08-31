import React from "react";

export function Eyebrow({
  tone = "technical",
  children,
  style,
}: {
  tone?: "technical" | "wood" | "inverse";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const color = tone === "wood" ? "var(--wood)" : tone === "inverse" ? "rgba(255,252,246,.7)" : "var(--text-technical)";
  return (
    <span
      style={{
        display: "block",
        fontFamily: "var(--font-body)",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
