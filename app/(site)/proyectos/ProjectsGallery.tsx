"use client";

import { useState } from "react";
import Image from "next/image";
import type { Project } from "@/lib/projects";

const ALL = "Todos";

export function ProjectsGallery({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(ALL);
  const categories = [ALL, ...Array.from(new Set(projects.map((p) => p.category)))];
  const visible = active === ALL ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, margin: "0 0 32px" }}>
        {categories.map((c) => {
          const on = c === active;
          return (
            <button
              key={c}
              onClick={() => setActive(c)}
              aria-pressed={on}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: on ? 600 : 500,
                padding: "8px 16px",
                borderRadius: "var(--radius-pill)",
                cursor: "pointer",
                border: "1px solid " + (on ? "var(--accent)" : "var(--border-card)"),
                background: on ? "var(--surface-card)" : "transparent",
                color: on ? "var(--accent)" : "var(--text-body)",
                transition: "border-color .15s ease, color .15s ease",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="grid g3">
        {visible.map((p) => (
          <article
            key={p.slug}
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius)",
              overflow: "hidden",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ position: "relative", height: 200, background: "var(--bg-alt)" }}>
              <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
            </div>
            <div style={{ padding: "18px 20px" }}>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  color: "var(--wood)",
                  background: "rgba(139, 90, 60, 0.08)",
                  padding: "3px 8px",
                  borderRadius: "var(--radius-xs)",
                  display: "inline-block",
                  marginBottom: 10,
                }}
              >
                {p.category}
              </span>
              <h3 style={{ fontSize: 16, margin: "0 0 8px" }}>{p.title}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0, lineHeight: 1.55 }}>{p.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
