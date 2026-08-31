"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Price } from "./Price";

export function ProductCard({
  name,
  price,
  measure,
  category,
  image,
  thumbHeight = 180,
  onClick,
  style,
}: {
  name: string;
  price: number;
  measure?: string;
  category?: string;
  image: string | null;
  thumbHeight?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onTouchStart={() => setActive(true)}
      onTouchEnd={() => setActive(false)}
      style={{
        background: "var(--surface-card)",
        border: `1px solid ${hover ? "rgba(217, 83, 30, 0.4)" : "var(--border-card)"}`,
        borderRadius: "var(--radius)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform .18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow .22s ease, border-color .22s ease",
        transform: active ? "scale(0.98)" : hover ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hover ? "0 10px 28px rgba(34, 29, 26, 0.08)" : "var(--shadow-card)",
        ...style,
      }}
    >
      {/* Image container */}
      <div
        style={{
          position: "relative",
          height: thumbHeight,
          width: "100%",
          background: "var(--bg-alt)",
          overflow: "hidden",
        }}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            style={{
              objectFit: "cover",
              transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: hover ? "scale(1.05)" : "scale(1)",
            }}
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
              fontSize: 12,
            }}
          >
            Liever
          </div>
        )}

        {/* Measure badge */}
        {measure && (
          <span
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              background: "rgba(34, 29, 26, 0.75)",
              backdropFilter: "blur(6px)",
              color: "#ffffff",
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 500,
              padding: "3px 9px",
              borderRadius: "var(--radius-pill)",
              letterSpacing: ".02em",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
            }}
          >
            {measure}
          </span>
        )}
      </div>

      {/* Body info */}
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        {category && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              color: "var(--wood)",
              background: "rgba(139, 90, 60, 0.08)",
              padding: "3px 8px",
              borderRadius: "var(--radius-xs)",
              width: "fit-content",
              display: "inline-block",
              marginBottom: 8,
            }}
          >
            {category}
          </span>
        )}
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 16,
            margin: "0 0 10px",
            color: "var(--ink)",
            lineHeight: 1.25,
          }}
        >
          {name}
        </h4>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Price value={price} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: hover ? "var(--accent)" : "var(--text-muted)",
              fontFamily: "var(--font-body)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              transition: "color .18s ease",
            }}
          >
            Ver detalle
            <span
              style={{
                display: "inline-block",
                transform: hover ? "translateX(4px)" : "translateX(0)",
                transition: "transform .2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              →
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
