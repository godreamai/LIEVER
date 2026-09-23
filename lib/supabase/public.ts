import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente anónimo sin cookies para leer el catálogo público. `createClient()` de
// server.ts lee `cookies()`, lo que vuelve dinámica (sin caché) cada página que lo usa.
export function createPublicClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
