"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { Input } from "@/components/ds/Input";
import { WA } from "@/lib/data";
import { SOLUTIONS } from "@/lib/solutions";

const MOTIVOS = [...SOLUTIONS.map((s) => ({ value: s.slug, label: s.title })), { value: "otro", label: "Otro / no estoy seguro" }];

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: 12,
  color: "var(--text-muted)",
  marginBottom: 6,
};

const controlStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  border: "1px solid var(--border-input)",
  borderRadius: "var(--radius)",
  background: "var(--surface-card)",
  fontFamily: "var(--font-body)",
  fontSize: 14,
  color: "var(--text-body)",
  outline: "none",
};

function ContactFormInner() {
  const searchParams = useSearchParams();
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [motivo, setMotivo] = useState(searchParams.get("motivo") || "");
  const [medidas, setMedidas] = useState("");
  const [mensaje, setMensaje] = useState("");

  const motivoLabel = MOTIVOS.find((m) => m.value === motivo)?.label;
  const lines = [
    "Hola Liever! Quiero cotizar un proyecto.",
    nombre && `Nombre: ${nombre}`,
    contacto && `Contacto: ${contacto}`,
    motivoLabel && `Necesidad: ${motivoLabel}`,
    medidas && `Medidas aproximadas: ${medidas}`,
    mensaje && `Detalle: ${mensaje}`,
  ].filter(Boolean);
  const href = WA + encodeURIComponent(lines.join("\n"));
  const canSend = nombre.trim() !== "" && contacto.trim() !== "";

  return (
    <div style={{ display: "grid", gap: 18, width: "100%", maxWidth: 520 }}>
      <Input label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} mono={false} placeholder="¿Cómo te llamás?" />
      <Input label="Teléfono o email" value={contacto} onChange={(e) => setContacto(e.target.value)} mono={false} placeholder="Para poder responderte" />

      <label style={{ display: "block" }}>
        <span style={fieldLabelStyle}>¿Qué necesitás?</span>
        <select value={motivo} onChange={(e) => setMotivo(e.target.value)} style={{ ...controlStyle, cursor: "pointer" }}>
          <option value="">Elegí una opción</option>
          {MOTIVOS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </label>

      <Input
        label="Medidas aproximadas (opcional)"
        value={medidas}
        onChange={(e) => setMedidas(e.target.value)}
        mono={false}
        placeholder="Ancho × alto × espesor"
      />

      <label style={{ display: "block" }}>
        <span style={fieldLabelStyle}>Contanos tu proyecto</span>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={4}
          placeholder="Describí tu espacio, tu idea o el producto que buscás"
          style={{ ...controlStyle, resize: "vertical", fontFamily: "var(--font-body)" }}
        />
      </label>

      <Button
        as="a"
        href={canSend ? href : undefined}
        target="_blank"
        icon={<Icon name="message-circle" size={16} color="var(--white)" />}
        style={canSend ? undefined : { opacity: 0.5, pointerEvents: "none" }}
        aria-disabled={!canSend}
      >
        Cotizar proyecto por WhatsApp
      </Button>
      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
        Al enviar se abre WhatsApp con tus datos precargados. Ahí mismo podés adjuntar fotos, medidas o archivos de referencia.
      </p>
    </div>
  );
}

export function ContactForm() {
  return (
    <Suspense fallback={null}>
      <ContactFormInner />
    </Suspense>
  );
}
