"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ScanLine,
  RotateCcw,
} from "lucide-react";
import { formatDateID, formatTimeID, type VerifyResult } from "@/lib/events";

type View =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "result"; result: VerifyResult; code: string };

function EventLabel({ result }: { result: VerifyResult }) {
  const { event_prefix, event_name } = result;
  if (!event_prefix && !event_name) return null;
  return (
    <div className="mt-2">
      {event_prefix && (
        <p className="font-mono text-xs font-semibold tracking-wide text-[#6B2C91]">
          {event_prefix}
        </p>
      )}
      {event_name && (
        <p className="mt-0.5 text-lg font-semibold text-neutral-800">{event_name}</p>
      )}
    </div>
  );
}

function TicketNumber({ code }: { code: string }) {
  return (
    <div className="mt-3 border-t border-dashed border-neutral-200 pt-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
        No. Tiket
      </p>
      <p className="mt-0.5 font-mono text-sm font-semibold tracking-wide text-neutral-700">
        {code}
      </p>
    </div>
  );
}

function EventMeta({ result }: { result: VerifyResult }) {
  const { event_date, date_end, open_time, close_time } = result;
  return (
    <>
      {event_date && (
        <p className="mt-1 text-sm text-neutral-500">
          {date_end && date_end !== event_date
            ? `${formatDateID(event_date)} – ${formatDateID(date_end)}`
            : formatDateID(event_date)}
        </p>
      )}
      {open_time && close_time && (
        <p className="text-xs text-neutral-400">
          {formatTimeID(open_time)}–{formatTimeID(close_time)} WIB
        </p>
      )}
    </>
  );
}

function ResultView({ view }: { view: Extract<View, { kind: "result" }> }) {
  const { result, code } = view;
  const { status, scan_count } = result;

  if (status === "valid") {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" />
        <p className="mt-4 text-3xl font-extrabold tracking-wide text-emerald-600">
          VALID
        </p>
        <EventLabel result={result} />
        <EventMeta result={result} />
        <p className="mt-4 text-sm font-medium text-neutral-600">
          Scan ke-{scan_count ?? 1} dari 3
        </p>
        <div className="mt-4 rounded-xl border-2 border-emerald-500 bg-emerald-50 px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Nomor ID
          </p>
          <p className="mt-1 font-mono text-2xl font-extrabold tracking-wide text-emerald-700">
            {code}
          </p>
        </div>
      </div>
    );
  }

  if (status === "inactive") {
    const { event_date, date_end, open_time, close_time, reason } = result;
    return (
      <div className="text-center">
        <Clock className="mx-auto h-16 w-16 text-amber-500" />
        <p className="mt-4 text-2xl font-extrabold tracking-wide text-amber-600">
          TIKET BELUM AKTIF
        </p>
        <EventLabel result={result} />
        {reason === "before_hours" && open_time && close_time ? (
          <p className="mt-2 text-sm text-neutral-500">
            Belum dibuka — buka pukul {formatTimeID(open_time)}–{formatTimeID(close_time)} WIB
          </p>
        ) : event_date ? (
          <p className="mt-2 text-sm text-neutral-500">
            Berlaku pada {formatDateID(event_date)}
            {date_end && date_end !== event_date ? ` – ${formatDateID(date_end)}` : ""}
          </p>
        ) : null}
        <TicketNumber code={code} />
      </div>
    );
  }

  if (status === "expired") {
    const { open_time, close_time, reason } = result;
    return (
      <div className="text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
        <p className="mt-4 text-2xl font-extrabold tracking-wide text-red-600">
          TIKET KADALUARSA
        </p>
        <EventLabel result={result} />
        {reason === "after_hours" && open_time && close_time ? (
          <p className="mt-2 text-sm text-neutral-500">
            Di luar jam layanan hari ini ({formatTimeID(open_time)}–{formatTimeID(close_time)} WIB)
          </p>
        ) : (
          <p className="mt-2 text-sm text-neutral-500">Event telah selesai.</p>
        )}
        <TicketNumber code={code} />
      </div>
    );
  }

  if (status === "exhausted") {
    return (
      <div className="text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
        <p className="mt-4 text-2xl font-extrabold tracking-wide text-red-600">
          TIKET SUDAH DIGUNAKAN
        </p>
        <EventLabel result={result} />
        <p className="mt-2 text-sm text-neutral-500">
          Batas maksimal 3x scan telah tercapai.
        </p>
        <TicketNumber code={code} />
      </div>
    );
  }

  return (
    <div className="text-center">
      <XCircle className="mx-auto h-16 w-16 text-neutral-400" />
      <p className="mt-4 text-xl font-bold text-neutral-700">
        Tiket tidak aktif
      </p>
      <p className="mt-2 text-sm text-neutral-500">
        Kode tidak dikenal atau event sedang ditutup.
      </p>
    </div>
  );
}

export default function EventScanClient() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("c") ?? "";
  const [code, setCode] = useState(initialCode);
  const [view, setView] = useState<View>({ kind: "loading" });
  const [background, setBackground] = useState("");

  const verify = useCallback(async (value: string) => {
    const cleaned = value.toUpperCase().replace(/\s+/g, "");
    if (!cleaned) {
      setView({ kind: "result", result: { status: "not_found" }, code: cleaned });
      return;
    }
    setView({ kind: "loading" });
    try {
      const res = await fetch(`/api/events/verify?code=${encodeURIComponent(cleaned)}`);
      if (!res.ok) {
        setView({ kind: "error" });
        return;
      }
      const data = (await res.json()) as VerifyResult;
      setBackground(data.background ?? "");
      setView({ kind: "result", result: data, code: cleaned });
    } catch {
      setView({ kind: "error" });
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      verify(initialCode);
    }, 0);
    return () => clearTimeout(t);
  }, [initialCode, verify]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    verify(code);
  }

  const isSuccess = view.kind === "result" && view.result.status === "valid";

  function handleNext() {
    setView({ kind: "result", result: { status: "not_found" }, code: "" });
    setCode("");
  }

  return (
    <section
      className="relative flex min-h-[100svh] w-full flex-col items-center overflow-hidden px-4 py-10"
      style={
        background
          ? {
              backgroundImage: `url(${background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }
          : undefined
      }
    >
      {background && (
        <div className="pointer-events-none absolute inset-0 bg-black/40" />
      )}

      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="flex w-full items-center justify-center gap-2 text-white drop-shadow">
          <ScanLine className="h-6 w-6" />
          <p className="text-lg font-bold">Verifikasi Tiket</p>
        </div>

        <div
          className={`mt-6 w-full max-w-md rounded-2xl border p-8 shadow-sm ${
            background
              ? "border-white/30 bg-white/95"
              : "border-neutral-200 bg-white"
          }`}
        >
          {view.kind === "loading" && (
            <p className="text-center text-sm text-neutral-500">Memverifikasi...</p>
          )}
          {view.kind === "error" && (
            <p className="text-center text-sm text-neutral-500">
              Tidak dapat memverifikasi saat ini.
            </p>
          )}
          {view.kind === "result" && <ResultView view={view} />}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-md gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Masukkan kode manual"
            className={`min-w-0 flex-1 rounded-lg border px-4 py-2 text-sm uppercase outline-none focus:border-[#6B2C91] focus:ring-2 focus:ring-[#6B2C91]/20 ${
              background ? "border-white/40 bg-white/95" : "border-neutral-300 bg-white"
            }`}
          />
          <button
            type="submit"
            className="rounded-lg bg-[#6B2C91] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5A2478]"
          >
            Cek
          </button>
        </form>
      </div>

      {isSuccess && view.kind === "result" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <CheckCircle2 className="mx-auto h-20 w-20 text-emerald-500" />
            <p className="mt-4 text-4xl font-extrabold tracking-wide text-emerald-600">
              SUKSES
            </p>
            <div className="mt-6 rounded-2xl border-2 border-emerald-500 bg-emerald-50 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Nomor ID
              </p>
              <p className="mt-1 font-mono text-3xl font-extrabold tracking-wide text-emerald-700">
                {view.code || "-"}
              </p>
            </div>
            {view.result.event_name && (
              <p className="mt-4 text-lg font-semibold text-neutral-800">
                {view.result.event_name}
              </p>
            )}
            <button
              onClick={handleNext}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B2C91] px-6 py-3 text-base font-bold text-white hover:bg-[#5A2478]"
            >
              <RotateCcw className="h-5 w-5" /> Scan Berikutnya
            </button>
          </div>
        </div>
      )}
    </section>
  );
}