import Link from "next/link";
import { AppHeader } from "@/components/Header";
import { BrandLogo } from "@/components/ui";
import { SiteFooter } from "@/components/ds/SiteFooter";
import { WhatsAppFab } from "@/components/ds/WhatsAppFab";
import { Icon } from "@/components/ds/Icon";
import { WA } from "@/lib/data";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <AppHeader />
      <div className="site-main">{children}</div>
      <div className="site-foot">
        <div style={{ background: "var(--surface-alt)", paddingTop: 40, display: "flex", justifyContent: "center" }}>
          <BrandLogo height={30} />
        </div>
        <SiteFooter
          contacts={[
            { icon: "phone", label: "+54 9 336 400-0000", mono: true },
            { icon: "map-pin", label: "San Nicolás de los Arroyos" },
            { icon: "clock", label: "Lun a Vie 9-18 h", mono: true },
          ]}
        />
        <div style={{ background: "var(--surface-alt)", padding: "0 40px 30px", textAlign: "center" }}>
          <Link
            href="/admin"
            style={{
              background: "transparent",
              border: "1px solid var(--border-strong)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              padding: "8px 14px",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Icon name="settings" size={13} /> Admin
          </Link>
        </div>
      </div>
      <WhatsAppFab href={WA + encodeURIComponent("Hola! Quiero hacer una consulta.")} />
    </div>
  );
}
