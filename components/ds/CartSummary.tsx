import React from "react";
import { Card } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";
import { Icon } from "./Icon";

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontFamily: "var(--font-body)",
  fontSize: 14,
  padding: "6px 0",
};

type ChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;

export function CartSummary({
  subtotal,
  shipping,
  total,
  zip = "",
  onZipChange,
  customer = "",
  onCustomerChange,
  phone = "",
  onPhoneChange,
  canSubmit = true,
  submitting = false,
  error,
  fallbackHref,
  onSubmit,
  note,
  style,
}: {
  subtotal: number;
  /** null mientras el código postal no es válido: el envío todavía no se puede estimar. */
  shipping: number | null;
  total: number;
  zip?: string;
  onZipChange?: ChangeHandler;
  customer?: string;
  onCustomerChange?: ChangeHandler;
  phone?: string;
  onPhoneChange?: ChangeHandler;
  canSubmit?: boolean;
  submitting?: boolean;
  error?: string | null;
  /** Enlace de WhatsApp para enviar el pedido igual si no se pudo registrar. */
  fallbackHref?: string;
  onSubmit?: () => void;
  note?: string;
  style?: React.CSSProperties;
}) {
  const fmt = (v: number) => "$" + v.toLocaleString("es-AR");
  return (
    <Card style={{ padding: 26, alignSelf: "start", ...style }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, margin: "0 0 18px" }}>Resumen</h3>
      <Input label="Nombre" placeholder="Tu nombre" value={customer} onChange={onCustomerChange} mono={false} wrapStyle={{ marginBottom: 14 }} />
      <Input label="Teléfono (opcional)" placeholder="Ej: 336 400-1122" value={phone} onChange={onPhoneChange} wrapStyle={{ marginBottom: 14 }} />
      <Input label="Código postal" placeholder="Ej: 2900" value={zip} onChange={onZipChange} wrapStyle={{ marginBottom: 14 }} />
      <div style={row}>
        <span>Subtotal</span>
        <span>{fmt(subtotal)}</span>
      </div>
      <div style={row}>
        <span>Envío estimado</span>
        <span style={shipping === null ? { color: "var(--text-muted)", fontSize: 13 } : undefined}>{shipping === null ? "Ingresá tu CP" : fmt(shipping)}</span>
      </div>
      <div style={{ ...row, fontWeight: 700, fontSize: 17, borderTop: "1px solid rgba(42,36,32,.15)", marginTop: 10, paddingTop: 14 }}>
        <span>Total</span>
        <span>{fmt(total)}</span>
      </div>
      <Button full style={{ marginTop: 16 }} onClick={onSubmit} disabled={!canSubmit || submitting} icon={<Icon name="message-circle" size={16} color="var(--white)" />}>
        {submitting ? "Registrando pedido…" : "Enviar pedido por WhatsApp"}
      </Button>
      {error && (
        <p style={{ fontSize: 13, color: "var(--accent)", marginTop: 12, lineHeight: 1.45 }}>
          {error}
          {fallbackHref && (
            <>
              {" "}
              <a href={fallbackHref} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                Enviarlo igual por WhatsApp
              </a>
            </>
          )}
        </p>
      )}
      {note && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12, lineHeight: 1.45 }}>{note}</p>}
    </Card>
  );
}
