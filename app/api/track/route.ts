import { createPublicClient } from "@/lib/supabase/public";

const TYPES = ["page_view", "whatsapp_click", "add_to_cart"];
const BOTS = /bot|crawl|spider|slurp|preview|lighthouse|headless|facebookexternalhit|whatsapp/i;

export async function POST(request: Request) {
  // Crawlers y vistas previas de enlaces no son visitas reales.
  if (BOTS.test(request.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });

  let body: { type?: unknown; path?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const { type, path } = body;
  if (typeof type !== "string" || !TYPES.includes(type) || typeof path !== "string" || !path.startsWith("/") || path.length > 200) {
    return new Response(null, { status: 400 });
  }

  // La base valida de nuevo (track_event); si falla, no se le informa nada al visitante.
  await createPublicClient().rpc("track_event", { p_type: type, p_path: path });
  return new Response(null, { status: 204 });
}
