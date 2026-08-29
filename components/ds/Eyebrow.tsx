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
  const color = tone === "wood" ? "var(--wood)" : tone === "inverse" ? "rgba(255,252,246,.6)" : "var(--text-technical)";
  return (
    <span
      style={{
        display: "block",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "var(--tracking-eyebrow)",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
