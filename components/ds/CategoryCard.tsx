"use client";

import React, { useState } from "react";
import Image from "next/image";

export function CategoryCard({
  name,
  count,
  image,
  onClick,
  style,
}: {
  index?: string;
  name: string;
  count?: number;
  image?: string | null;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <div
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        cursor: "pointer",
        userSelect: "none",
        transition: "transform .18s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: active ? "scale(0.96)" : hover ? "translateY(-3px)" : "translateY(0)",
        minWidth: 110,
        ...style,
      }}
    >
      {/* Circular image avatar */}
      <div
        style={{
          position: "relative",
          width: 96,
          height: 96,
          borderRadius: "50%",
          overflow: "hidden",
          background: "var(--bg-alt)",
          border: `2px solid ${hover ? "var(--accent)" : "rgba(34, 29, 26, 0.12)"}`,
          boxShadow: hover
            ? "0 8px 22px rgba(217, 83, 30, 0.22)"
            : "0 2px 8px rgba(34, 29, 26, 0.06)",
          transition: "border-color .2s ease, box-shadow .2s ease",
          marginBottom: 10,
        }}
      >
        {image && (
          <Image
            src={image}
            alt={name}
            fill
            sizes="120px"
            style={{
              objectFit: "cover",
              transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: hover ? "scale(1.12)" : "scale(1)",
            }}
          />
        )}
      </div>

      {/* Category Name */}
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 15,
          color: hover ? "var(--accent)" : "var(--ink)",
          lineHeight: 1.25,
          transition: "color .18s ease",
          marginBottom: 2,
        }}
      >
        {name}
      </span>

      {/* Count */}
      {count != null && (
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 500,
            color: "var(--text-muted)",
          }}
        >
          {count} piezas
        </span>
      )}
    </div>
  );
}
