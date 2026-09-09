import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Tidak terautentikasi", { status: 401 });
  }

  const eventId = Number(request.nextUrl.searchParams.get("event_id"));
  if (!Number.isInteger(eventId)) {
    return new Response("event_id tidak valid", { status: 400 });
  }

  const { data: tickets } = await supabase
    .from("tickets")
    .select("code, scan_count")
    .eq("event_id", eventId)
    .order("code", { ascending: true });
  if (!tickets) {
    return new Response("Event tidak ditemukan", { status: 404 });
  }

  const lines = ["no,kode,status"];
  tickets.forEach((t, i) => lines.push(`${i + 1},${t.code},${t.scan_count}`));
  const csv = lines.join("\r\n");

  return new Response("\uFEFF" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="event-${eventId}-tickets.csv"`,
    },
  });
}