"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/ds/AdminSidebar";
import { BrandLogo } from "@/components/ui";
import { ADMIN_NAV } from "@/lib/adminData";
import { LogoutButton } from "./LogoutButton";

export function AdminChrome({ pending, children }: { pending: number; children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  const nav = ADMIN_NAV.map((n) => (n.id === "pedidos" ? { ...n, count: pending } : n));
  return (
    <div className="admin-shell">
      <div className="admin-nav">
        <div style={{ padding: "26px 18px 10px" }}>
          <BrandLogo height={42} tone="inverse" />
        </div>
        <AdminSidebar items={nav} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 18px 26px" }}>
          <Link
            href="/"
            style={{ background: "transparent", border: "1px solid var(--border-inverse)", color: "rgba(255,255,255,.65)", padding: "9px 10px", fontFamily: "var(--font-body)", fontSize: 13, borderRadius: "var(--radius)", cursor: "pointer", textAlign: "center" }}
          >
            ← Ver el sitio
          </Link>
          <LogoutButton />
        </div>
      </div>
      <div className="admin-main">{children}</div>
    </div>
  );
}
