import type { Metadata } from "next";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { PROJECTS } from "@/lib/projects";
import { ProjectsGallery } from "./ProjectsGallery";

export const metadata: Metadata = {
  // La página está fuera del menú y del sitemap hasta cargar trabajos reales (hoy son ejemplos de muestra).
  robots: { index: false },
  title: "Proyectos",
  description: "Ejemplos del tipo de trabajo que diseñamos y fabricamos: comercios, mobiliario, divisores y piezas personalizadas.",
};

export default function ProyectosPage() {
  return (
    <div data-screen-label="Proyectos">
      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderBottom: "1px solid var(--border-hairline)" }}>
        <div className="wrap wrap--narrow center" style={{ padding: 0 }}>
          <Eyebrow style={{ marginBottom: 12 }}>Trabajos realizados</Eyebrow>
          <h1 style={{ fontSize: "clamp(30px,4.5vw,44px)", margin: "0 0 18px", maxWidth: 700 }}>
            Proyectos que pensamos, diseñamos y fabricamos.
          </h1>
          <p className="lead" style={{ color: "var(--text-muted)", fontSize: 16, margin: 0, maxWidth: 620 }}>
            Estamos documentando los primeros proyectos de esta nueva etapa de LIEVER. Estos son ejemplos representativos del tipo de trabajo que hacemos.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ padding: "70px 20px" }}>
        <SectionTitle eyebrow="Selección de trabajos" title="Algunos proyectos" size="lg" style={{ textAlign: "center", marginBottom: 24 }} />
        <ProjectsGallery projects={PROJECTS} />
      </section>
    </div>
  );
}
