"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Download,
  FileText,
  QrCode,
  Power,
  PowerOff,
  Upload,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { EventRow, EventStatus } from "@/lib/events";
import { formatDateID, formatTimeID, normalizePrefix } from "@/lib/events";
import {
  AdminHeader,
  Badge,
  Button,
  ConfirmDialog,
  Field,
  SelectInput,
  Table,
  TextArea,
  TextInput,
} from "../components/ui";

interface EventForm {
  prefix: string;
  name: string;
  date_start: string;
  date_end: string;
  open_time: string;
  close_time: string;
  venue: string;
  ticket_count: number;
  notes: string;
}

const emptyForm: EventForm = {
  prefix: "",
  name: "",
  date_start: "",
  date_end: "",
  open_time: "00:00",
  close_time: "23:59",
  venue: "",
  ticket_count: 0,
  notes: "",
};

function StatusBadge({ status }: { status: EventStatus }) {
  return status === "enabled" ? (
    <Badge>AKTIF</Badge>
  ) : (
    <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-600">
      NONAKTIF
    </span>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-[#1A2340]">{value}</p>
    </div>
  );
}

export default function AdminEvents() {
  const [items, setItems] = useState<EventRow[]>([]);
  const [countMap, setCountMap] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [generateFor, setGenerateFor] = useState<EventRow | null>(null);
  const [genCount, setGenCount] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [bgUrl, setBgUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function load() {
    const supabase = createClient();
    const [{ data: events }, { data: tickets }] = await Promise.all([
      supabase.from("ticket_events").select("*").order("created_at", { ascending: false }),
      supabase.from("tickets").select("event_id"),
    ]);
    if (!events) {
      setLoading(false);
      return;
    }
    setItems(events as EventRow[]);
    const map: Record<number, number> = {};
    (tickets ?? []).forEach((t) => {
      map[t.event_id as number] = (map[t.event_id as number] ?? 0) + 1;
    });
    setCountMap(map);
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setSaveError("");
    setBgUrl("");
    setUploadError("");
    setShowForm(true);
  }

  function startEdit(e: EventRow) {
    setForm({
      prefix: e.prefix,
      name: e.name,
      date_start: e.date_start,
      date_end: e.date_end,
      open_time: e.open_time.slice(0, 5),
      close_time: e.close_time.slice(0, 5),
      venue: e.venue,
      ticket_count: e.ticket_count,
      notes: e.notes,
    });
    setBgUrl(e.background ?? "");
    setEditingId(e.id);
    setSaveError("");
    setUploadError("");
    setShowForm(true);
  }

  async function uploadFile(file: File): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal upload gambar");
    return data.url as string;
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/webp") {
      setUploadError("Hanya format WebP yang diizinkan.");
      e.target.value = "";
      return;
    }
    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setBgUrl(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Gagal upload gambar");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    setSaving(true);
    setSaveError("");
    const supabase = createClient();
    const payload = {
      prefix: normalizePrefix(form.prefix),
      name: form.name,
      date_start: form.date_start,
      date_end: form.date_end,
      open_time: form.open_time,
      close_time: form.close_time,
      venue: form.venue,
      ticket_count: Number(form.ticket_count),
      notes: form.notes,
      background: bgUrl,
    };
    if (!payload.prefix) {
      setSaving(false);
      setSaveError("Kode event (prefix) wajib diisi, mis. BFV.");
      return;
    }
    if (!payload.date_start || !payload.date_end) {
      setSaving(false);
      setSaveError("Tanggal mulai & tanggal selesai wajib diisi.");
      return;
    }
    if (payload.date_end < payload.date_start) {
      setSaving(false);
      setSaveError("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }
    if (payload.close_time <= payload.open_time) {
      setSaving(false);
      setSaveError("Jam tutup harus setelah jam buka.");
      return;
    }
    const { error } = editingId
      ? await supabase.from("ticket_events").update(payload).eq("id", editingId)
      : await supabase.from("ticket_events").insert(payload);
    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setShowForm(false);
    load();
  }

  async function toggleStatus(e: EventRow) {
    setTogglingId(e.id);
    const supabase = createClient();
    await supabase
      .from("ticket_events")
      .update({ status: e.status === "enabled" ? "disabled" : "enabled" })
      .eq("id", e.id);
    setTogglingId(null);
    load();
  }

  async function handleGenerate(ev: FormEvent) {
    ev.preventDefault();
    if (!generateFor) return;
    setGenerating(true);
    setGenMsg("");
    try {
      const res = await fetch("/api/events/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: generateFor.id, count: Number(genCount) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenMsg(data.error ?? "Gagal generate");
      } else {
        setGenMsg(`${data.generated} barcode berhasil dibuat.`);
        load();
      }
    } catch {
      setGenMsg("Gagal generate");
    }
    setGenerating(false);
  }

  async function handleDeleteConfirmed() {
    if (confirmDeleteId === null) return;
    setDeleting(true);
    setDeleteError("");
    const supabase = createClient();
    const { error } = await supabase
      .from("ticket_events")
      .delete()
      .eq("id", confirmDeleteId);
    setDeleting(false);
    if (error) {
      setDeleteError(error.message);
      return;
    }
    setConfirmDeleteId(null);
    load();
  }

  if (loading) return <p className="text-sm text-neutral-500">Memuat...</p>;

  return (
    <div>
      <AdminHeader
        title="Event"
        description="Kelola event & barcode tiket. Kopi kode hanya dari halaman ini."
        action={
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4" /> Tambah Event
          </Button>
        }
      />

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
          Belum ada event. Klik “Tambah Event” untuk membuat grup barcode.
        </div>
      ) : (
        <Table headers={["Event", "Tanggal", "Barcode", "Aksi"]}>
          {items.map((e) => (
            <tr key={e.id} className="hover:bg-neutral-50">
              <td className="max-w-xs px-5 py-3">
                <p className="font-mono text-xs font-semibold text-[#6B2C91]">{e.prefix}</p>
                <p className="font-semibold text-[#1A2340]">{e.name}</p>
                {e.venue && <p className="mt-0.5 text-xs text-neutral-400">{e.venue}</p>}
                <div className="mt-1.5 flex items-center gap-2">
                  <StatusBadge status={e.status} />
                </div>
              </td>
              <td className="px-5 py-3 text-neutral-500">
                {formatDateID(e.date_start)}
                {e.date_end !== e.date_start ? ` – ${formatDateID(e.date_end)}` : ""}
                <p className="mt-0.5 text-xs text-neutral-400">
                  {formatTimeID(e.open_time)}–{formatTimeID(e.close_time)} WIB
                </p>
              </td>
              <td className="px-5 py-3 text-neutral-500">
                {countMap[e.id] ?? 0} dari {e.ticket_count}
              </td>
              <td className="px-5 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="ghost" onClick={() => toggleStatus(e)} disabled={togglingId === e.id}>
                    {e.status === "enabled" ? (
                      <>
                        <PowerOff className="h-4 w-4" /> Nonaktifkan
                      </>
                    ) : (
                      <>
                        <Power className="h-4 w-4 text-emerald-600" /> Aktifkan
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => {
                      const already = countMap[e.id] ?? 0;
                      const remaining = Math.max(e.ticket_count - already, 0);
                      setGenCount(remaining || 10);
                      setGenerateFor(e);
                    }}>
                    <QrCode className="h-4 w-4" /> Generate
                  </Button>
                  <a
                    href={`/api/events/export/csv?event_id=${e.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4" /> CSV
                  </a>
                  <a
                    href={`/api/events/export/png?event_id=${e.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4" /> PNG
                  </a>
                  <a
                    href={`/api/events/export/pdf?event_id=${e.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4" /> PDF
                  </a>
                  <button
                    onClick={() => startEdit(e)}
                    className="text-neutral-500 hover:text-[#6B2C91]"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(e.id)}
                    className="text-neutral-500 hover:text-red-600"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat
          label="Total Event"
          value={
            <span className="flex items-center gap-1.5">
              {items.length}
              <span className="text-xs font-normal text-neutral-400">
                ({items.filter((e) => e.status === "enabled").length} aktif)
              </span>
            </span>
          }
        />
        <Stat
          label="Total Barcode"
          value={Object.values(countMap).reduce((a, b) => a + b, 0)}
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="text-lg font-bold text-[#1A2340]">
              {editingId ? "Edit Event" : "Tambah Event"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Field label="Kode Event" hint="Singkatan unik event, mis. BFV untuk Boom Fest. Dipakai jadi awalan nomor tiket (BFV-90977).">
                <TextInput value={form.prefix} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, prefix: e.target.value.toUpperCase() })} required placeholder="BFV" />
              </Field>
              <Field label="Nama Event">
                <TextInput value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} required />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Tanggal Mulai Event">
                  <TextInput type="date" value={form.date_start} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, date_start: e.target.value })} required />
                </Field>
                <Field label="Tanggal Selesai Event">
                  <TextInput type="date" value={form.date_end} min={form.date_start || undefined} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, date_end: e.target.value })} required />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Jam Buka Barcode" hint="Scan VALID mulai jam ini (WIB)">
                  <TextInput type="time" value={form.open_time} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, open_time: e.target.value })} required />
                </Field>
                <Field label="Jam Tutup Barcode" hint="Setelah jam ini tampil KADALUARSA (WIB)">
                  <TextInput type="time" value={form.close_time} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, close_time: e.target.value })} required />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Jumlah Tiket">
                  <TextInput type="number" min={0} value={form.ticket_count} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, ticket_count: Number(e.target.value) })} />
                </Field>
                <Field label="Venue">
                  <TextInput value={form.venue} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, venue: e.target.value })} />
                </Field>
              </div>
              <Field
                label="Background Halaman Scan"
                hint="Gambar WebP yang tampil di halaman hasil scan. Isi dengan upload atau kosongkan untuk latar polos."
              >
                {bgUrl ? (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bgUrl}
                      alt="Pratinjau background"
                      className="h-36 w-full rounded-lg object-cover sm:w-64"
                    />
                    <button
                      type="button"
                      onClick={() => setBgUrl("")}
                      className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                      title="Hapus background"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:border-[#6B2C91]">
                    <Upload className="mb-1 h-5 w-5 text-neutral-400" />
                    <span className="text-sm text-neutral-500">
                      {uploading ? "Mengunggah..." : "Klik untuk upload (WebP)"}
                    </span>
                    <input
                      type="file"
                      accept="image/webp,.webp"
                      onChange={handleUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                )}
                {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
              </Field>
              <Field label="Catatan">
                <TextArea rows={2} value={form.notes} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, notes: e.target.value })} />
              </Field>
              {saveError && <p className="text-sm text-red-600">{saveError}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {generateFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">
            <h2 className="text-lg font-bold text-[#1A2340]">Generate Barcode</h2>
            <p className="mt-2 text-sm text-neutral-500">
              {generateFor.name}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Target: {generateFor.ticket_count} tiket | Sudah ada: {countMap[generateFor.id] ?? 0}
            </p>
            <form onSubmit={handleGenerate} className="mt-4 space-y-4">
              <Field label="Jumlah barcode">
                <SelectInput value={genCount} onChange={(e: ChangeEvent<HTMLSelectElement>) => setGenCount(Number(e.target.value))}>
                  {[genCount, 10, 50, 100, 250, 500, 1000]
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                </SelectInput>
              </Field>
              {genMsg && <p className="text-sm text-neutral-600">{genMsg}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => { setGenerateFor(null); setGenMsg(""); }}>
                  Batal
                </Button>
                <Button type="submit" disabled={generating}>
                  {generating ? "Membuat..." : "Generate"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Hapus Event?"
        message={deleteError ? `Gagal menghapus: ${deleteError}` : "Event dan semua barcode-nya akan dihapus permanen dan tidak dapat dibatalkan."}
        loading={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => { setConfirmDeleteId(null); setDeleteError(""); }}
      />
    </div>
  );
}