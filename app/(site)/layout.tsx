import Link from "next/link";
import { AppHeader } from "@/components/Header";
import { BrandLogo } from "@/components/ui";
import { WhatsAppFab } from "@/components/ds/WhatsAppFab";
import { Icon } from "@/components/ds/Icon";
import { WA, PHONE, PHONE_RAW, INSTAGRAM, INSTAGRAM_EVENTOS, ADDRESS, MAPS_URL, HOURS_WEEKDAY, HOURS_SAT } from "@/lib/data";

const NAV_LINKS = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Personalizado", href: "/personalizado" },
  { label: "Contacto", href: "/contacto" },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <AppHeader />
      <div className="site-main">{children}</div>

      <footer style={{
        background: "var(--ink)",
        color: "var(--white)",
      }}>
        {/* main footer body */}
        <div className="site-footer-container">
          {/* col 1 — brand */}
          <div className="site-footer-col">
            <div>
              <BrandLogo height={34} tone="inverse" />
            </div>
            <p style={{
              fontSize: 13,
              color: "rgba(255,252,246,.6)",
              lineHeight: 1.65,
              margin: 0,
              maxWidth: 320,
            }}>
              Corte CNC en madera con precisión milimétrica. Decoración, cartelería y muebles a medida.
            </p>
          </div>

          {/* col 2 — nav */}
          <div className="site-footer-col">
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "rgba(255,252,246,.5)",
              marginBottom: 4,
            }}>Navegación</span>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="footer-nav-link"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* col 3 — social & location */}
          <div className="site-footer-col">
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "rgba(255,252,246,.5)",
              marginBottom: 4,
            }}>Taller & Redes</span>
            <div className="site-footer-contacts">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "rgba(255,252,246,.75)",
                  fontFamily: "var(--font-body)",
                  textDecoration: "none",
                  transition: "color .15s ease",
                }}
              >
                <Icon name="map-pin" size={14} color="var(--accent)" />
                Garibaldi 203, San Nicolás
              </a>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  color: "rgba(255,252,246,.6)",
                  fontFamily: "var(--font-body)",
                }}
              >
                <Icon name="clock" size={14} color="var(--accent)" />
                {HOURS_WEEKDAY} · {HOURS_SAT}
              </span>

              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "rgba(255,252,246,.75)",
                  fontFamily: "var(--font-body)",
                  textDecoration: "none",
                  transition: "color .15s ease",
                }}
              >
                <Icon name="instagram" size={14} color="var(--accent)" />
                @liever.sannicolas
              </a>

              <a
                href={WA + encodeURIComponent("Hola Liever! Me contacto desde la web.")}
                target="_blank"
                rel="noreferrer"
                style={{
                  marginTop: 4,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 13,
                  color: "var(--white)",
                  background: "#25D366",
                  padding: "8px 16px",
                  borderRadius: "var(--radius-pill)",
                  fontWeight: 600,
                  textDecoration: "none",
                  width: "fit-content",
                  boxShadow: "0 4px 12px rgba(37, 211, 102, 0.2)",
                }}
              >
                <Icon name="message-circle" size={15} color="white" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* divider */}
        <div style={{
          borderTop: "1px solid rgba(255,252,246,.1)",
          maxWidth: 1200,
          margin: "0 auto",
        }} />

        {/* bottom bar */}
        <div className="site-footer-bottom">
          <span style={{
            fontSize: 12,
            color: "rgba(255,252,246,.4)",
            fontFamily: "var(--font-body)",
          }}>
            © {new Date().getFullYear()} Liever — San Nicolás de los Arroyos
          </span>
          <Link
            href="/admin"
            className="footer-admin-link"
          >
            <Icon name="settings" size={12} color="currentColor" />
            Panel de administración
          </Link>
        </div>
      </footer>

      <WhatsAppFab href={WA + encodeURIComponent("Hola Liever! Me contacto desde la web para hacer una consulta.")} />
    </div>
  );
}
