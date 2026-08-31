"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ds/Button";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { ProductCard } from "@/components/ds/ProductCard";
import { Icon } from "@/components/ds/Icon";
import { Input } from "@/components/ds/Input";
import { Card } from "@/components/ds/Card";
import { CATEGORIES, money, PRODUCTS } from "@/lib/data";

const SORTS = [
  { id: "rel", label: "Relevancia" },
  { id: "asc", label: "Precio ↑" },
  { id: "desc", label: "Precio ↓" },
];

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--text-technical)", marginBottom: 12 }}>{title}</span>
      {children}
    </div>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        fontFamily: "var(--font-body)",
        fontSize: 14,
        padding: "9px 12px",
        marginBottom: 6,
        borderRadius: "var(--radius)",
        cursor: "pointer",
        transition: "border-color .15s ease,background .15s ease,color .15s ease",
        border: "1px solid " + (active ? "var(--accent)" : "var(--border-card)"),
        background: active ? "var(--surface-card)" : "transparent",
        color: active ? "var(--accent)" : "var(--text-body)",
      }}
    >
      {children}
    </button>
  );
}

function CatalogInner() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categoria") || "Todos";

  const [q, setQ] = useState("");
  const [cat, setCat] = useState(initialCategory);
  const [max, setMax] = useState(30000);
  const [sort, setSort] = useState("rel");
  const [openFilters, setOpenFilters] = useState(false);

  // Re-sync `cat` when the ?categoria= param changes (e.g. clicking a category
  // card from Home) without remounting the whole filter state — adjusted during
  // render instead of an effect, per https://react.dev/learn/you-might-not-need-an-effect
  const [prevInitialCategory, setPrevInitialCategory] = useState(initialCategory);
  if (initialCategory !== prevInitialCategory) {
    setPrevInitialCategory(initialCategory);
    setCat(initialCategory);
  }

  const cats = ["Todos", ...CATEGORIES.map((c) => c.name)];
  let rows = PRODUCTS.filter(
    (p) => (cat === "Todos" || p.category === cat) && p.price <= max && (p.name + " " + p.measure + " " + p.category).toLowerCase().includes(q.trim().toLowerCase())
  );
  if (sort === "asc") rows = [...rows].sort((a, b) => a.price - b.price);
  if (sort === "desc") rows = [...rows].sort((a, b) => b.price - a.price);
  const clear = () => {
    setQ("");
    setCat("Todos");
    setMax(30000);
    setSort("rel");
  };

  const filters = (
    <div>
      <FilterGroup title="Categoría">
        {cats.map((c) => (
          <Choice key={c} active={cat === c} onClick={() => setCat(c)}>
            {c}
          </Choice>
        ))}
      </FilterGroup>
      <FilterGroup title="Precio hasta">
        <input type="range" min="5000" max="30000" step="1000" value={max} onChange={(e) => setMax(+e.target.value)} style={{ width: "100%", accentColor: "var(--accent)" }} />
        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{money(max)}</span>
      </FilterGroup>
      <FilterGroup title="Ordenar por">
        {SORTS.map((s) => (
          <Choice key={s.id} active={sort === s.id} onClick={() => setSort(s.id)}>
            {s.label}
          </Choice>
        ))}
      </FilterGroup>
      <button
        onClick={clear}
        style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500, background: "transparent", border: "none", color: "var(--text-muted)", textDecoration: "underline", cursor: "pointer", padding: 0, marginBottom: 26 }}
      >
        Limpiar filtros
      </button>
      <Card style={{ padding: 20, textAlign: "center" }}>
        <span style={{ display: "inline-flex", width: 40, height: 40, borderRadius: "50%", background: "var(--bg-alt)", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <Icon name="ruler" size={18} color="var(--wood)" />
        </span>
        <h3 style={{ fontSize: 17, margin: "0 0 8px" }}>¿No está tu medida?</h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 16px" }}>Lo cortamos como lo necesitás y te pasamos el precio por WhatsApp.</p>
        <Button as="a" href="/personalizado" size="sm">
          Pedir personalizado
        </Button>
      </Card>
    </div>
  );

  return (
    <div data-screen-label="Catálogo">
      <div className="wrap" style={{ paddingBottom: 30 }}>
        <div className="center" style={{ marginBottom: 30 }}>
          <SectionTitle eyebrow="Catálogo completo" title="Todos los productos" size="lg" style={{ textAlign: "center", marginBottom: 18 }} />
          <div style={{ width: "100%", maxWidth: 440 }}>
            <Input placeholder="Buscar por nombre, medida o categoría" value={q} onChange={(e) => setQ(e.target.value)} mono={false} />
          </div>
        </div>
        <div className="catalog-layout">
          <aside className="catalog-aside">
            <button
              className="catalog-toggle"
              onClick={() => setOpenFilters((v) => !v)}
              style={{ display: "none", width: "100%", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", padding: "11px 14px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-strong)", background: "transparent", color: "var(--ink)", cursor: "pointer", marginBottom: 16 }}
            >
              <Icon name="settings" size={14} /> {openFilters ? "Ocultar filtros" : "Filtros"}
            </button>
            <div className={openFilters ? "catalog-filters is-open" : "catalog-filters"}>{filters}</div>
          </aside>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>
                {rows.length} de {PRODUCTS.length} productos{cat !== "Todos" ? " · " + cat : ""}
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, color: "var(--text-technical)" }}>{SORTS.find((s) => s.id === sort)?.label}</span>
            </div>
            {rows.length === 0 ? (
              <Card style={{ padding: 40, textAlign: "center" }}>
                <p className="lead" style={{ color: "var(--text-muted)", margin: "0 auto 18px" }}>
                  No encontramos nada con esos filtros. Probá otra medida o pedinos la pieza a medida.
                </p>
                <Button size="sm" variant="secondary" onClick={clear}>
                  Limpiar filtros
                </Button>
              </Card>
            ) : (
              <div className="grid g3">
                {rows.map((p) => (
                  <Link key={p.slug} href={`/producto/${p.slug}`} style={{ color: "inherit" }}>
                    <ProductCard name={p.name} price={p.price} measure={p.measure} category={p.category} image={p.image} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={null}>
      <CatalogInner />
    </Suspense>
  );
}
