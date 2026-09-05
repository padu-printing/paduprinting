import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

    if (isAdminPath && !user) {
      const pernahLogin = request.cookies
        .getAll()
        .some((c) => /^sb-.+-auth-token$/.test(c.name));

      if (pernahLogin) {
        // Punya sesi sebelumnya, tapi sudah tidak valid, arahkan ke login.
        const redir = request.nextUrl.clone();
        redir.pathname = "/login";
        return NextResponse.redirect(redir);
      }

      // Orang asing yang belum pernah login: sembunyikan /admin dengan 404.
      return NextResponse.rewrite(new URL("/_not-found", request.url), {
        status: 404,
      });
    }

    if (request.nextUrl.pathname === "/login" && user) {
      const redir = request.nextUrl.clone();
      redir.pathname = "/admin";
      return NextResponse.redirect(redir);
    }
  } catch {
    // If Supabase fails, still allow the request through
  }

  return supabaseResponse;
}
