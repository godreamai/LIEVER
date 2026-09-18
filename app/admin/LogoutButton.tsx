"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  const onClick = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "1px solid var(--border-inverse)",
        color: "rgba(255,255,255,.65)",
        padding: "9px 10px",
        fontFamily: "var(--font-body)",
        fontSize: 13,
        borderRadius: "var(--radius)",
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      Cerrar sesión
    </button>
  );
}
