"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../cart-context";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { WA } from "@/lib/data";

export function CartDrawer() {
  const router = useRouter();
  const { items, isDrawerOpen, closeDrawer, inc, dec, remove, count } = useCart();

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  const buildWaMessage = () => {
    let msg = "¡Hola Liever! Quiero realizar este pedido:\n\n";
    items.forEach((item) => {
      msg += `• ${item.qty}x ${item.name} (${item.measure || "estándar"}) — $${(item.price * item.qty).toLocaleString("es-AR")}\n`;
    });
    msg += `\nSubtotal: $${subtotal.toLocaleString("es-AR")}\n`;
    msg += "¿Cómo coordinamos el pago y envío?";
    return WA + encodeURIComponent(msg);
  };

  const handleGoToCart = () => {
    closeDrawer();
    router.push("/carrito");
  };

  if (!isDrawerOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(34, 29, 26, 0.45)",
          backdropFilter: "blur(4px)",
          transition: "opacity .25s ease",
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          height: "100%",
          background: "var(--surface-card)",
          boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          zIndex: 1,
          animation: "slideLeft 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-divider)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, margin: 0 }}>
              Tu Carrito
            </h3>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 600,
                background: "rgba(217, 83, 30, 0.1)",
                color: "var(--accent)",
                padding: "2px 8px",
                borderRadius: "var(--radius-pill)",
              }}
            >
              {count} {count === 1 ? "ítem" : "ítems"}
            </span>
          </div>

          <button
            onClick={closeDrawer}
            aria-label="Cerrar carrito"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 6,
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius)",
            }}
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Product Items List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "40px 0",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "var(--bg-alt)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  color: "var(--text-muted)",
                }}
              >
                <Icon name="shopping-cart" size={26} />
              </div>
              <p style={{ fontWeight: 600, fontSize: 16, color: "var(--ink)", margin: "0 0 6px" }}>
                Tu carrito está vacío
              </p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 20px", maxWidth: 240 }}>
                Explorá nuestros productos y sumalos a tu pedido.
              </p>
              <Button as="a" href="/catalogo" size="sm" onClick={closeDrawer}>
                Ver productos
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.slug}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  paddingBottom: 16,
                  borderBottom: "1px solid var(--border-hairline)",
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    position: "relative",
                    width: 64,
                    height: 64,
                    borderRadius: "var(--radius)",
                    overflow: "hidden",
                    background: "var(--bg-alt)",
                    flexShrink: 0,
                    border: "1px solid var(--border-hairline)",
                  }}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        color: "var(--text-muted)",
                      }}
                    >
                      Liever
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      margin: "0 0 2px",
                      color: "var(--ink)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.name}
                  </p>
                  {item.measure && (
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 8px" }}>
                      {item.measure}
                    </p>
                  )}

                  {/* Quantity and Price */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        border: "1px solid var(--border-strong)",
                        borderRadius: "var(--radius)",
                        height: 28,
                      }}
                    >
                      <button
                        onClick={() => dec(item.slug)}
                        aria-label="Disminuir cantidad"
                        style={{
                          background: "transparent",
                          border: "none",
                          width: 26,
                          height: "100%",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--ink)",
                        }}
                      >
                        <Icon name="minus" size={11} />
                      </button>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          minWidth: 20,
                          textAlign: "center",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {item.qty}
                      </span>
                      <button
                        onClick={() => inc(item.slug)}
                        aria-label="Aumentar cantidad"
                        style={{
                          background: "transparent",
                          border: "none",
                          width: 26,
                          height: "100%",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--ink)",
                        }}
                      >
                        <Icon name="plus" size={11} />
                      </button>
                    </div>

                    <button
                      onClick={() => remove(item.slug)}
                      aria-label="Eliminar producto"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--ink-soft)",
                        padding: 4,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Icon name="trash-2" size={13} />
                    </button>

                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--text-price)",
                      }}
                    >
                      ${(item.price * item.qty).toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div
            style={{
              padding: "20px 24px 24px",
              borderTop: "1px solid var(--border-divider)",
              background: "var(--bg-alt)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Subtotal ({count} {count === 1 ? "ítem" : "ítems"})</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>
                ${subtotal.toLocaleString("es-AR")}
              </span>
            </div>

            <Button
              as="a"
              href={buildWaMessage()}
              target="_blank"
              full
              icon={<Icon name="message-circle" size={16} color="var(--white)" />}
            >
              Pedir por WhatsApp
            </Button>

            <Button full variant="secondary" size="sm" onClick={handleGoToCart}>
              Ver carrito y calcular envío
            </Button>

            <button
              onClick={closeDrawer}
              style={{
                background: "transparent",
                border: "none",
                fontSize: 12,
                color: "var(--text-muted)",
                cursor: "pointer",
                textAlign: "center",
                padding: "4px 0",
                textDecoration: "underline",
              }}
            >
              ← Seguir viendo productos
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideLeft {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
