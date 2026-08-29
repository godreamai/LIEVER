import { Button } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { Card } from "@/components/ds/Card";
import { Price } from "@/components/ds/Price";
import { SHIP_ZONES } from "@/lib/adminData";

export default function AdminShippingPage() {
  return (
    <div data-screen-label="Admin · Tarifas">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h2 style={{ fontSize: 26, margin: 0 }}>Tarifas de envío</h2>
        <Button size="sm" variant="secondary" icon={<Icon name="pencil" size={14} />}>
          Editar tabla
        </Button>
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 620, margin: "0 0 20px" }}>
        El carrito estima el envío con esta tabla. No hay integración con el correo: el precio final se confirma por WhatsApp.
      </p>
      <Card>
        {SHIP_ZONES.map((z, i) => (
          <div key={z.zone} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderTop: i ? "1px solid rgba(42,36,32,.06)" : "none" }}>
            <Icon name="map-pin" size={16} color="var(--wood)" />
            <span style={{ fontSize: 14, flex: 1 }}>{z.zone}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>CP {z.cp}</span>
            <Price value={z.price} tone="ink" />
          </div>
        ))}
      </Card>
    </div>
  );
}
