"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AdminHeader,
  Button,
  Field,
  TextInput,
} from "../components/ui";

interface TrustedBrand {
  id: number;
  name: string;
  logo: string;
}

const emptyForm = {
  name: "",
  logo: "",
};

function initialOf(name: string): string {
  return (name.trim().charAt(0) || "?").toUpperCase();
}

export default function AdminTrustedBrands() {
  const [items, setItems] = useState<TrustedBrand[]>([]);
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
      .from("trusted_brands")
      .select("*")
      .order("id", { ascending: true });
    if (!error) setItems(data as TrustedBrand[]);
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

  function startEdit(b: TrustedBrand) {
    setForm({
      name: b.name,
      logo: b.logo,
    });
    setEditingId(b.id);
    setShowForm(true);
    setUploadError("");
    setError("");
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
      setForm({ ...form, logo: url });
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
    const supabase = createClient();
    const { error: dbError } = editingId
      ? await supabase.from("trusted_brands").update(form).eq("id", editingId)
      : await supabase.from("trusted_brands").insert(form);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus brand ini?")) return;
    const supabase = createClient();
    await supabase.from("trusted_brands").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-sm text-neutral-500">Memuat...</p>;

  return (
    <div>
      <AdminHeader
        title="Dipercaya Oleh"
        description="Logo brand pelanggan yang tampil di bagian 'Dipercaya oleh'. Logo wajib WebP."
        action={
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4" /> Tambah Brand
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((b) => (
          <div key={b.id} className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
            {b.logo ? (
              <img
                src={b.logo}
                alt={b.name}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-neutral-300">
                {initialOf(b.name)}
              </span>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <p className="w-full truncate px-3 text-center text-xs font-medium text-white">
                {b.name || "Tanpa alt"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(b)}
                  className="rounded-lg bg-white p-2 text-neutral-700 shadow hover:bg-[#6B2C91] hover:text-white"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="rounded-lg bg-white p-2 text-neutral-700 shadow hover:bg-red-600 hover:text-white"
                  title="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="text-lg font-bold text-[#1A2340]">
              {editingId ? "Edit Brand" : "Tambah Brand"}
            </h2>
            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Field label="Logo (WebP)">
                {form.logo ? (
                  <div className="relative inline-block">
                    <img
                      src={form.logo}
                      alt="Pratinjau logo"
                      className="h-24 w-24 rounded-2xl border border-neutral-200 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, logo: "" })}
                      className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                      title="Hapus logo"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:border-[#6B2C91]">
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
              <Field label="Alt Image" hint="Teks alternatif / caption logo (untuk SEO & aksesibilitas).">
                <TextInput value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} />
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