"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./ds/Icon";
import { BrandLogo } from "./ui";
import { useCart } from "./cart-context";
import { TopAnnouncementBar } from "./ds/TopAnnouncementBar";
import { CartDrawer } from "./ds/CartDrawer";

const LINKS = [
  { id: "productos", href: "/catalogo", label: "Productos" },
  { id: "personalizado", href: "/personalizado", label: "Personalizado" },
  { id: "contacto", href: "/contacto", label: "Contacto" },
];

function subscribeToResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}
const getIsMobile = () => window.innerWidth <= 760;
const getIsMobileServer = () => false;

export function AppHeader() {
  const pathname = usePathname();
  const { count, openDrawer } = useCart();
  const mobile = useSyncExternalStore(subscribeToResize, getIsMobile, getIsMobileServer);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (!getIsMobile()) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const active = pathname?.startsWith("/contacto")
    ? "contacto"
    : pathname?.startsWith("/personalizado")
    ? "personalizado"
    : pathname?.startsWith("/catalogo") || pathname?.startsWith("/producto")
    ? "productos"
    : null;

  const linkStyle = (id: string): React.CSSProperties => ({
    fontSize: 14,
    fontWeight: 500,
    color: active === id ? "var(--accent)" : "var(--text-body)",
    cursor: "pointer",
    padding: mobile ? "14px 4px" : 0,
  });

  return (
    <>
      <TopAnnouncementBar />
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(252, 251, 249, 0.94)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border-hairline)",
          boxShadow: "0 4px 20px rgba(34, 29, 26, 0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: mobile ? "14px 20px" : "16px 32px", maxWidth: 1200, margin: "0 auto" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <BrandLogo height={mobile ? 38 : 36} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 26 }}>
            {!mobile &&
              LINKS.map((l) => (
                <Link key={l.id} href={l.href} style={linkStyle(l.id)}>
                  {l.label}
                </Link>
              ))}
            <button
              onClick={openDrawer}
              aria-label="Abrir carrito"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "transparent",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-pill)",
                padding: "8px 13px",
                cursor: "pointer",
                color: "var(--ink)",
                transition: "border-color .15s ease, background .15s ease",
              }}
            >
              <Icon name="shopping-cart" size={16} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600 }}>{count}</span>
            </button>
            {mobile && (
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={open}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: open ? "rgba(217, 83, 30, 0.1)" : "transparent",
                  border: "1px solid " + (open ? "var(--accent)" : "var(--border-strong)"),
                  borderRadius: "var(--radius-pill)",
                  padding: 9,
                  cursor: "pointer",
                  color: open ? "var(--accent)" : "var(--ink)",
                  transition: "all .15s ease",
                }}
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
              <div style={{ display: "grid", padding: "6px 20px 16px" }}>
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
      <CartDrawer />
    </>
  );
}
