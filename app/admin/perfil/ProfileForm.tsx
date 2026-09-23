"use client";

import React, { useState } from "react";
import { Card } from "@/components/ds/Card";
import { Input } from "@/components/ds/Input";
import { Button } from "@/components/ds/Button";
import { createClient } from "@/lib/supabase/client";

const hintStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: 12,
  color: "var(--text-muted)",
  marginTop: 6,
};

export function ProfileForm({ email, fullName }: { email: string; fullName: string }) {
  const [name, setName] = useState(fullName);
  const [newEmail, setNewEmail] = useState(email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password && password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password && password.length < 6) {
      setError("La contraseña tiene que tener al menos 6 caracteres.");
      return;
    }

    const updates: { email?: string; password?: string; data?: { full_name: string } } = {
      data: { full_name: name.trim() },
    };
    const emailChanged = newEmail.trim() !== email;
    if (emailChanged) updates.email = newEmail.trim();
    if (password) updates.password = password;

    setSaving(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser(updates);
    setSaving(false);

    if (updateError) {
      setError(updateError.message || "No se pudieron guardar los cambios.");
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setSuccess(
      emailChanged
        ? "Datos guardados. Te enviamos un mail a la nueva dirección para confirmar el cambio de email."
        : "Datos guardados correctamente."
    );
  };

  return (
    <Card style={{ padding: 24, maxWidth: 480 }}>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" mono={false} />

        <div>
          <Input label="Email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} mono={false} />
          <span style={hintStyle}>Si lo cambiás, te va a llegar un mail de confirmación a la nueva dirección.</span>
        </div>

        <div style={{ borderTop: "1px solid var(--border-divider)", paddingTop: 16, marginTop: 4 }}>
          <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-technical)", marginBottom: 12 }}>
            Cambiar contraseña
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input label="Nueva contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Dejalo vacío para no cambiarla" mono={false} />
            <Input label="Confirmar nueva contraseña" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} mono={false} />
          </div>
        </div>

        {error && (
          <div style={{ background: "var(--status-pendiente-bg)", color: "var(--status-pendiente-fg)", padding: "10px 14px", borderRadius: "var(--radius)", fontSize: 13 }}>{error}</div>
        )}
        {success && (
          <div style={{ background: "var(--status-enviado-bg)", color: "var(--status-enviado-fg)", padding: "10px 14px", borderRadius: "var(--radius)", fontSize: 13 }}>{success}</div>
        )}

        <Button disabled={saving} type="submit" style={{ alignSelf: "flex-start" }}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </Button>
      </form>
    </Card>
  );
}
