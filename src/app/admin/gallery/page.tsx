"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AdminHeader,
  Button,
  Field,
  TextInput,
  Table,
  Badge,
} from "../components/ui";

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  tall: boolean;
  sort_order: number;
}

const emptyForm = {
  title: "",
  image: "",
  tall: false,
  sort_order: 0,
};

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
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
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });
    if (!error) setItems(data as GalleryItem[]);
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

  function startEdit(g: GalleryItem) {
    setForm({
      title: g.title,
      image: g.image,
      tall: g.tall,
      sort_order: g.sort_order,
    });
    setEditingId(g.id);
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
      ? await supabase.from("gallery_items").update(form).eq("id", editingId)
      : await supabase.from("gallery_items").insert(form);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus item galeri ini?")) return;
    const supabase = createClient();
    await supabase.from("gallery_items").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-sm text-neutral-500">Memuat...</p>;

  return (
    <div>
      <AdminHeader
        title="Galeri Hasil Cetak"
        description="Kelola galeri hasil karya untuk homepage. Gambar wajib format WebP."
        action={
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4" /> Tambah Foto
          </Button>
        }
      />

      <Table headers={["Foto", "Judul", "Tampilan", "Urutan", "Aksi"]}>
        {items.map((g) => (
          <tr key={g.id} className="hover:bg-neutral-50">
            <td className="px-5 py-3">
              {g.image ? (
                <img
                  src={g.image}
                  alt={g.title}
                  className={`h-16 w-16 rounded-lg object-cover ${g.tall ? "aspect-[4/5] h-20" : ""}`}
                />
              ) : (
                <span className="text-neutral-300">—</span>
              )}
            </td>
            <td className="px-5 py-3 font-medium text-[#1A2340]">{g.title}</td>
            <td className="px-5 py-3">
              {g.tall ? <Badge>Tinggi</Badge> : <Badge>Kotak</Badge>}
            </td>
            <td className="px-5 py-3 text-neutral-500">{g.sort_order}</td>
            <td className="px-5 py-3">
              <div className="flex gap-4">
                <button onClick={() => startEdit(g)} className="text-neutral-500 hover:text-[#6B2C91]" title="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(g.id)} className="text-neutral-500 hover:text-red-600" title="Hapus">
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
              {editingId ? "Edit Foto Galeri" : "Tambah Foto Galeri"}
            </h2>
            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Field label="Gambar (WebP)">
                {form.image ? (
                  <div className="relative inline-block">
                    <img
                      src={form.image}
                      alt="Pratinjau galeri"
                      className="h-32 w-32 rounded-lg object-cover"
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
                  <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:border-[#6B2C91]">
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
              <Field label="Judul">
                <TextInput value={form.title} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, title: e.target.value })} required />
              </Field>
              <Field label="Tampilan" hint="Tinggi (portrait 4:5) atau Kotak (1:1) untuk layout masonry">
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={form.tall}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, tall: e.target.checked })}
                    className="h-4 w-4 rounded border-neutral-300 accent-[#6B2C91]"
                  />
                  Tampil lebih tinggi di galeri homepage
                </label>
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