import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// `middleware.ts` está deprecado en Next.js 16 y renombrado a `proxy.ts`
// (mismo comportamiento, solo cambia el nombre del archivo y de la función).
export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/panel-de-administrador/:path*", "/admin/login"],
};
