import React from "react";

const tick: React.CSSProperties = { position: "absolute", background: "var(--line)" };

/** Technical-drawing dimension line: hairline rule with end ticks + a mono measure. */
export function DimensionLine({
  value,
  orientation = "horizontal",
  tone = "line",
  length,
  style,
  ...rest
}: {
  value: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  tone?: "line" | "onWood";
  length?: number;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const color = tone === "onWood" ? "rgba(255,252,246,.85)" : "var(--line)";
  const vertical = orientation === "vertical";
  const bar = (
    <span style={{ position: "relative", flex: 1, ...(vertical ? { width: 1 } : { height: 1 }), background: color }}>
      <span style={{ ...tick, background: color, ...(vertical ? { left: -4, top: 0, width: 9, height: 1 } : { top: -4, left: 0, width: 1, height: 9 }) }} />
      <span style={{ ...tick, background: color, ...(vertical ? { left: -4, bottom: 0, width: 9, height: 1 } : { top: -4, right: 0, width: 1, height: 9 }) }} />
    </span>
  );
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color,
        flexDirection: vertical ? "column" : "row",
        ...(vertical ? { height: length || 160, width: 14 } : { width: length || 180 }),
        ...(vertical ? { writingMode: "vertical-rl" as const } : null),
        ...style,
      }}
      {...rest}
    >
      {bar}
      <span style={{ whiteSpace: "nowrap" }}>{value}</span>
    </span>
  );
}
