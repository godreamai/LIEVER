import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/admin/login";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === LOGIN_PATH;

  const redirectTo = (path: string, search = "") => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = search;
    return NextResponse.redirect(url);
  };

  if (!user) return isLoginPage ? response : redirectTo(LOGIN_PATH);

  // Estar logueado no alcanza: la cuenta tiene que estar en la lista de administradores (admin_users).
  // Las policies de la base aplican la misma regla, esto solo evita mostrar un panel vacío.
  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (isAdmin) return isLoginPage ? redirectTo("/admin") : response;
  return isLoginPage ? response : redirectTo(LOGIN_PATH, "?sinpermiso=1");
}
