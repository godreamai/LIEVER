"use client";

import React, { useState } from "react";
import { Icon } from "./Icon";

export interface AccordionItem {
  id: string;
  title: string;
  icon?: string;
  content: React.ReactNode;
}

export function Accordion({
  items,
  allowMultiple = false,
  style,
}: {
  items: AccordionItem[];
  allowMultiple?: boolean;
  style?: React.CSSProperties;
}) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, ...style }}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            style={{
              borderBottom: "1px solid var(--border-divider)",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              style={{
                width: "100%",
                padding: "16px 0",
                background: "none",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 600,
                color: isOpen ? "var(--accent)" : "var(--ink)",
                transition: "color .15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {item.icon && <Icon name={item.icon} size={17} color={isOpen ? "var(--accent)" : "var(--wood)"} />}
                <span>{item.title}</span>
              </div>
              <div
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform .2s ease",
                  color: "var(--text-muted)",
                }}
              >
                <Icon name="chevron-down" size={16} />
              </div>
            </button>

            {isOpen && (
              <div
                style={{
                  paddingBottom: 18,
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "var(--text-muted)",
                  textAlign: "left",
                  animation: "fadeIn .2s ease",
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
