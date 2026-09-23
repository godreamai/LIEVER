"use client";

import { Button } from "@/components/ds/Button";
import { StatusPage } from "@/components/StatusPage";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <StatusPage
      eyebrow="Algo salió mal"
      title="No pudimos cargar esta página."
      actions={
        <>
          <Button onClick={reset}>Reintentar</Button>
          <Button as="a" href="/" variant="secondary">
            Ir al inicio
          </Button>
        </>
      }
    >
      Fue un problema de nuestro lado. Probá de nuevo en unos segundos; si sigue pasando, escribinos por WhatsApp.
    </StatusPage>
  );
}
