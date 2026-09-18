"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ds/Button";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { ProductCard } from "@/components/ds/ProductCard";
import { Icon } from "@/components/ds/Icon";
import { Input } from "@/components/ds/Input";
import { Card } from "@/components/ds/Card";
import { money } from "@/lib/data";
import type { Category, Product } from "@/lib/types";

const SORTS = [
  { id: "rel", label: "Relevancia" },
  { id: "asc", label: "Precio ↑" },
  { id: "desc", label: "Precio ↓" },
];

const PAGE_SIZE = 9;

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

const pagerBtnStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 13,
  fontWeight: 500,
  padding: "8px 12px",
  borderRadius: "var(--radius)",
  border: "1px solid var(--border-card)",
  background: "transparent",
  color: "var(--text-body)",
  cursor: "pointer",
};

const pagerBtnActiveStyle: React.CSSProperties = {
  border: "1px solid var(--accent)",
  background: "var(--surface-card)",
  color: "var(--accent)",
  fontWeight: 600,
};

function Pager({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 32, flexWrap: "wrap" }}>
      <button onClick={() => onChange(page - 1)} disabled={page === 1} style={{ ...pagerBtnStyle, opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? "default" : "pointer" }}>
        ← Anterior
      </button>
      {pages.map((p) => (
        <button key={p} onClick={() => onChange(p)} style={{ ...pagerBtnStyle, minWidth: 38, textAlign: "center", ...(p === page ? pagerBtnActiveStyle : {}) }}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages} style={{ ...pagerBtnStyle, opacity: page === totalPages ? 0.4 : 1, cursor: page === totalPages ? "default" : "pointer" }}>
        Siguiente →
      </button>
    </div>
  );
}

export function CatalogFilters({ products, categories }: { products: Product[]; categories: Category[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [openFilters, setOpenFilters] = useState(false);

  // Todo el estado de filtros vive en la URL (?categoria=&precio=&q=&orden=&pagina=)
  // en vez de useState local: así, si entrás a un producto y volvés con el botón
  // "atrás" del navegador, la URL sigue siendo la misma y los filtros no se pierden.
  const cat = searchParams.get("categoria") || "Todos";
  const sort = searchParams.get("orden") || "rel";
  const q = searchParams.get("q") || "";
  const page = Math.max(1, Number(searchParams.get("pagina")) || 1);

  // Tope del slider de precio: el mayor entre $30.000 y el producto más caro
  // que haya cargado el admin, para que ningún producto quede inalcanzable.
  const priceCeiling = useMemo(() => {
    const highest = products.reduce((m, p) => Math.max(m, p.price), 0);
    return Math.max(30000, Math.ceil(highest / 10000) * 10000);
  }, [products]);
  const maxParam = searchParams.get("precio");
  const max = maxParam ? Number(maxParam) : priceCeiling;

  const setParams = useCallback(
    (updates: Record<string, string | null>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });
      if (resetPage) params.delete("pagina");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setCat = (v: string) => setParams({ categoria: v === "Todos" ? null : v });
  const setSort = (v: string) => setParams({ orden: v === "rel" ? null : v });
  const setQ = (v: string) => setParams({ q: v || null });
  const setMax = (v: number) => setParams({ precio: v === priceCeiling ? null : String(v) });
  const setPage = (p: number) => setParams({ pagina: p === 1 ? null : String(p) }, false);

  const cats = ["Todos", ...categories.map((c) => c.name)];
  let rows = products.filter(
    (p) => (cat === "Todos" || p.category === cat) && p.price <= max && (p.name + " " + p.measure + " " + p.category).toLowerCase().includes(q.trim().toLowerCase())
  );
  if (sort === "asc") rows = [...rows].sort((a, b) => a.price - b.price);
  if (sort === "desc") rows = [...rows].sort((a, b) => b.price - a.price);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const clear = () => router.replace(pathname, { scroll: false });

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
        <input type="range" min="5000" max={priceCeiling} step="1000" value={max} onChange={(e) => setMax(+e.target.value)} style={{ width: "100%", accentColor: "var(--accent)" }} />
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

  const rangeStart = rows.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, rows.length);

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
                {rows.length === 0 ? "0 productos" : `${rangeStart}–${rangeEnd} de ${rows.length} productos`}
                {cat !== "Todos" ? " · " + cat : ""}
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
              <>
                <div className="grid g3">
                  {paged.map((p) => (
                    <Link key={p.slug} href={`/producto/${p.slug}`} style={{ color: "inherit" }}>
                      <ProductCard name={p.name} price={p.price} measure={p.measure} category={p.category} image={p.image} />
                    </Link>
                  ))}
                </div>
                <Pager page={safePage} totalPages={totalPages} onChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
