import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ds/Eyebrow";

/** Pantalla centrada para 404 y errores: mismo estilo de marca, con acciones para seguir navegando. */
export function StatusPage({ eyebrow, title, children, actions }: { eyebrow: string; title: string; children: ReactNode; actions: ReactNode }) {
  return (
    <section className="wrap center" style={{ padding: "90px 20px", minHeight: "50vh", justifyContent: "center" }}>
      <Eyebrow tone="wood" style={{ marginBottom: 12 }}>
        {eyebrow}
      </Eyebrow>
      <h1 style={{ fontSize: "clamp(28px,4.5vw,40px)", margin: "0 0 16px", maxWidth: 620 }}>{title}</h1>
      <p className="lead" style={{ color: "var(--text-muted)", fontSize: 16, margin: "0 0 28px", maxWidth: 520 }}>
        {children}
      </p>
      <div className="row" style={{ gap: 14 }}>
        {actions}
      </div>
    </section>
  );
}
