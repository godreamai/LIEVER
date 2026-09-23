import { Button } from "@/components/ds/Button";
import { StatusPage } from "./StatusPage";

export function NotFoundView() {
  return (
    <StatusPage
      eyebrow="Error 404"
      title="No encontramos lo que buscabas."
      actions={
        <>
          <Button as="a" href="/productos?categoria=todos">
            Ver el catálogo
          </Button>
          <Button as="a" href="/" variant="secondary">
            Ir al inicio
          </Button>
        </>
      }
    >
      Puede que el enlace haya cambiado o que el producto ya no esté disponible. Mirá el catálogo o volvé al inicio.
    </StatusPage>
  );
}
