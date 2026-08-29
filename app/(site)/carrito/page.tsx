"use client";

import { useState } from "react";
import { CartLineItem } from "@/components/ds/CartLineItem";
import { CartSummary } from "@/components/ds/CartSummary";
import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { MdfSurface } from "@/components/ds/MdfSurface";
import { useCart } from "@/components/cart-context";
import { PHOTOS, WA, money } from "@/lib/data";
import { ZONES } from "@/lib/adminData";

export default function CartPage() {
  const { items, inc, dec, remove } = useCart();
  const [zip, setZip] = useState("2900");
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal === 0 ? 0 : ZONES[zip] || 7400;
  const waOrder =
    WA +
    encodeURIComponent(
      "Hola! Te paso mi pedido:\n" +
        items.map((i) => `• ${i.name} ×${i.qty} — ${money(i.price * i.qty)}`).join("\n") +
        `\nSubtotal: ${money(subtotal)}\nCP: ${zip} · envío estimado ${money(shipping)}\nTotal: ${money(subtotal + shipping)}`
    );

  if (items.length === 0) {
    return (
      <section className="wrap center" data-screen-label="Carrito vacío">
        <Eyebrow style={{ marginBottom: 12 }}>Carrito vacío</Eyebrow>
        <h2 style={{ fontSize: "clamp(22px,4vw,28px)", margin: "0 0 14px" }}>Todavía no agregaste nada.</h2>
        <p className="lead" style={{ color: "var(--text-muted)", margin: "0 0 26px" }}>
          Podés empezar por el catálogo o pedirnos algo a medida.
        </p>
        <div className="row" style={{ maxWidth: 320 }}>
          <Button as="a" href="/catalogo" full>
            Ver productos
          </Button>
          <Button as="a" href="/personalizado" full variant="secondary" size="sm">
            Consultar personalizado
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="wrap" data-screen-label="Carrito" style={{ paddingTop: 40 }}>
      <h2 style={{ fontSize: "clamp(22px,4vw,28px)", margin: "0 0 24px", textAlign: "center" }}>Tu carrito</h2>
      <div className="grid" style={{ gridTemplateColumns: "minmax(0,1.6fr) minmax(280px,1fr)", gap: 32, alignItems: "start" }}>
        <div>
          {items.map((i) => (
            <CartLineItem
              key={i.slug}
              name={i.name}
              qty={i.qty}
              measure={i.measure}
              price={i.price * i.qty}
              image={i.image}
              onInc={() => inc(i.slug)}
              onDec={() => dec(i.slug)}
              onRemove={() => remove(i.slug)}
            />
          ))}
          <a
            href="/personalizado"
            style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginTop: 18, fontSize: 13, color: "var(--text-muted)", textDecoration: "underline", cursor: "pointer" }}
          >
            ¿No encontrás la medida que buscás? Consultá un personalizado
            <Icon name="arrow-right" size={14} />
          </a>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 30, padding: 16, background: "var(--surface-alt)", borderRadius: "var(--radius)" }}>
            <MdfSurface height={54} style={{ width: 54, flex: "0 0 54px" }} src={PHOTOS.workshop} alt="Taller" />
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>El pedido queda registrado al enviarlo. Te respondemos por WhatsApp con el precio final del envío y el tiempo de producción.</p>
          </div>
        </div>
        <CartSummary
          subtotal={subtotal}
          shipping={shipping}
          total={subtotal + shipping}
          zip={zip}
          onZipChange={(e) => setZip(e.target.value)}
          onSubmit={() => window.open(waOrder, "_blank")}
          note="El envío es estimado por zona. Se confirma por WhatsApp antes de despachar."
        />
      </div>
      <style>{"@media(max-width:900px){[data-screen-label='Carrito']>.grid{grid-template-columns:1fr!important}}"}</style>
    </section>
  );
}
