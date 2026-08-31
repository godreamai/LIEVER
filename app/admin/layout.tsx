"use client";

import Link from "next/link";
import { AdminOrdersProvider, useAdminOrders } from "@/components/admin-orders-context";
import { AdminSidebar } from "@/components/ds/AdminSidebar";
import { BrandLogo } from "@/components/ui";
import { ADMIN_NAV } from "@/lib/adminData";

function AdminChrome({ children }: { children: React.ReactNode }) {
  const { orders } = useAdminOrders();
  const pend = orders.filter((o) => o.status === "pendiente").length;
  const nav = ADMIN_NAV.map((n) => (n.id === "pedidos" ? { ...n, count: pend } : n));
  return (
    <div className="admin-shell">
      <div className="admin-nav">
        <div style={{ padding: "26px 18px 10px" }}>
          <BrandLogo height={42} tone="inverse" />
        </div>
        <AdminSidebar items={nav} />
        <Link
          href="/"
          style={{ margin: "0 18px 26px", background: "transparent", border: "1px solid var(--border-inverse)", color: "rgba(255,255,255,.65)", padding: "9px 10px", fontFamily: "var(--font-body)", fontSize: 13, borderRadius: "var(--radius)", cursor: "pointer", textAlign: "center" }}
        >
          ← Ver el sitio
        </Link>
      </div>
      <div className="admin-main">{children}</div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminOrdersProvider>
      <AdminChrome>{children}</AdminChrome>
    </AdminOrdersProvider>
  );
}
