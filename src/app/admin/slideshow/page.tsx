"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X, Upload, ArrowUp, ArrowDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AdminHeader,
  Button,
  Field,
  TextInput,
} from "../components/ui";

interface HeroSlide {
  id: number;
  image: string;
  alt: string;
  link: string;
  sort_order: number;
}

const emptyForm = {
  image: "",
  alt: "",
  link: "",
};

export default function AdminSlideshow() {
  const [items, setItems] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
    if (!error) setItems(data as HeroSlide[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setUploadError("");
    setError("");
  }

  function startEdit(s: HeroSlide) {
    setForm({
      image: s.image,
      alt: s.alt,
      link: s.link,
    });
    setEditingId(s.id);
    setShowForm(true);
    setUploadError("");
    setError("");
  }

  async function moveSlide(id: number, dir: -1 | 1) {
    const index = items.findIndex((i) => i.id === id);
    const target = index + dir;
    if (index < 0 || target < 0 || target >= items.length) return;
    const next = [...items];
    const a = next[index];
    const b = next[target];
    next[index] = { ...b, sort_order: a.sort_order };
    next[target] = { ...a, sort_order: b.sort_order };
    setItems(next);
    const supabase = createClient();
    await supabase.from("hero_slides").update({ sort_order: next[index].sort_order }).eq("id", next[index].id);
    await supabase.from("hero_slides").update({ sort_order: next[target].sort_order }).eq("id", next[target].id);
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
      setForm({ ...form, image: url });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Gagal upload gambar");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.image) {
      setError("Gambar wajib diupload (format WebP).");
      return;
    }
    const supabase = createClient();
    const { error: dbError } = editingId
      ? await supabase.from("hero_slides").update({ image: form.image, alt: form.alt, link: form.link }).eq("id", editingId)
      : await supabase.from("hero_slides").insert({ ...form, sort_order: (items.length + 1) * 10 });
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus slide ini?")) return;
    const supabase = createClient();
    await supabase.from("hero_slides").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-sm text-neutral-500">Memuat...</p>;

  return (
    <div>
      <AdminHeader
        title="Slideshow Beranda"
        description="Kelola gambar slideshow di halaman beranda. Gambar wajib format WebP."
        action={
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4" /> Tambah Slide
          </Button>
        }
      />

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500">
            Belum ada slide. Klik &quot;Tambah Slide&quot; untuk membuat slideshow.
          </p>
        )}
        {items.map((s, idx) => (
          <div
            key={s.id}
            className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-3"
          >
            {s.image ? (
              <img
                src={s.image}
                alt={s.alt}
                className="h-20 w-36 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <span className="flex h-20 w-36 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
                —
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#1A2340]">
                {s.alt || "Tanpa alt"}
              </p>
              <p className="truncate text-xs text-neutral-500">{s.link || "Tanpa link"}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => moveSlide(s.id, -1)}
                disabled={idx === 0}
                className="rounded-lg bg-white p-2 text-neutral-500 shadow hover:text-[#6B2C91] disabled:opacity-30"
                title="Naik"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => moveSlide(s.id, 1)}
                disabled={idx === items.length - 1}
                className="rounded-lg bg-white p-2 text-neutral-500 shadow hover:text-[#6B2C91] disabled:opacity-30"
                title="Turun"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => startEdit(s)}
                className="rounded-lg bg-white p-2 text-neutral-700 shadow hover:bg-[#6B2C91] hover:text-white"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="rounded-lg bg-white p-2 text-neutral-700 shadow hover:bg-red-600 hover:text-white"
                title="Hapus"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="text-lg font-bold text-[#1A2340]">
              {editingId ? "Edit Slide" : "Tambah Slide"}
            </h2>
            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Field
                label="Gambar (WebP)"
                hint="Disarankan lebar 1920px, rasio landscape. Tinggi otomatis 200-500px tergantung ukuran layar."
              >
                {form.image ? (
                  <div className="relative inline-block">
                    <img
                      src={form.image}
                      alt="Pratinjau slide"
                      className="h-40 w-full rounded-lg object-cover sm:w-72"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                      title="Hapus gambar"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:border-[#6B2C91]">
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
              <Field label="Alt Image" hint="Teks alternatif slide (untuk SEO & aksesibilitas).">
                <TextInput
                  value={form.alt}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, alt: e.target.value })}
                />
              </Field>
              <Field label="Link" hint="Halaman tujuan saat slide diklik. Contoh: /produk/banner-spanduk">
                <TextInput
                  value={form.link}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, link: e.target.value })}
                />
              </Field>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}