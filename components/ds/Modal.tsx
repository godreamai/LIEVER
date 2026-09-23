"use client";

import React, { useEffect, useRef } from "react";
import { Icon } from "./Icon";

// Pila de modales abiertos: con uno encima de otro, Escape cierra solo el de arriba.
const stack: symbol[] = [];

interface ModalProps {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  footer?: React.ReactNode;
  maxWidth?: number;
  children: React.ReactNode;
}

export function Modal({ title, eyebrow, onClose, footer, maxWidth = 720, children }: ModalProps) {
  const id = useRef(Symbol("modal"));
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const me = id.current;
    stack.push(me);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stack[stack.length - 1] === me) onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      stack.splice(stack.indexOf(me), 1);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000 + stack.length, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} role="dialog" aria-modal="true" aria-label={title}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(34, 29, 26, 0.45)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth, maxHeight: "90vh", display: "flex", flexDirection: "column", background: "var(--surface-card)", borderRadius: "var(--radius)", boxShadow: "0 20px 50px rgba(0,0,0,.25)" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border-divider)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            {eyebrow && <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: ".06em", textTransform: "uppercase" }}>{eyebrow}</span>}
            <h3 style={{ fontSize: 18, margin: eyebrow ? "2px 0 0" : 0 }}>{title}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 6 }}>
            <Icon name="x" size={20} />
          </button>
        </div>
        <div style={{ padding: "18px 24px", overflowY: "auto", flex: 1 }}>{children}</div>
        {footer && <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border-divider)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>{footer}</div>}
      </div>
    </div>
  );
}
