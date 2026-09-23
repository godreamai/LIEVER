"use client";

import { useState, useTransition } from "react";
import { CartLineItem } from "@/components/ds/CartLineItem";
import { CartSummary } from "@/components/ds/CartSummary";
import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { MdfSurface } from "@/components/ds/MdfSurface";
import { useCart } from "@/components/cart-context";
import { PHOTOS, WA, money } from "@/lib/data";
import { quoteShipping, type ShippingZone } from "@/lib/shippingQuote";
import { placeOrderAction } from "./actions";

interface Placed {
  number: number;
  total: number;
  waUrl: string;
}

export function CartView({ zones }: { zones: ShippingZone[] }) {
  const { items, inc, dec, remove, clear } = useCart();
  const [zip, setZip] = useState("");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [submitting, startSubmit] = useTransition();

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = quoteShipping(zones, zip);
  const total = subtotal + (shipping ?? 0);
  const canSubmit = customer.trim() !== "" && shipping !== null;

  const lines = () => items.map((i) => `• ${i.name}${i.measure ? ` (${i.measure})` : ""} ×${i.qty} — ${money(i.price * i.qty)}`).join("\n");

  // Mismo pedido, sin número: para poder mandarlo por WhatsApp aunque falle el registro.
  const fallbackUrl =
    WA +
    encodeURIComponent(
      `Hola Liever! Soy ${customer.trim() || "un cliente"}. Te paso mi pedido:\n${lines()}\nSubtotal: ${money(subtotal)}\nCP: ${zip} · envío estimado ${money(shipping ?? 0)}\nTotal: ${money(total)}`
    );

  const submit = () => {
    if (!canSubmit) return;
    setError(null);
    // Se abre la pestaña ahora (dentro del clic) y se completa al confirmar el pedido: así el navegador no la bloquea.
    const tab = window.open("", "_blank");
    startSubmit(async () => {
      const res = await placeOrderAction({ customer, phone, zip, items: items.map((i) => ({ slug: i.slug, qty: i.qty, selection: i.selection })) });
      if (!res.ok) {
        tab?.close();
        setError(res.error);
        return;
      }
      const waUrl =
        WA +
        encodeURIComponent(
          `Hola Liever! Hice el pedido #${res.number} desde la web. Soy ${customer.trim()}.\n${lines()}\nSubtotal: ${money(res.subtotal)}\nCP: ${zip} · envío estimado ${money(res.shipping)}\nTotal: ${money(res.total)}`
        );
      if (tab) tab.location.href = waUrl;
      setPlaced({ number: res.number, total: res.total, waUrl });
      clear();
    });
  };

  if (placed) {
    return (
      <section className="wrap center" data-screen-label="Pedido registrado">
        <Eyebrow style={{ marginBottom: 12 }}>Pedido #{placed.number}</Eyebrow>
        <h2 style={{ fontSize: "clamp(22px,4vw,28px)", margin: "0 0 14px" }}>Registramos tu pedido.</h2>
        <p className="lead" style={{ color: "var(--text-muted)", margin: "0 0 8px", maxWidth: 520 }}>
          Total estimado: {money(placed.total)}. Escribinos por WhatsApp para confirmar el precio final del envío y el tiempo de producción.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "0 0 26px" }}>Si no se abrió WhatsApp, usá el botón de abajo.</p>
        <div className="row" style={{ maxWidth: 320 }}>
          <Button as="a" href={placed.waUrl} target="_blank" full icon={<Icon name="message-circle" size={16} color="var(--white)" />}>
            Abrir WhatsApp
          </Button>
          <Button as="a" href="/productos?categoria=todos" full variant="secondary" size="sm">
            Seguir viendo productos
          </Button>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="wrap center" data-screen-label="Carrito vacío">
        <Eyebrow style={{ marginBottom: 12 }}>Carrito vacío</Eyebrow>
        <h2 style={{ fontSize: "clamp(22px,4vw,28px)", margin: "0 0 14px" }}>Todavía no agregaste nada.</h2>
        <p className="lead" style={{ color: "var(--text-muted)", margin: "0 0 26px" }}>
          Podés empezar por el catálogo o pedirnos algo a medida.
        </p>
        <div className="row" style={{ maxWidth: 320 }}>
          <Button as="a" href="/productos" full>
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
              key={i.lineId}
              name={i.name}
              qty={i.qty}
              measure={i.measure}
              price={i.price * i.qty}
              image={i.image}
              onInc={() => inc(i.lineId)}
              onDec={() => dec(i.lineId)}
              onRemove={() => remove(i.lineId)}
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
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
              Al enviar, tu pedido queda registrado con un número y se abre WhatsApp para coordinar el pago, el precio final del envío y el tiempo de producción.
            </p>
          </div>
        </div>
        <CartSummary
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          zip={zip}
          onZipChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 4))}
          customer={customer}
          onCustomerChange={(e) => setCustomer(e.target.value)}
          phone={phone}
          onPhoneChange={(e) => setPhone(e.target.value)}
          canSubmit={canSubmit}
          submitting={submitting}
          error={error}
          fallbackHref={error ? fallbackUrl : undefined}
          onSubmit={submit}
          note="El envío es estimado por zona. Se confirma por WhatsApp antes de despachar."
        />
      </div>
      <style>{"@media(max-width:900px){[data-screen-label='Carrito']>.grid{grid-template-columns:1fr!important}}"}</style>
    </section>
  );
}
