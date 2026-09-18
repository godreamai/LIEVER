"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ds/Card";
import { Input } from "@/components/ds/Input";
import { Button } from "@/components/ds/Button";
import { BrandLogo } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <Card style={{ padding: 32, width: "100%", maxWidth: 380 }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
        <BrandLogo height={38} />
      </div>
      <h2 style={{ fontSize: 20, margin: "0 0 6px", textAlign: "center" }}>Panel de administración</h2>
      <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", margin: "0 0 24px" }}>Ingresá con tu cuenta de LIEVER</p>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required mono={false} autoFocus />
        <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required mono={false} />
        {error && (
          <div style={{ background: "var(--status-pendiente-bg)", color: "var(--status-pendiente-fg)", padding: "10px 14px", borderRadius: "var(--radius)", fontSize: 13 }}>{error}</div>
        )}
        <Button full disabled={loading} type="submit" style={{ marginTop: 6 }}>
          {loading ? "Ingresando…" : "Ingresar"}
        </Button>
      </form>
    </Card>
  );
}
