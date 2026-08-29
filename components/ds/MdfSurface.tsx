import React from "react";
import Image from "next/image";

export function MdfSurface({
  height = 180,
  tone = "light",
  src = null,
  alt = "",
  caption = null,
  children,
  style,
  onClick,
  className,
}: {
  height?: number;
  tone?: "light" | "dark";
  src?: string | null;
  alt?: string;
  caption?: string | null;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`mdf-surface${tone === "dark" ? " mdf-surface--dark" : ""}${src ? " mdf-surface--photo" : ""}${className ? " " + className : ""}`}
      style={{ height, width: "100%", ...style }}
      onClick={onClick}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      )}
      {caption && (
        <span
          style={{
            position: "absolute",
            left: 16,
            bottom: 14,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".15em",
            textTransform: "uppercase",
            color: "rgba(255,252,246,.72)",
            whiteSpace: "nowrap",
            textShadow: "0 1px 2px rgba(42,36,32,.45)",
          }}
        >
          {caption}
        </span>
      )}
      {children}
    </div>
  );
}
