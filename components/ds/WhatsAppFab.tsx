import React from "react";
import { Icon } from "./Icon";

export function WhatsAppFab({ href = "#", label = "Consultar por WhatsApp" }: { href?: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      style={{
        position: "fixed",
        bottom: "var(--fab-offset)",
        right: "var(--fab-offset)",
        width: "var(--fab-size)",
        height: "var(--fab-size)",
        borderRadius: "var(--radius-round)",
        background: "var(--accent)",
        color: "var(--white)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "var(--shadow-float)",
        zIndex: 50,
      }}
    >
      <Icon name="message-circle" size={26} strokeWidth={1.5} color="var(--white)" />
    </a>
  );
}
