import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  digitCountFor,
  generateInternalId,
  randomTicketNumber,
  type TicketRow,
} from "@/lib/events";

export const runtime = "nodejs";

const MAX_BATCH = 5000;
const CHUNK_SIZE = 500;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const eventId = Number(body?.event_id);
  const count = Math.max(1, Math.min(Number(body?.count) || 1, MAX_BATCH));
  if (!Number.isInteger(eventId)) {
    return NextResponse.json({ error: "event_id tidak valid" }, { status: 400 });
  }

  const { data: event, error: evErr } = await supabase
    .from("ticket_events")
    .select("id, prefix, ticket_count")
    .eq("id", eventId)
    .single();
  if (evErr || !event) {
    return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
  }

  const prefix = event.prefix as string;
  const digits = digitCountFor(Number(event.ticket_count) || count);

  const existing = await supabase
    .from("tickets")
    .select("code")
    .eq("event_id", eventId);
  const used = new Set(
    ((existing.data as Pick<TicketRow, "code">[] | null) ?? []).map((t) => t.code)
  );

  const rows: { event_id: number; event_prefix: string; code: string; internal_id: string }[] = [];
  let guard = 0;
  while (rows.length < count && guard < count * 20) {
    guard++;
    const code = randomTicketNumber(prefix, digits);
    if (used.has(code)) continue;
    used.add(code);
    rows.push({ event_id: eventId, event_prefix: prefix, code, internal_id: generateInternalId() });
  }

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Tidak bisa membuat nomor unik baru. Periksa jumlah tiket & kapasitas digit." },
      { status: 400 }
    );
  }

  let inserted = 0;
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const { error } = await supabase
      .from("tickets")
      .insert(rows.slice(i, i + CHUNK_SIZE));
    if (error) {
      return NextResponse.json({ error: error.message, inserted }, { status: 500 });
    }
    inserted += rows.length < i + CHUNK_SIZE ? rows.length - i : CHUNK_SIZE;
  }

  return NextResponse.json({ generated: inserted });
}
