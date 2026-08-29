"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

export interface AdminNavItem {
  id: string;
  label: string;
  icon?: string;
  href: string;
  count?: number;
}

export function AdminSidebar({ items = [], style }: { items: AdminNavItem[]; style?: React.CSSProperties }) {
  const pathname = usePathname();
  return (
    <aside style={{ background: "var(--surface-inverse)", color: "var(--text-inverse)", padding: "26px 18px", width: "var(--admin-sidebar-w)", ...style }}>
      <nav style={{ display: "grid", gap: 4 }}>
        {items.map((it) => {
          const on = pathname === it.href;
          return (
            <Link
              key={it.id}
              href={it.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                textAlign: "left",
                background: on ? "var(--surface-inverse-hover)" : "transparent",
                border: "none",
                color: on ? "var(--white)" : "rgba(255,255,255,.65)",
                padding: "11px 10px",
                fontSize: 14,
                fontFamily: "var(--font-body)",
                borderRadius: "var(--radius)",
                cursor: "pointer",
              }}
            >
              {it.icon && <Icon name={it.icon} size={16} />}
              {it.label}
              {it.count != null && <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>{it.count}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
