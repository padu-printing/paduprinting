import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { IDLE_TIMEOUT_MS, KNOWN_USER_COOKIE, KNOWN_USER_COOKIE_MAX_AGE, LAST_ACTIVE_COOKIE } from "@/lib/session";

// Cookie penanda aktivitas dibuat tahan lama (7 hari) supaya selisih waktu
// aktivitas tetap terdeteksi meski browser dibuka lagi setelah lama tertutup.
const LAST_ACTIVE_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

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
      const userDikenal = request.cookies.get(KNOWN_USER_COOKIE)?.value === "1";

      // Pengguna yang sebelumnya pernah login (atau sesinya sudah tidak valid):
      // arahkan ke /login dengan notifikasi "sesi berakhir", bukan 404.
      if (pernahLogin || userDikenal) {
        const redir = request.nextUrl.clone();
        redir.pathname = "/login";
        redir.searchParams.set("expired", "1");
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

    if (isAdminPath && user) {
      const now = Date.now();

      // Sumber aktivitas: cookie penanda terakhir kali kita lihat, dan
      // last_sign_in_at dari Supabase (server-side, jadi retroaktif walau
      // cookie penanda belum pernah dibuat).
      const cookieLast = Number(request.cookies.get(LAST_ACTIVE_COOKIE)?.value) || 0;
      const signedAt = user.last_sign_in_at
        ? new Date(user.last_sign_in_at).getTime()
        : 0;
      const lastActive = Math.max(cookieLast, signedAt);

      // Sesi terlalu lama tidak digunakan (idle > timeout) -> putuskan sesi
      // di sisi server (revoke refresh token) lalu arahkan ke /login.
      if (lastActive > 0 && now - lastActive >= IDLE_TIMEOUT_MS) {
        await supabase.auth.signOut().catch(() => null);

        const logoutUrl = request.nextUrl.clone();
        logoutUrl.pathname = "/login";
        logoutUrl.searchParams.set("expired", "1");
        const logoutResponse = withSecurityHeaders(
          NextResponse.redirect(logoutUrl)
        );

        for (const c of request.cookies.getAll()) {
          if (c.name.startsWith("sb-") || c.name === LAST_ACTIVE_COOKIE) {
            logoutResponse.cookies.set(c.name, "", { maxAge: 0, path: "/" });
          }
        }
        return logoutResponse;
      }

      // Aktif: perbarui penanda aktivitas supaya timeout dihitung ulang,
      // dan tandai pengguna sebagai "pernah login" untuk kasus sesi berakhir.
      request.cookies.set(LAST_ACTIVE_COOKIE, String(now));
      supabaseResponse = NextResponse.next({ request });
      supabaseResponse.cookies.set(LAST_ACTIVE_COOKIE, String(now), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: request.nextUrl.protocol === "https:",
        maxAge: LAST_ACTIVE_COOKIE_MAX_AGE,
      });
      supabaseResponse.cookies.set(KNOWN_USER_COOKIE, "1", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: request.nextUrl.protocol === "https:",
        maxAge: KNOWN_USER_COOKIE_MAX_AGE,
      });
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
