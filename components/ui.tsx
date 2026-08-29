import React from "react";

const posMap: Record<string, React.CSSProperties> = {
  tl: { top: 12, left: 12 },
  tr: { top: 12, right: 12 },
  bl: { bottom: 12, left: 12 },
  br: { bottom: 12, right: 12 },
};

/** Rounded measure label — replaces bare hairlines over photos so the number stays legible. */
export function MeasureTag({
  value,
  at = "bl",
  tone = "dark",
  style,
}: {
  value: React.ReactNode;
  at?: keyof typeof posMap | null;
  tone?: "dark" | "light";
  style?: React.CSSProperties;
}) {
  const dark = tone === "dark";
  return (
    <span
      style={{
        position: at ? "absolute" : "relative",
        ...(at ? posMap[at] : null),
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: ".08em",
        whiteSpace: "nowrap",
        padding: "5px 11px",
        borderRadius: "var(--radius-pill)",
        background: dark ? "rgba(42,36,32,.78)" : "var(--white)",
        color: dark ? "var(--white)" : "var(--line)",
        border: "1px solid " + (dark ? "rgba(255,252,246,.28)" : "var(--border-strong)"),
        ...style,
      }}
    >
      <svg width="16" height="9" viewBox="0 0 16 9" aria-hidden="true" style={{ flex: "0 0 16px", opacity: dark ? 0.85 : 1 }}>
        <path d="M1 1v7M15 1v7M1 4.5h14" stroke="currentColor" strokeWidth={1} fill="none" />
      </svg>
      {value}
    </span>
  );
}

/** Centered section rule with its measurement, for use between sections. */
export function MeasureRule({ value, width = 420, style }: { value: React.ReactNode; width?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", ...style }}>
      <svg width="100%" height="9" viewBox="0 0 400 9" preserveAspectRatio="none" style={{ maxWidth: width, color: "var(--line)", opacity: 0.5 }} aria-hidden="true">
        <path d="M.5 1v7M399.5 1v7M0 4.5h400" stroke="currentColor" strokeWidth={1} fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      <MeasureTag value={value} at={null} tone="light" />
    </div>
  );
}

/** Step shown as a card, with the step number in a round plate. */
export function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius)", padding: "28px 22px 26px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
      <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--bg-alt)", border: "1px solid var(--border-strong)", color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 500, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        {number}
      </span>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, margin: "0 0 8px" }}>{title}</h3>
      <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0, maxWidth: "28ch" }}>{description}</p>
    </div>
  );
}

/**
 * Brand wordmark. No graphic logo file entregado por el cliente todavía —
 * el mismo patrón que usa el design system (nombre en Zilla Slab, sin ícono).
 */
export function BrandLogo({ height = 26, tone = "default", style }: { height?: number; tone?: "default" | "inverse"; style?: React.CSSProperties }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: height,
        lineHeight: 1,
        letterSpacing: ".01em",
        color: tone === "inverse" ? "var(--white)" : "var(--ink)",
        display: "inline-block",
        ...style,
      }}
    >
      Liever<span style={{ color: "var(--accent)" }}>.</span>
    </span>
  );
}
