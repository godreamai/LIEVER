"use client";

import { useState } from "react";
import { Button } from "@/components/ds/Button";
import { Price } from "@/components/ds/Price";
import { Icon } from "@/components/ds/Icon";
import { SpecList } from "@/components/ds/SpecList";
import { useCart } from "@/components/cart-context";
import { WA } from "@/lib/data";
import type { Product, Spec } from "@/lib/types";

function VariantGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 18, width: "100%", maxWidth: 440 }}>
      <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
        {label}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 500,
              padding: "8px 14px",
              borderRadius: "var(--radius-pill)",
              cursor: "pointer",
              border: "1px solid " + (value === opt ? "var(--accent)" : "var(--border-strong)"),
              background: value === opt ? "var(--surface-card)" : "transparent",
              color: value === opt ? "var(--accent)" : "var(--text-body)",
              transition: "border-color .15s ease, color .15s ease",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [medida, setMedida] = useState(product.medidas?.[0] ?? product.measure);
  const [color, setColor] = useState(product.colores?.[0] ?? "");

  const customWa = WA + encodeURIComponent(`Hola Liever! Me interesa el modelo "${product.name}" y quiero personalizarlo (medida, color o terminación).`);

  const extraSpecs: Spec[] = [];
  if (product.colores?.length) extraSpecs.push({ label: "Colores disponibles", value: product.colores.join(", ") });
  if (product.accesorios?.length) extraSpecs.push({ label: "Accesorios compatibles", value: product.accesorios.join(", ") });
  if (product.tiempoFabricacion) extraSpecs.push({ label: "Tiempo de fabricación", value: product.tiempoFabricacion });
  if (product.entrega) extraSpecs.push({ label: "Envío / retiro", value: product.entrega.nota ?? [product.entrega.envio && "Envío", product.entrega.retiro && "Retiro en taller"].filter(Boolean).join(" · ") });

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Price value={product.price} size="lg" />
      </div>
      <p className="lead" style={{ color: "var(--text-muted)", margin: "0 0 26px" }}>
        {product.desc}
      </p>

      {product.medidas && product.medidas.length > 1 && (
        <VariantGroup label="Medida" options={product.medidas} value={medida} onChange={setMedida} />
      )}
      {product.colores && product.colores.length > 1 && (
        <VariantGroup label="Color" options={product.colores} value={color} onChange={setColor} />
      )}

      <div className="row" style={{ maxWidth: 340, justifyContent: "flex-start" }}>
        <Button
          full
          onClick={() => {
            add(product);
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
