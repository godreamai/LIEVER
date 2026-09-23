import Link from "next/link";
import { BrandLogo } from "@/components/ui";
import { NotFoundView } from "@/components/NotFoundView";

// Rutas que no existen en ningún grupo: quedan fuera del layout del sitio, por eso lleva su propio logo.
export default function RootNotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "32px 20px 0" }}>
        <Link href="/">
          <BrandLogo height={38} />
        </Link>
      </div>
      <NotFoundView />
    </div>
  );
}
