import React from "react";
import { Card } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";
import { Icon } from "./Icon";

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontFamily: "var(--font-mono)",
  fontSize: 14,
  padding: "6px 0",
};

export function CartSummary({
  subtotal,
  shipping,
  total,
  zip = "",
  onZipChange,
  onSubmit,
  note,
  style,
}: {
  subtotal: number;
  shipping: number;
  total: number;
  zip?: string;
  onZipChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: () => void;
  note?: string;
  style?: React.CSSProperties;
}) {
  const fmt = (v: number) => "$" + v.toLocaleString("es-AR");
  return (
    <Card style={{ padding: 26, alignSelf: "start", ...style }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, margin: "0 0 18px" }}>Resumen</h3>
      <Input label="Código postal" placeholder="Ej: 2900" value={zip} onChange={onZipChange} wrapStyle={{ marginBottom: 14 }} />
      <div style={row}>
        <span>Subtotal</span>
        <span>{fmt(subtotal)}</span>
      </div>
      <div style={row}>
        <span>Envío estimado</span>
        <span>{fmt(shipping)}</span>
      </div>
      <div style={{ ...row, fontWeight: 700, fontSize: 17, borderTop: "1px solid rgba(42,36,32,.15)", marginTop: 10, paddingTop: 14 }}>
        <span>Total</span>
        <span>{fmt(total)}</span>
      </div>
      <Button full style={{ marginTop: 16 }} onClick={onSubmit} icon={<Icon name="message-circle" size={16} color="var(--white)" />}>
        Enviar pedido por WhatsApp
      </Button>
      {note && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12, lineHeight: 1.45 }}>{note}</p>}
    </Card>
  );
}
