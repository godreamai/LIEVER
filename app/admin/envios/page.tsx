import { Card } from "@/components/ds/Card";
import { getAdminShippingZones } from "@/lib/shipping";
import { ShippingEditor } from "./ShippingEditor";

export default async function AdminShippingPage() {
  let zones;
  try {
    zones = await getAdminShippingZones();
  } catch {
    return (
      <Card style={{ padding: 32, textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>No se pudieron cargar las tarifas. Verificá que la migración de envíos esté aplicada en Supabase.</p>
      </Card>
    );
  }

  return (
    <div data-screen-label="Admin · Tarifas">
      <h2 style={{ fontSize: 26, margin: "0 0 12px" }}>Tarifas de envío</h2>
      <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 620, margin: "0 0 20px" }}>
        El carrito estima el envío con estas zonas según el código postal. No hay integración con el correo: el precio final se confirma por WhatsApp.
      </p>
      <ShippingEditor initialZones={zones} />
    </div>
  );
}
