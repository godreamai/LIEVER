import { Card } from "@/components/ds/Card";
import { getOrders } from "@/lib/orders";
import { OrdersClient } from "./OrdersClient";

export default async function AdminOrdersPage() {
  let orders;
  try {
    orders = await getOrders();
  } catch {
    return (
      <Card style={{ padding: 32, textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>No se pudieron cargar los pedidos. Verificá que la migración de pedidos esté aplicada en Supabase.</p>
      </Card>
    );
  }
  return <OrdersClient orders={orders} />;
}
