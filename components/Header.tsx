"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./ds/Icon";
import { BrandLogo } from "./ui";
import { useCart } from "./cart-context";

const LINKS = [
  { id: "productos", href: "/catalogo", label: "Productos" },
  { id: "personalizado", href: "/personalizado", label: "Personalizado" },
  { id: "contacto", href: "/personalizado", label: "Contacto" },
];

function subscribeToResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}
const getIsMobile = () => window.innerWidth <= 760;
const getIsMobileServer = () => false;

export function AppHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const mobile = useSyncExternalStore(subscribeToResize, getIsMobile, getIsMobileServer);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    last.current = window.scrollY;
    const onResize = () => {
      if (!getIsMobile()) setOpen(false);
    };
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 90 && y > last.current);
      if (y > last.current) setOpen(false);
      last.current = y;
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const active = pathname?.startsWith("/personalizado") ? "personalizado" : pathname?.startsWith("/catalogo") || pathname?.startsWith("/producto") ? "productos" : null;
  const linkStyle = (id: string): React.CSSProperties => ({
    fontSize: 14,
    fontWeight: 500,
    color: active === id ? "var(--accent)" : "var(--text-body)",
    cursor: "pointer",
    padding: mobile ? "12px 4px" : 0,
  });

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        transform: hidden ? "translateY(-110%)" : "translateY(0)",
        transition: "transform .25s ease",
        background: "var(--surface-page)",
        borderBottom: "1px solid var(--border-divider)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: mobile ? "14px 20px" : "16px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <Link href="/" style={{ display: "flex" }}>
          <BrandLogo height={mobile ? 22 : 26} />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 26 }}>
          {!mobile &&
            LINKS.map((l) => (
              <Link key={l.id} href={l.href} style={linkStyle(l.id)}>
                {l.label}
              </Link>
            ))}
          <Link
            href="/carrito"
            aria-label="Carrito"
            style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-pill)", padding: "8px 13px", cursor: "pointer", color: "var(--ink)" }}
          >
            <Icon name="shopping-cart" size={16} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{count}</span>
          </Link>
          {mobile && (
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menú"
              aria-expanded={open}
              style={{ display: "flex", alignItems: "center", background: "transparent", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-pill)", padding: 9, cursor: "pointer", color: "var(--ink)" }}
            >
              <Icon name={open ? "x" : "menu"} size={18} />
            </button>
          )}
        </div>
      </div>
      {mobile && (
        <nav
          style={{
            display: "grid",
            gridTemplateRows: open ? "1fr" : "0fr",
            transition: "grid-template-rows .25s ease",
            borderTop: open ? "1px solid var(--border-divider)" : "none",
            background: "var(--surface-card)",
          }}
        >
          <div style={{ overflow: "hidden", minHeight: 0 }}>
            <div style={{ display: "grid", padding: "6px 20px 14px" }}>
              {LINKS.map((l) => (
                <Link key={l.id} href={l.href} onClick={() => setOpen(false)} style={{ ...linkStyle(l.id), borderBottom: "1px solid var(--border-divider)" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
