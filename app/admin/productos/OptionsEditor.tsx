"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { Input } from "@/components/ds/Input";
import { Modal } from "@/components/ds/Modal";
import { MAX_COMBOS, buildCombos, comboKey } from "@/lib/options";
import type { ProductAdmin, ProductOption, ProductVariant } from "@/lib/types";

// Estado de edición: los valores se escriben separados por coma y los precios como texto.
export interface OptionDraft {
  name: string;
  valuesText: string;
  affectsPrice: boolean;
}

export type VariantPrices = Record<string, string>;

function splitCsv(text: string): string[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function optionsToDrafts(options: ProductOption[]): OptionDraft[] {
  return options.map((o) => ({ name: o.name, valuesText: o.values.join(", "), affectsPrice: o.affectsPrice }));
}

export function draftsToOptions(drafts: OptionDraft[]): ProductOption[] {
  return drafts.map((d) => ({ name: d.name.trim(), values: splitCsv(d.valuesText), affectsPrice: d.affectsPrice }));
}

export function variantsToPrices(variants: ProductVariant[]): VariantPrices {
  return Object.fromEntries(variants.map((v) => [comboKey(v.combo), String(v.price)]));
}

// Solo guarda las combinaciones vigentes que tienen un precio cargado.
export function pricesToVariants(options: ProductOption[], prices: VariantPrices): ProductVariant[] {
  return buildCombos(options).flatMap((combo) => {
    const price = Number(prices[comboKey(combo)]);
    return Number.isFinite(price) && price > 0 ? [{ combo, price }] : [];
  });
}

const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: 12,
  color: "var(--text-muted)",
  marginBottom: 6,
};

const hintStyle: React.CSSProperties = { ...labelStyle, fontSize: 11.5, marginBottom: 8, marginTop: 0 };

const selectStyle: React.CSSProperties = {
  padding: 8,
  border: "1px solid var(--border-input)",
  borderRadius: "var(--radius)",
  background: "var(--surface-card)",
  fontFamily: "var(--font-body)",
  fontSize: 13,
  color: "var(--text-body)",
};

interface Props {
  options: OptionDraft[];
  prices: VariantPrices;
  basePrice: number;
  otherProducts: ProductAdmin[];
  onChange: (options: OptionDraft[], prices: VariantPrices) => void;
}

// Resumen dentro del formulario del producto; la edición ocurre en un modal de 2 pasos.
export function OptionsEditor({ options, prices, basePrice, otherProducts, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const parsed = useMemo(() => draftsToOptions(options), [options]);
  const combos = useMemo(() => buildCombos(parsed), [parsed]);
  const priced = combos.filter((c) => Number(prices[comboKey(c)]) > 0).length;
  const hasPriceOptions = parsed.some((o) => o.affectsPrice && o.values.length > 0);

  return (
    <div style={{ marginBottom: 18 }}>
      <span style={labelStyle}>Seleccionables (medida, color, etc.)</span>

      {options.length === 0 ? (
        <span style={hintStyle}>Este producto se vende tal cual, sin opciones. Agregá seleccionables si el cliente puede elegir medida, color u otras variantes.</span>
      ) : (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          {parsed.map((o) => (
            <span key={o.name} style={{ fontFamily: "var(--font-body)", fontSize: 13, padding: "6px 12px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-card)", color: "var(--text-body)" }}>
              {o.name || "Sin nombre"} · {o.values.length} {o.values.length === 1 ? "opción" : "opciones"}
              {!o.affectsPrice && " · sin precio"}
            </span>
          ))}
        </div>
      )}

      {hasPriceOptions && (
        <span style={{ ...hintStyle, color: priced < combos.length ? "var(--status-pendiente-fg)" : "var(--text-muted)" }}>
          {priced === combos.length ? `Las ${combos.length} combinaciones tienen precio.` : `${priced} de ${combos.length} combinaciones con precio. Las demás se cobran al precio base.`}
        </span>
      )}

      <Button variant="secondary" size="sm" icon={<Icon name={options.length ? "pencil" : "plus"} size={13} />} onClick={() => setOpen(true)} type="button">
        {options.length ? "Editar seleccionables y precios" : "Configurar seleccionables"}
      </Button>

      {open && (
        <OptionsModal
          initialOptions={options}
          initialPrices={prices}
          basePrice={basePrice}
          otherProducts={otherProducts}
          onCancel={() => setOpen(false)}
          onSave={(o, p) => {
            onChange(o, p);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

interface ModalProps {
  initialOptions: OptionDraft[];
  initialPrices: VariantPrices;
  basePrice: number;
  otherProducts: ProductAdmin[];
  onCancel: () => void;
  onSave: (options: OptionDraft[], prices: VariantPrices) => void;
}

function OptionsModal({ initialOptions, initialPrices, basePrice, otherProducts, onCancel, onSave }: ModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [options, setOptions] = useState<OptionDraft[]>(initialOptions);
  const [prices, setPrices] = useState<VariantPrices>(initialPrices);
  const [copyFrom, setCopyFrom] = useState("");

  const parsed = useMemo(() => draftsToOptions(options), [options]);
  const combos = useMemo(() => buildCombos(parsed), [parsed]);
  const needsPrices = combos.length > 0 && parsed.some((o) => o.affectsPrice);
  const priced = combos.filter((c) => Number(prices[comboKey(c)]) > 0).length;

  const copyable = useMemo(
    () => otherProducts.flatMap((p) => p.options.map((o) => ({ key: `${p.id}::${o.name}`, label: `${o.name} · ${p.name}`, option: o }))),
    [otherProducts],
  );

  // Validación del paso 1: nombres únicos y al menos una opción por seleccionable.
  const step1Error = useMemo(() => {
    const names = new Set<string>();
    for (const o of parsed) {
      if (!o.name) return "Todos los seleccionables necesitan un nombre.";
      if (names.has(o.name)) return `"${o.name}" está repetido.`;
      names.add(o.name);
      if (o.values.length === 0) return `"${o.name}" necesita al menos una opción.`;
      if (new Set(o.values).size !== o.values.length) return `"${o.name}" tiene opciones repetidas.`;
    }
    if (combos.length > MAX_COMBOS) return `Son ${combos.length} combinaciones y el máximo es ${MAX_COMBOS}. Marcá algún seleccionable como "no cambia el precio".`;
    return null;
  }, [parsed, combos.length]);

  const update = (idx: number, patch: Partial<OptionDraft>) => setOptions((os) => os.map((o, i) => (i === idx ? { ...o, ...patch } : o)));
  const remove = (idx: number) => setOptions((os) => os.filter((_, i) => i !== idx));
  const add = () => setOptions((os) => [...os, { name: "", valuesText: "", affectsPrice: true }]);

  const copyOption = () => {
    const found = copyable.find((c) => c.key === copyFrom);
    if (!found) return;
    setOptions((os) => [...os, ...optionsToDrafts([found.option])]);
    setCopyFrom("");
  };

  const fillEmpty = () => {
    const next = { ...prices };
    combos.forEach((c) => {
      const key = comboKey(c);
      if (!(Number(next[key]) > 0)) next[key] = String(basePrice);
    });
    setPrices(next);
  };

  const goNext = () => (needsPrices ? setStep(2) : onSave(options, prices));

  const footer = (
    <>
      {step === 1 && step1Error && <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--status-pendiente-fg)", flex: 1 }}>{step1Error}</span>}
      <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
        {step === 2 ? (
          <>
            <Button variant="secondary" size="sm" onClick={() => setStep(1)} type="button">
              Atrás
            </Button>
            <Button size="sm" onClick={() => onSave(options, prices)} type="button">
              Listo
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" size="sm" onClick={onCancel} type="button">
              Cancelar
            </Button>
            <Button size="sm" onClick={goNext} disabled={!!step1Error} type="button">
              {needsPrices ? "Siguiente: cargar precios" : "Listo"}
            </Button>
          </>
        )}
      </div>
    </>
  );

  return (
    <Modal eyebrow={`Paso ${step} de 2`} title={step === 1 ? "¿Qué puede elegir el cliente?" : "Precio final de cada combinación"} onClose={onCancel} footer={footer}>
          {step === 1 ? (
            <>
              <span style={hintStyle}>
                Creá un seleccionable por cada cosa que el cliente elige (Medida, Color, Terminación…) y escribí sus opciones separadas por coma. En el paso siguiente vas a cargar los precios.
              </span>

              {options.map((o, i) => (
                <div key={i} style={{ padding: 12, border: "1px solid var(--border-card)", borderRadius: "var(--radius)", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
                    <Input label="Nombre" value={o.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Color" mono={false} wrapStyle={{ flex: "1 1 140px" }} />
                    <Input label="Opciones (separadas por coma)" value={o.valuesText} onChange={(e) => update(i, { valuesText: e.target.value })} placeholder="Roble, Nogal, Blanco" mono={false} wrapStyle={{ flex: "3 1 240px" }} />
                    <button type="button" onClick={() => remove(i)} aria-label="Quitar seleccionable" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 10 }}>
                      <Icon name="trash-2" size={16} />
                    </button>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-body)", cursor: "pointer" }}>
                    <input type="checkbox" checked={o.affectsPrice} onChange={(e) => update(i, { affectsPrice: e.target.checked })} />
                    Esta elección cambia el precio
                  </label>
                </div>
              ))}

              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 4 }}>
                <Button variant="ghost" size="sm" icon={<Icon name="plus" size={13} />} onClick={add} type="button">
                  Agregar seleccionable
                </Button>
                {copyable.length > 0 && (
                  <>
                    <select value={copyFrom} onChange={(e) => setCopyFrom(e.target.value)} style={selectStyle}>
                      <option value="">Copiar de otro producto…</option>
                      {copyable.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <Button variant="secondary" size="sm" onClick={copyOption} disabled={!copyFrom} type="button">
                      Copiar
                    </Button>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div style={{ background: "var(--surface-alt)", borderRadius: "var(--radius)", padding: "12px 14px", marginBottom: 14, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-body)" }}>
                Escribí el <strong>precio final</strong> que paga el cliente por cada combinación. Las que dejes vacías se cobran al precio base ({basePrice > 0 ? money(basePrice) : "sin cargar"}).
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: priced === combos.length ? "var(--accent)" : "var(--text-muted)" }}>
                  {priced} de {combos.length} con precio
                </span>
                {basePrice > 0 && (
                  <Button variant="ghost" size="sm" onClick={fillEmpty} type="button">
                    Completar las vacías con {money(basePrice)}
                  </Button>
                )}
              </div>

              {combos.map((combo) => {
                const key = comboKey(combo);
                return (
                  <div key={key} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                    <span style={{ flex: 1, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-body)" }}>{Object.values(combo).join(" · ")}</span>
                    <Input type="number" value={prices[key] ?? ""} onChange={(e) => setPrices((p) => ({ ...p, [key]: e.target.value }))} placeholder={basePrice ? String(basePrice) : "Precio"} wrapStyle={{ width: 150 }} />
                  </div>
                );
              })}
            </>
          )}
    </Modal>
  );
}
