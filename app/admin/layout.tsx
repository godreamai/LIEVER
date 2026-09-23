import type { Metadata } from "next";
import { getPendingOrdersCount } from "@/lib/orders";
import { AdminChrome } from "./AdminChrome";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Si la tabla de pedidos todavía no existe (o no hay sesión, como en /admin/login), el contador queda en 0.
  const pending = await getPendingOrdersCount().catch(() => 0);
  return <AdminChrome pending={pending}>{children}</AdminChrome>;
}
