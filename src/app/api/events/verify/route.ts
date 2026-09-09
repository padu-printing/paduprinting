import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidTicketCode, type VerifyResult } from "@/lib/events";

export const runtime = "nodejs";

const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : "unknown").trim() || "unknown";
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cur = hits.get(ip);
  if (!cur || now >= cur.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  cur.count += 1;
  return cur.count > RATE_LIMIT;
}

export async function GET(request: NextRequest) {
  const code = (request.nextUrl.searchParams.get("code") ?? "")
    .toUpperCase()
    .trim();

  if (!isValidTicketCode(code)) {
    return NextResponse.json({ status: "not_found" });
  }

  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi nanti." },
      { status: 429 }
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("verify_ticket", {
      p_code: code,
      p_now: new Date().toISOString(),
    });
    if (error) {
      return NextResponse.json({ status: "not_found" }, { status: 500 });
    }
    return NextResponse.json(data as VerifyResult);
  } catch {
    return NextResponse.json({ status: "not_found" }, { status: 500 });
  }
}