"use client";

import { useState } from "react";
import { Button } from "@/components/ds/Button";
import { Price } from "@/components/ds/Price";
import { Icon } from "@/components/ds/Icon";
import { SpecList } from "@/components/ds/SpecList";
import { useCart } from "@/components/cart-context";
import { WA } from "@/lib/data";
import { findVariant, selectionLabel, type Combo } from "@/lib/options";
import type { Product, Spec } from "@/lib/types";

function VariantGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 18, width: "100%", maxWidth: 440 }}>
      <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        style={{
          width: "100%",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          fontWeight: 500,
          padding: "11px 40px 11px 14px",
          borderRadius: "var(--radius)",
          cursor: "pointer",
          border: "1px solid var(--border-strong)",
          background: "var(--surface-card) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23857a72' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\") no-repeat right 14px center",
          color: "var(--text-body)",
          appearance: "none",
          WebkitAppearance: "none",
          outline: "none",
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  // Seleccionables dinámicos del producto (medida, color, etc.) y su precio por combinación.
  const hasOptions = product.options.length > 0;
  const [selection, setSelection] = useState<Combo>(() => Object.fromEntries(product.options.map((o) => [o.name, o.values[0]])));
  const variant = hasOptions ? findVariant(product.options, product.variants, selection) : undefined;
  const price = variant?.price ?? product.price;

  const customWa = WA + encodeURIComponent(`Hola Liever! Me interesa el modelo "${product.name}" y quiero personalizarlo (medida, color o terminación).`);

  const extraSpecs: Spec[] = [];
  if (product.accesorios?.length) extraSpecs.push({ label: "Accesorios compatibles", value: product.accesorios.join(", ") });
  if (product.tiempoFabricacion) extraSpecs.push({ label: "Tiempo de fabricación", value: product.tiempoFabricacion });
  if (product.entrega) extraSpecs.push({ label: "Envío / retiro", value: product.entrega.nota ?? [product.entrega.envio && "Envío", product.entrega.retiro && "Retiro en taller"].filter(Boolean).join(" · ") });

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Price value={price} size="lg" />
      </div>
      <p className="lead" style={{ color: "var(--text-muted)", margin: "0 0 26px" }}>
        {product.desc}
      </p>

      {product.options
        .filter((o) => o.values.length > 1)
        .map((o) => (
          <VariantGroup key={o.name} label={o.name} options={o.values} value={selection[o.name]} onChange={(v) => setSelection((s) => ({ ...s, [o.name]: v }))} />
        ))}

      <div className="row" style={{ maxWidth: 340, justifyContent: "flex-start" }}>
        <Button
          full
          onClick={() => {
            add(product, hasOptions ? { price, label: selectionLabel(product.options, selection) } : undefined);
            setAdded(true);
            setTimeout(() => setAdded(false), 1600);
          }}
          icon={<Icon name={added ? "check" : "shopping-cart"} size={16} color="var(--white)" />}
        >
          {added ? "¡Agregado al carrito!" : "Agregar al carrito"}
        </Button>
        <Button as="a" href={customWa} target="_blank" full variant="secondary" size="sm">
          Personalizar producto
        </Button>
      </div>

      <SpecList style={{ marginTop: 28, width: "100%", maxWidth: 440, textAlign: "left" }} items={[...product.specs, ...extraSpecs]} />
    </>
  );
}
