"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/track";

/** Cuenta visitas por página y clics en enlaces de WhatsApp. No muestra nada. */
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("page_view", pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("https://wa.me/")) trackEvent("whatsapp_click");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
