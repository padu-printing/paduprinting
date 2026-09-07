import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const googlePing = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

  try {
    await fetch(googlePing, {
      method: "GET",
      signal: AbortSignal.timeout(8000),
    });
    return NextResponse.json({ ok: true, message: "Sitemap pinged" });
  } catch {
    return NextResponse.json({ ok: false, message: "Ping failed" }, { status: 502 });
  }
}
