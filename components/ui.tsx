import React from "react";
import Image from "next/image";

/**
 * Official Brand Logo image from public/logo.png.
 */
export function BrandLogo({
  height = 32,
  tone = "default",
  style,
  className,
}: {
  height?: number;
  tone?: "default" | "inverse";
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height,
        ...style,
      }}
      className={className}
    >
      <Image
        src="/logo.png"
        alt="Liever"
        width={height * 4}
        height={height}
        priority
        style={{
          height: "100%",
          width: "auto",
          maxHeight: height,
          objectFit: "contain",
          display: "block",
          // Logo is white — invert to dark on light surfaces, keep white on dark surfaces
          filter: tone === "inverse"
            ? "none"
            : "invert(1) sepia(1) saturate(0) brightness(0.15)",
        }}
      />
    </span>
  );
}
