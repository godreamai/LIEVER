import React from "react";
import Image from "next/image";
import { Button } from "@/components/ds/Button";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { SectionTitle } from "@/components/ds/SectionTitle";
import { Icon } from "@/components/ds/Icon";
import { Accordion, type AccordionItem } from "@/components/ds/Accordion";
import { WA, PHONE, PHONE_RAW, INSTAGRAM, INSTAGRAM_EVENTOS, ADDRESS, MAPS_URL, HOURS_WEEKDAY, HOURS_SAT } from "@/lib/data";

const FAQ_ITEMS: AccordionItem[] = [
  {
    id: "presupuesto",
    icon: "ruler",
    title: "¿Cómo pido un presupuesto para un trabajo a medida?",
    content: (
      <span>
        Nos podés escribir directamente por WhatsApp indicando las <strong>medidas aproximadas (ancho × alto × espesor)</strong>, el material que preferís y si tenés una foto, bosquejo o archivo en curvas (DXF, SVG, AI, PDF). Te preparamos la cotización en el día sin costo.
      </span>
    ),
  },
  {
    id: "envios",
    icon: "truck",
    title: "¿Cómo funcionan los envíos y los costos?",
    content: (
      <span>
        Hacemos envíos a todo el país por correo y flete. Al pasarnos tu código postal, te calculamos el costo exacto antes de confirmar el pedido. Todas las piezas van embaladas con protección reforzada para asegurar que lleguen impecables.
      </span>
    ),
  },
  {
    id: "retiro",
    icon: "map-pin",
    title: "¿Se puede retirar personalmente por el taller?",
    content: (
      <span>
        ¡Sí, por supuesto! Nuestro taller está en <strong>{ADDRESS}</strong>. Podés retirar tu pedido sin costo de lunes a viernes de 9:00 a 20:00 hs y sábados de 9:00 a 13:00 hs.
      </span>
    ),
  },
  {
    id: "materiales",
    icon: "layers",
    title: "¿Qué materiales y espesores trabajan?",
    content: (
      <span>
        Trabajamos principalmente MDF (fibrofacil) en espesores de 3mm a 18mm, melaminas de colores, multilaminado guatambú, terciados y maderas macizas como paraíso y eucalipto.
      </span>
    ),
  },
  {
    id: "pagos",
    icon: "check",
    title: "¿Cuáles son las formas de pago?",
    content: (
      <span>
        Aceptamos transferencia bancaria directa, efectivo contra retiro en taller y tarjetas de crédito/débito a través de link de pago.
      </span>
    ),
  },
];

export default function ContactoPage() {
  const waUrl = WA + encodeURIComponent("Hola Liever! Quisiera hacer una consulta.");

  return (
    <div>
      {/* Header Banner con fondo difuminado y alto contraste */}
      <section
        style={{
          position: "relative",
          background: "var(--surface-inverse)",
          color: "var(--text-inverse)",
          padding: "86px 20px 92px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Background Image with blur and darkening */}
        <Image
          src="/uploads/liever_fondo_2.jpg"
          alt="Contacto Liever Fondo"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            filter: "blur(3px) brightness(0.55)",
            transform: "scale(1.06)",
            opacity: 0.65,
          }}
        />

        {/* Dark Vignette Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, rgba(34, 29, 26, 0.65) 0%, rgba(34, 29, 26, 0.9) 100%)",
            zIndex: 1,
          }}
        />

        <div className="wrap center" style={{ padding: 0, position: "relative", zIndex: 2 }}>
          <Eyebrow tone="inverse" style={{ marginBottom: 12 }}>
            Contacto Directo
          </Eyebrow>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 700,
              margin: "0 0 16px",
              color: "var(--white)",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            Hablemos de tu proyecto
          </h1>
          <p
            style={{
              color: "rgba(255, 252, 246, 0.85)",
              fontSize: 16,
              maxWidth: 580,
              margin: "0 auto 34px",
              lineHeight: 1.6,
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            ¿Tenés una idea, medidas especiales o querés cotizar un producto? Escribinos y te asesoramos directamente desde nuestro taller.
          </p>

          <Button
            as="a"
            href={waUrl}
            target="_blank"
            variant="onDark"
            icon={<Icon name="message-circle" size={16} color="var(--white)" />}
          >
            Escribinos por WhatsApp
          </Button>
        </div>
      </section>

      {/* Info Cards Grid (4 Channels) en fondo suave alternado */}
      <section style={{ background: "var(--surface-alt)", padding: "70px 20px", borderTop: "1px solid var(--border-hairline)", borderBottom: "1px solid var(--border-hairline)" }}>
        <div className="wrap" style={{ padding: 0, maxWidth: 1160 }}>
          <div className="grid g4" style={{ gap: 20 }}>
            {/* Card 1: WhatsApp */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius)",
                padding: "32px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 12,
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(37, 211, 102, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="message-circle" size={22} color="#25D366" />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, margin: 0 }}>WhatsApp</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                Respuesta en el día para presupuestos y dudas rápidas.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--accent)",
                  fontWeight: 600,
                  marginTop: "auto",
                  textDecoration: "none",
                }}
              >
                Iniciar chat →
              </a>
            </div>

            {/* Card 2: Instagram */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius)",
                padding: "32px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 12,
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(225, 48, 108, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="instagram" size={22} color="#E1306C" />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, margin: 0 }}>Instagram</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                Fotos del taller, proyectos reales y eventos.
              </p>
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--accent)",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  @liever.sannicolas →
                </a>
                <a
                  href={INSTAGRAM_EVENTOS}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--text-muted)",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  @lievereventos →
                </a>
              </div>
            </div>

            {/* Card 3: Teléfono */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius)",
                padding: "32px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 12,
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(139, 90, 60, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="phone" size={22} color="var(--wood)" />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, margin: 0 }}>Llamadas</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                Atención directa para proyectos de carpintería y arquitectura.
              </p>
              <a
                href={`tel:${PHONE_RAW}`}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--wood)",
                  fontWeight: 600,
                  marginTop: "auto",
                  textDecoration: "none",
                }}
              >
                {PHONE}
              </a>
            </div>

            {/* Card 4: Ubicación y Horarios */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius)",
                padding: "32px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 12,
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(217, 83, 30, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="map-pin" size={22} color="var(--accent)" />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, margin: 0 }}>Taller y Retiros</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>
                {ADDRESS}
              </p>
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  {HOURS_WEEKDAY}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--text-muted)",
                    fontWeight: 500,
                    marginBottom: 6,
                  }}
                >
                  {HOURS_SAT}
                </span>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--accent)",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Ver en Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section en fondo blanco cálido */}
      <section style={{ background: "var(--surface-page)", padding: "70px 20px" }}>
        <div className="wrap wrap--narrow" style={{ padding: 0 }}>
          <SectionTitle
            eyebrow="Dudas comunes"
            title="Preguntas Frecuentes"
            size="lg"
            style={{ textAlign: "center", marginBottom: 36 }}
          />

          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-lg)",
              padding: "24px 32px",
              width: "100%",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <Accordion items={FAQ_ITEMS} allowMultiple />
          </div>
        </div>
      </section>
    </div>
  );
}
