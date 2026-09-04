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

    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      !user
    ) {
      const redir = request.nextUrl.clone();
      redir.pathname = "/login";
      return NextResponse.redirect(redir);
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
