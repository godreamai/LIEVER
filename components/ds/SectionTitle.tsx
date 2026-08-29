import React from "react";
import { Eyebrow } from "./Eyebrow";

export function SectionTitle({
  eyebrow,
  title,
  size = "md",
  tone = "default",
  style,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  size?: "md" | "lg";
  tone?: "default" | "inverse";
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 36, ...style }}>
      {eyebrow && (
        <Eyebrow tone={tone === "inverse" ? "inverse" : "technical"} style={{ marginBottom: 10 }}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: size === "lg" ? 32 : 28,
          lineHeight: "var(--leading-heading)",
          color: tone === "inverse" ? "var(--text-inverse)" : "var(--text-body)",
          margin: 0,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
