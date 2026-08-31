"use client";

import React from "react";

const ANNOUNCEMENTS = [
  "Envíos a todo el país · Costo estimado con tu código postal",
  "Retiro sin cargo en nuestro taller: Garibaldi 203, San Nicolás",
  "Diseños y medidas 100% personalizados para tu espacio",
];

export function TopAnnouncementBar() {
  // Duplicate array for seamless infinite marquee loop
  const list = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div
      style={{
        background: "var(--bg-alt)",
        color: "var(--text-muted)",
        fontSize: 11,
        fontWeight: 500,
        height: 32,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        letterSpacing: "0.04em",
        borderBottom: "1px solid var(--border-hairline)",
        whiteSpace: "nowrap",
        userSelect: "none",
      }}
    >
      <div className="announcement-marquee">
        {list.map((text, idx) => (
          <span
            key={idx}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              padding: "0 20px",
            }}
          >
            <span>{text}</span>
            <span style={{ color: "var(--accent)", opacity: 0.6 }}>•</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        .announcement-marquee {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          animation: marquee 24s linear infinite;
        }
        .announcement-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </div>
  );
}
