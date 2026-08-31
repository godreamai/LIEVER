"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "./Icon";

export function WhatsAppFab({
  href = "#",
  label = "Consultar por WhatsApp",
}: {
  href?: string;
  label?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show tooltip after 1.4s
    const timer = setTimeout(() => {
      if (!dismissed) setShowTooltip(true);
    }, 1400);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTooltip(false);
    setDismissed(true);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "var(--fab-offset)",
        right: "var(--fab-offset)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      {/* Welcome Tooltip */}
      {showTooltip && !dismissed && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 12px)",
            right: 0,
            width: "max-content",
            maxWidth: 260,
            background: "var(--surface-card)",
            border: "1px solid var(--border-card)",
            borderRadius: "var(--radius)",
            padding: "12px 14px",
            boxShadow: "0 8px 24px rgba(34, 29, 26, 0.12)",
            animation: "tooltipSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {/* Header row with close button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--wood)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Atención directa
            </span>
            <button
              onClick={handleDismiss}
              aria-label="Cerrar mensaje"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 2,
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
              }}
            >
              <Icon name="x" size={13} />
            </button>
          </div>

          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ink)",
              lineHeight: 1.4,
              textDecoration: "none",
            }}
          >
            ¿Tenés dudas o querés una medida especial? <strong>Escribinos</strong>
          </a>

          {/* Little arrow pointing down to the FAB */}
          <div
            style={{
              position: "absolute",
              bottom: -6,
              right: 22,
              width: 10,
              height: 10,
              background: "var(--surface-card)",
              borderRight: "1px solid var(--border-card)",
              borderBottom: "1px solid var(--border-card)",
              transform: "rotate(45deg)",
            }}
          />
        </div>
      )}

      {/* Main WhatsApp Button */}
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        title={label}
        style={{
          width: "var(--fab-size)",
          height: "var(--fab-size)",
          borderRadius: "var(--radius-round)",
          background: "#25D366",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 20px rgba(37, 211, 102, 0.35)",
          transition: "transform .18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow .18s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
      >
        <Icon name="message-circle" size={26} strokeWidth={1.7} color="#ffffff" />
      </a>

      <style jsx>{`
        @keyframes tooltipSlideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
