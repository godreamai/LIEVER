"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ds/Button";
import { Card } from "@/components/ds/Card";
import { Icon } from "@/components/ds/Icon";
import { saveShippingZonesAction } from "./actions";
import type { ShippingZone } from "@/lib/shippingQuote";

interface Row {
  key: string;
  id: string | null;
  name: string;
  cpFrom: string;
  cpTo: string;
  price: string;
  isDefault: boolean;
}

const fieldStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 14,
  padding: "8px 10px",
  border: "1px solid var(--border-strong)",
  borderRadius: "var(--radius)",
  background: "var(--white)",
  color: "var(--ink)",
  minWidth: 0,
};

const toRow = (z: ShippingZone): Row => ({
  key: z.id,
  id: z.id,
  name: z.name,
  cpFrom: z.cpFrom === null ? "" : String(z.cpFrom),
  cpTo: z.cpTo === null ? "" : String(z.cpTo),
  price: String(z.price),
  isDefault: z.isDefault,
});

export function ShippingEditor({ initialZones }: { initialZones: ShippingZone[] }) {
  const [rows, setRows] = useState<Row[]>(initialZones.map(toRow));
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, startSaving] = useTransition();

  const update = (key: string, patch: Partial<Row>) => setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const addZone = () => {
    // La zona por defecto tiene que quedar siempre última: las nuevas van antes.
    const fresh: Row = { key: crypto.randomUUID(), id: null, name: "", cpFrom: "", cpTo: "", price: "", isDefault: false };
    setRows((prev) => {
      const at = prev.findIndex((r) => r.isDefault);
      return at === -1 ? [...prev, fresh] : [...prev.slice(0, at), fresh, ...prev.slice(at)];
    });
  };

  const save = () => {
    setMessage(null);
    startSaving(async () => {
      const res = await saveShippingZonesAction(
        rows.map((r) => ({
          id: r.id,
          name: r.name,
          cpFrom: r.isDefault || r.cpFrom === "" ? null : Number(r.cpFrom),
          cpTo: r.isDefault || r.cpTo === "" ? null : Number(r.cpTo),
          price: Number(r.price),
          isDefault: r.isDefault,
        }))
      );
      setMessage(res.ok ? { ok: true, text: "Tarifas guardadas. El carrito ya usa los nuevos valores." } : { ok: false, text: res.error ?? "No se pudieron guardar las tarifas." });
    });
  };

  return (
    <>
      <Card>
        {rows.map((r, i) => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", flexWrap: "wrap", borderTop: i ? "1px solid rgba(42,36,32,.06)" : "none" }}>
            <Icon name="map-pin" size={16} color="var(--wood)" />
            <input aria-label="Nombre de la zona" value={r.name} onChange={(e) => update(r.key, { name: e.target.value })} placeholder="Nombre de la zona" style={{ ...fieldStyle, flex: "1 1 220px" }} />
            {r.isDefault ? (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", flex: "0 0 150px" }}>Cualquier otro CP</span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 6, flex: "0 0 auto" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>CP</span>
                <input aria-label="CP desde" inputMode="numeric" value={r.cpFrom} onChange={(e) => update(r.key, { cpFrom: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="1000" style={{ ...fieldStyle, width: 72 }} />
                <span style={{ color: "var(--text-muted)" }}>–</span>
                <input aria-label="CP hasta" inputMode="numeric" value={r.cpTo} onChange={(e) => update(r.key, { cpTo: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="1900" style={{ ...fieldStyle, width: 72 }} />
              </span>
            )}
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "var(--text-muted)" }}>$</span>
              <input aria-label="Precio" inputMode="numeric" value={r.price} onChange={(e) => update(r.key, { price: e.target.value.replace(/\D/g, "") })} placeholder="5000" style={{ ...fieldStyle, width: 92 }} />
            </span>
            {r.isDefault ? (
              <span style={{ width: 30 }} />
            ) : (
              <button aria-label="Quitar zona" onClick={() => setRows((prev) => prev.filter((x) => x.key !== r.key))} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6 }}>
                <Icon name="trash-2" size={16} color="var(--text-muted)" />
              </button>
            )}
          </div>
        ))}
      </Card>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
        <Button size="sm" variant="secondary" icon={<Icon name="plus" size={14} />} onClick={addZone}>
          Agregar zona
        </Button>
        <Button size="sm" onClick={save} disabled={saving}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </Button>
        {message && <span style={{ fontSize: 13, color: message.ok ? "var(--green)" : "var(--accent)" }}>{message.text}</span>}
      </div>
    </>
  );
}
