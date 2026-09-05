"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AdminHeader,
  Button,
  Field,
  TextInput,
  Table,
} from "../components/ui";

interface TrustedBrand {
  id: number;
  name: string;
  logo: string;
  sort_order: number;
}

const emptyForm = {
  name: "",
  logo: "",
  sort_order: 0,
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
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
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
      sort_order: b.sort_order,
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

      <Table headers={["Logo", "Nama", "Urutan", "Aksi"]}>
        {items.map((b) => (
          <tr key={b.id} className="hover:bg-neutral-50">
            <td className="px-5 py-3">
              {b.logo ? (
                <img
                  src={b.logo}
                  alt={b.name}
                  className="h-10 w-10 rounded-full border border-neutral-200 object-contain"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-sm font-bold text-neutral-400">
                  {initialOf(b.name)}
                </span>
              )}
            </td>
            <td className="px-5 py-3 font-medium text-[#1A2340]">{b.name}</td>
            <td className="px-5 py-3 text-neutral-500">{b.sort_order}</td>
            <td className="px-5 py-3">
              <div className="flex gap-4">
                <button onClick={() => startEdit(b)} className="text-neutral-500 hover:text-[#6B2C91]" title="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(b.id)} className="text-neutral-500 hover:text-red-600" title="Hapus">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

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
              <Field label="Logo (WebP)" hint="Kosongkan untuk menampilkan huruf awal nama.">
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
              <Field label="Nama Brand">
                <TextInput value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} required />
              </Field>
              <Field label="Urutan">
                <TextInput
                  type="number"
                  value={form.sort_order}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, sort_order: Number(e.target.value) })}
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