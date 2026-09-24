"use client";

export type TrackType = "page_view" | "whatsapp_click" | "add_to_cart";

/**
 * Registra un evento de uso anónimo (sin cookies ni datos personales) en /api/track.
 * No hace nada en desarrollo local ni dentro del admin, para no ensuciar las estadísticas.
 */
export function trackEvent(type: TrackType, path: string = window.location.pathname) {
  try {
    if (/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) || path.startsWith("/admin")) return;
    const body = JSON.stringify({ type, path });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    else fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
  } catch {
    // las estadísticas nunca deben romper la navegación
  }
}
