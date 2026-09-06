import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

const MAX_LENGTHS = { visitorId: 64, path: 200, referrer: 500 };

function isBot(ua: string): boolean {
  return /bot|crawl|spider|slurp|headless|preview|facebookexternalhit|curl|wget/i.test(
    ua
  );
}

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";
  if (isBot(ua)) return new NextResponse(null, { status: 204 });

  const body = await request.json().catch(() => null);
  if (!body) return new NextResponse(null, { status: 204 });

  const visitorId =
    typeof body.visitorId === "string"
      ? body.visitorId.slice(0, MAX_LENGTHS.visitorId)
      : "";
  const path =
    typeof body.path === "string" && body.path.startsWith("/")
      ? body.path.slice(0, MAX_LENGTHS.path)
      : "/";
  const referrer =
    typeof body.referrer === "string"
      ? body.referrer.slice(0, MAX_LENGTHS.referrer)
      : "";

  if (!visitorId) return new NextResponse(null, { status: 204 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const supabase = createServerClient(url, key, {
        cookies: {
          getAll: () => [],
          setAll: () => {},
        },
      });
      await supabase
        .from("pageviews")
        .insert({ visitor_id: visitorId, path, referrer, user_agent: ua.slice(0, 300) });
    } catch {
      // Gagal mencatat = abaikan, kunjungan tetap berjalan normal.
    }
  }

  return new NextResponse(null, { status: 204 });
}