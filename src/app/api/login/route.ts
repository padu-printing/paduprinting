import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

export const runtime = "nodejs";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

// Rate limiter sederhana per-instance (umum untuk anti brute-force dasar).
// Resetting antar cold start; untuk produksi penuh gunakan store terpusat.
const attempts = new Map<string, { count: number; resetAt: number }>();

function getIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email dan password wajib diisi." },
      { status: 400 }
    );
  }

  const key = `${getIp(request)}:${email}`;
  const now = Date.now();
  const entry = attempts.get(key);

  if (entry && entry.resetAt > now && entry.count >= RATE_LIMIT) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi beberapa saat lagi." },
      { status: 429 }
    );
  }
  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
  } else {
    entry.count += 1;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.json(
      { error: "Konfigurasi server tidak lengkap." },
      { status: 500 }
    );
  }

  const cookiesToApply: { name: string; value: string; options?: CookieOptions }[] = [];
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach((c) => cookiesToApply.push(c));
      },
    },
  });

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json(
      { error: "Email atau password salah." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  cookiesToApply.forEach((c) => response.cookies.set(c.name, c.value, c.options));
  return response;
}