import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https: wss:; worker-src 'self' blob:; frame-src https://www.google.com https://www.google.co.id; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
};

function withSecurityHeaders(response: NextResponse) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return withSecurityHeaders(supabaseResponse);
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
        return withSecurityHeaders(NextResponse.redirect(redir));
      }

      // Orang asing yang belum pernah login: sembunyikan /admin dengan 404.
      return withSecurityHeaders(
        NextResponse.rewrite(new URL("/_not-found", request.url), {
          status: 404,
        })
      );
    }

    if (request.nextUrl.pathname === "/login" && user) {
      const redir = request.nextUrl.clone();
      redir.pathname = "/admin";
      return withSecurityHeaders(NextResponse.redirect(redir));
    }
  } catch {
    // Jika Supabase gagal, /admin dikunci (fail-closed), halaman lain tetap jalan.
    if (request.nextUrl.pathname.startsWith("/admin")) {
      return withSecurityHeaders(
        NextResponse.rewrite(new URL("/_not-found", request.url), {
          status: 404,
        })
      );
    }
  }

  return withSecurityHeaders(supabaseResponse);
}
