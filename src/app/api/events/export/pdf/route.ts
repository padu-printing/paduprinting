import { NextRequest } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import { eventScanUrl, type TicketRow } from "@/lib/events";
import {
  fileNameFromCode,
  sanitizeFilePart,
  zipResponse,
} from "@/lib/serve-zip";

export const runtime = "nodejs";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const QR_SIZE = 360;
const code_y = 90;

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
    const doc = await PDFDocument.create();
    const page = doc.addPage([PAGE_W, PAGE_H]);
    const f = await doc.embedFont(StandardFonts.Helvetica);

    const png = await QRCode.toBuffer(eventScanUrl(t.code), {
      type: "png",
      width: QR_SIZE * 4,
      margin: 1,
      errorCorrectionLevel: "M",
    });
    const img = await doc.embedPng(png);
    const x = (PAGE_W - QR_SIZE) / 2;
    const y = (PAGE_H - QR_SIZE) / 2 + 20;
    page.drawImage(img, { x, y, width: QR_SIZE, height: QR_SIZE });

    const codeText = t.code;
    const size = 14;
    const textWidth = f.widthOfTextAtSize(codeText, size);
    page.drawText(codeText, {
      x: (PAGE_W - textWidth) / 2,
      y: code_y,
      size,
      font: f,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await doc.save();
    files.push({
      name: `${fileNameFromCode(t.code)}.pdf`,
      data: Buffer.from(pdfBytes),
    });
  }
  const safeName = sanitizeFilePart(event?.name ?? `event-${eventId}`);
  return zipResponse({ filename: `event-${safeName}-pdf`, files });
}
