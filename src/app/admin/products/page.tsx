"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AdminHeader,
  Badge,
  Button,
  Field,
  SelectInput,
  TextInput,
  TextArea,
  Table,
} from "../components/ui";

interface Product {
  id: number;
  slug: string;
  name: string;
  category_slug: string;
  description: string;
  short_description: string;
  image: string;
  gallery: string[];
  base_price: number;
  production_time: string;
  variant_groups: unknown;
  is_best_seller: boolean;
  meta_title: string;
  meta_description: string;
  click_count: number;
}

interface VariantOption {
  label: string;
  value: string;
}
interface VariantGroup {
  name: string;
  options: VariantOption[];
}

const emptyForm = {
  slug: "",
  name: "",
  category_slug: "",
  description: "",
  short_description: "",
  image: "",
  gallery: [] as string[],
  base_price: 0,
  production_time: "",
  variant_groups: [] as VariantGroup[],
  is_best_seller: false,
  meta_title: "",
  meta_description: "",
};

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; slug: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function load() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });
    if (!error) setItems(data as Product[]);
    const { data: cats } = await supabase
      .from("categories")
      .select("id, slug, name")
      .order("name", { ascending: true });
    if (cats) setCategories(cats);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setForm({
      ...emptyForm,
      gallery: [""],
      variant_groups: [{ name: "", options: [{ label: "", value: "" }] }],
    });
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function startEdit(p: Product) {
    const groups = Array.isArray(p.variant_groups) ? (p.variant_groups as VariantGroup[]) : [];
    setForm({
      slug: p.slug,
      name: p.name,
      category_slug: p.category_slug,
      description: p.description,
      short_description: p.short_description,
      image: p.image,
      gallery: Array.isArray(p.gallery) && p.gallery.length ? p.gallery : [""],
      base_price: Number(p.base_price),
      production_time: p.production_time,
      variant_groups: groups.length ? groups : [{ name: "", options: [{ label: "", value: "" }] }],
      is_best_seller: p.is_best_seller,
      meta_title: p.meta_title || "",
      meta_description: p.meta_description || "",
    });
    setEditingId(p.id);
    setShowForm(true);
    setError("");
  }

  // Gallery helpers
  function setGallery(idx: number, val: string) {
    const g = [...form.gallery];
    g[idx] = val;
    setForm({ ...form, gallery: g });
  }
  function addGallery() {
    setForm({ ...form, gallery: [...form.gallery, ""] });
  }
  function removeGallery(idx: number) {
    setForm({ ...form, gallery: form.gallery.filter((_, i) => i !== idx) });
  }

  // Variant helpers
  function setGroupName(gi: number, val: string) {
    const g = [...form.variant_groups];
    g[gi] = { ...g[gi], name: val };
    setForm({ ...form, variant_groups: g });
  }
  function addGroup() {
    setForm({
      ...form,
      variant_groups: [...form.variant_groups, { name: "", options: [{ label: "", value: "" }] }],
    });
  }
  function removeGroup(gi: number) {
    setForm({ ...form, variant_groups: form.variant_groups.filter((_, i) => i !== gi) });
  }
  function setOption(gi: number, oi: number, field: keyof VariantOption, val: string) {
    const g = [...form.variant_groups];
    g[gi] = {
      ...g[gi],
      options: g[gi].options.map((o, i) => (i === oi ? { ...o, [field]: val } : o)),
    };
    setForm({ ...form, variant_groups: g });
  }
  function addOption(gi: number) {
    const g = [...form.variant_groups];
    g[gi] = { ...g[gi], options: [...g[gi].options, { label: "", value: "" }] };
    setForm({ ...form, variant_groups: g });
  }
  function removeOption(gi: number, oi: number) {
    const g = [...form.variant_groups];
    g[gi] = { ...g[gi], options: g[gi].options.filter((_, i) => i !== oi) };
    setForm({ ...form, variant_groups: g });
  }

  // Price tier and spec helpers removed

  async function handleUploadImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "png";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: true });
      if (upErr) throw new Error(upErr.message);
      const { data: pub } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);
      setForm((f) => ({ ...f, image: pub.publicUrl }));
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

    const cleanGallery = form.gallery.map((g) => g.trim()).filter(Boolean);
    const cleanGroups = form.variant_groups
      .filter((g) => g.name.trim() !== "")
      .map((g) => ({
        name: g.name.trim(),
        options: g.options.filter((o) => o.label.trim() !== ""),
      }));

    const payload: Record<string, unknown> = {
      slug: form.slug,
      name: form.name,
      category_slug: form.category_slug,
      description: form.description,
      short_description: form.short_description,
      image: form.image,
      gallery: cleanGallery,
      base_price: Number(form.base_price) || 0,
      production_time: form.production_time,
      variant_groups: cleanGroups,
      is_best_seller: form.is_best_seller,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
    };

    const supabase = createClient();
    const { error: dbError } = editingId
      ? await supabase.from("products").update(payload).eq("id", editingId)
      : await supabase.from("products").insert(payload);

    if (dbError) {
      setError(dbError.message);
      return;
    }
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus produk ini?")) return;
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-sm text-neutral-500">Memuat...</p>;

  return (
    <div>
      <AdminHeader
        title="Produk"
        description="Kelola katalog produk."
        action={
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4" /> Tambah Produk
          </Button>
        }
      />

      <Table headers={["Nama", "Kategori", "Harga", "Best Seller", "Aksi"]}>
        {items.map((p) => (
          <tr key={p.id} className="hover:bg-neutral-50">
            <td className="px-5 py-3 font-medium text-[#1A2340]">{p.name}</td>
            <td className="px-5 py-3 text-neutral-500">{p.category_slug}</td>
            <td className="px-5 py-3 text-neutral-500">
              Rp {Number(p.base_price).toLocaleString("id-ID")}
            </td>
            <td className="px-5 py-3">
              {p.is_best_seller ? <Badge>Best</Badge> : <span className="text-neutral-400">-</span>}
            </td>
            <td className="px-5 py-3">
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="text-neutral-500 hover:text-[#6B2C91]" title="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-neutral-500 hover:text-red-600" title="Hapus">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="text-lg font-bold text-[#1A2340]">
              {editingId ? "Edit Produk" : "Tambah Produk"}
            </h2>
            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nama">
                  <TextInput value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} required />
                </Field>
                <Field label="Slug">
                  <TextInput value={form.slug} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, slug: e.target.value })} required />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Kategori">
                  <SelectInput value={form.category_slug} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, category_slug: e.target.value })} required>
                    <option value="">Pilih kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Harga Dasar (Rp)">
                  <TextInput type="number" value={form.base_price} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, base_price: Number(e.target.value) })} />
                </Field>
              </div>
              <Field label="Deskripsi Singkat">
                <TextArea rows={2} value={form.short_description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, short_description: e.target.value })} />
              </Field>
              <Field label="Deskripsi">
                <TextArea rows={4} value={form.description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })} />
              </Field>
              {/* Image upload */}
              <div>
                <Field label="Gambar Utama">
                  {form.image && (
                    <img src={form.image} alt="Preview" className="mb-2 h-32 w-32 rounded-lg border border-neutral-200 object-cover" />
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-500 hover:border-[#6B2C91] hover:text-[#6B2C91]">
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleUploadImage} className="hidden" />
                    {uploading ? "Mengupload..." : "Pilih gambar dari komputer"}
                  </label>
                  {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
                </Field>
              </div>

              {/* Gallery */}
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">Galeri Gambar</label>
                <div className="space-y-2">
                  {form.gallery.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <TextInput placeholder={`URL gambar ${idx + 1}`} value={url} onChange={(e: ChangeEvent<HTMLInputElement>) => setGallery(idx, e.target.value)} />
                      <button type="button" onClick={() => removeGallery(idx)} className="shrink-0 rounded-lg p-2 text-neutral-400 hover:text-red-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="ghost" onClick={addGallery} className="mt-2">
                  <Plus className="h-4 w-4" /> Tambah Gambar
                </Button>
              </div>

              {/* Variant groups */}
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Pilihan Varian (bahan, ukuran, finishing...)
                </label>
                <div className="space-y-3">
                  {form.variant_groups.map((g, gi) => (
                    <div key={gi} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                      <div className="flex items-center gap-2">
                        <TextInput
                          placeholder="Nama varian (mis. Bahan, Ukuran)"
                          value={g.name}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setGroupName(gi, e.target.value)}
                          className="text-sm"
                        />
                        <button type="button" onClick={() => removeGroup(gi)} className="shrink-0 rounded-lg p-2 text-neutral-400 hover:text-red-600">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 space-y-2">
                        {g.options.map((o, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <input
                              placeholder="Nama opsi"
                              value={o.label}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setOption(gi, oi, "label", e.target.value)}
                              className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-[#6B2C91]"
                            />
                            <button type="button" onClick={() => removeOption(gi, oi)} className="shrink-0 rounded-lg p-1.5 text-neutral-400 hover:text-red-600">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <Button type="button" variant="ghost" onClick={() => addOption(gi)} className="mt-2 text-xs">
                        <Plus className="h-3.5 w-3.5" /> Tambah Opsi
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="ghost" onClick={addGroup} className="mt-2">
                  <Plus className="h-4 w-4" /> Tambah Varian
                </Button>
              </div>

              {/* SEO Meta */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <p className="mb-3 text-sm font-medium text-neutral-700">SEO / Meta</p>
                <div className="space-y-3">
                  <Field label="Meta Title">
                    <TextInput placeholder="Judul untuk SEO (opsional)" value={form.meta_title} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, meta_title: e.target.value })} />
                  </Field>
                  <Field label="Meta Description">
                    <TextArea rows={2} placeholder="Deskripsi singkat untuk SEO (opsional)" value={form.meta_description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, meta_description: e.target.value })} />
                  </Field>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bestseller"
                  checked={form.is_best_seller}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, is_best_seller: e.target.checked })}
                  className="h-4 w-4 accent-[#6B2C91]"
                />
                <label htmlFor="bestseller" className="text-sm text-neutral-700">
                  Best Seller
                </label>
              </div>
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
