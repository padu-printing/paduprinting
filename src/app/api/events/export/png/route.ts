import { NextRequest } from "next/server";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import { eventScanUrl, type TicketRow } from "@/lib/events";
import {
  fileNameFromCode,
  sanitizeFilePart,
  zipResponse,
} from "@/lib/serve-zip";

export const runtime = "nodejs";

const PNG_SIZE = 1000;

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

  const { data: event } = await supabase
    .from("ticket_events")
    .select("name")
    .eq("id", eventId)
    .single();
  const { data: tickets } = await supabase
    .from("tickets")
    .select("code")
    .eq("event_id", eventId)
    .order("code", { ascending: true });

  if (!tickets || tickets.length === 0) {
    return new Response("Belum ada tiket", { status: 404 });
  }

  const files: { name: string; data: Buffer }[] = [];
  for (const t of tickets as TicketRow[]) {
    const png = await QRCode.toBuffer(eventScanUrl(t.code), {
      type: "png",
      width: PNG_SIZE,
      margin: 2,
      errorCorrectionLevel: "M",
    });
    files.push({ name: `${fileNameFromCode(t.code)}.png`, data: png });
  }

  const safeName = sanitizeFilePart(event?.name ?? `event-${eventId}`);
  return zipResponse({ filename: `event-${safeName}-png`, files });
}
