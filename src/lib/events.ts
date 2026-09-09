import { SITE_URL } from "@/lib/seo";

export type EventStatus = "enabled" | "disabled";

export type VerifyStatus =
  | "valid"
  | "inactive"
  | "expired"
  | "exhausted"
  | "disabled"
  | "not_found";

export type VerifyReason =
  | "before_event"
  | "before_hours"
  | "after_hours"
  | "after_event";

export type VerifyResult = {
  status: VerifyStatus;
  event_prefix?: string;
  event_name?: string;
  event_date?: string;
  date_end?: string;
  open_time?: string;
  close_time?: string;
  background?: string;
  scan_count?: number;
  reason?: VerifyReason;
};

export type EventRow = {
  id: number;
  prefix: string;
  name: string;
  date_start: string;
  date_end: string;
  open_time: string;
  close_time: string;
  venue: string;
  ticket_count: number;
  status: EventStatus;
  background: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type TicketRow = {
  id: number;
  event_id: number;
  event_prefix: string;
  code: string;
  internal_id: string;
  scan_count: number;
  created_at: string;
};

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 20;

export function generateInternalId(): string {
  const bytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return code;
}

export function normalizePrefix(prefix: string): string {
  return prefix.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

export function digitCountFor(count: number): number {
  if (count <= 0) return 5;
  return Math.max(1, String(Math.floor(count)).length);
}

export function randomTicketNumber(prefix: string, digits: number): string {
  const max = Math.pow(10, digits) - 1;
  const min = Math.pow(10, digits - 1);
  const n = Math.floor(Math.random() * (max - min + 1)) + min;
  return `${prefix}-${String(n).padStart(digits, "0")}`;
}

export function isValidTicketCode(code: string): boolean {
  return /^[A-Z0-9]{1,8}-[0-9]{1,8}$/.test(code);
}

export function getTodayWIB(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function formatTimeID(timeStr: string): string {
  return timeStr.slice(0, 5);
}

export function formatDateID(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function eventScanUrl(code: string): string {
  return `${SITE_URL}/event?c=${encodeURIComponent(code)}`;
}