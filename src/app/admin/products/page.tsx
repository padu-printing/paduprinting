"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import RichTextEditor from "@/components/admin/rich-text-editor";
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
  image: string;
  gallery: string[];
  base_price: number;
  production_time: string;
  is_best_seller: boolean;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  tags: string[];
  seo_score: number;
  click_count: number;
}

const emptyForm = {
  slug: "",
  name: "",
  category_slug: "",
  description: "",
  image: "",
  gallery: [] as string[],
  base_price: 0,
  meta_title: "",
  meta_description: "",
  focus_keyword: "",
  tags: [] as string[],
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ");
}

function computeSeoScore(o: {
  name: string;
  title: string;
  description: string;
  focusKeyword: string;
  tags: string[];
  content: string;
}): number {
  let score = 0;
  const title = o.title.trim();
  const desc = o.description.trim();
  const kw = o.focusKeyword.trim().toLowerCase();
  const text = `${o.name} ${o.title} ${o.description} ${stripHtml(o.content)}`.toLowerCase();
  const words = stripHtml(o.content).trim().split(/\s+/).filter(Boolean).length;

  if (title.length >= 30 && title.length <= 60) score += 25;
  else if (title.length > 0) score += 12;

  if (desc.length >= 70 && desc.length <= 160) score += 20;
  else if (desc.length > 0) score += 10;

  if (kw) {
    if (title.toLowerCase().includes(kw)) score += 15;
    if (desc.includes(kw)) score += 10;
    if (text.includes(kw)) score += 5;
  }

  if (o.tags.length >= 3) score += 10;
  else if (o.tags.length > 0) score += 4;

  if (words >= 300) score += 20;
  else if (words >= 100) score += 14;
  else if (words > 0) score += 7;

  return Math.min(100, score);
}

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; slug: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [tagInput, setTagInput] = useState("");

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

  function startCreate() {
    setForm({
      ...emptyForm,
      gallery: [""],
    });
    setTagInput("");
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function startEdit(p: Product) {
    setForm({
      slug: p.slug,
      name: p.name,
      category_slug: p.category_slug,
      description: p.description || "",
      image: p.image,
      gallery: Array.isArray(p.gallery) && p.gallery.length ? (p.gallery as string[]) : [""],
      base_price: Number(p.base_price),
      meta_title: p.meta_title || "",
      meta_description: p.meta_description || "",
      focus_keyword: p.focus_keyword || "",
      tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
    });
    setTagInput("");
    setEditingId(p.id);
    setShowForm(true);
    setError("");
  }

  useEffect(() => {
    load();
  }, []);

  const seoScore = useMemo(
    () =>
      computeSeoScore({
        name: form.name,
        title: form.meta_title,
        description: form.meta_description,
        focusKeyword: form.focus_keyword,
        tags: form.tags,
        content: form.description,
      }),
    [form.name, form.meta_title, form.meta_description, form.focus_keyword, form.tags, form.description]
  );

  function scoreColor(score: number) {
    if (score >= 80) return { bg: "bg-green-500", text: "text-green-600" };
    if (score >= 50) return { bg: "bg-amber-500", text: "text-amber-600" };
    return { bg: "bg-red-500", text: "text-red-600" };
  }

  // Gallery helpers
  function addGallery() {
    if (form.gallery.length >= 3) return;
    setForm({ ...form, gallery: [...form.gallery, ""] });
  }
  function removeGallery(idx: number) {
    if (form.image === form.gallery[idx]) setForm({ ...form, gallery: form.gallery.filter((_, i) => i !== idx), image: "" });
    else setForm({ ...form, gallery: form.gallery.filter((_, i) => i !== idx) });
  }

  async function uploadFile(file: File): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal upload gambar");
    return data.url as string;
  }

  async function handleUploadGallery(idx: number, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/webp") {
      setUploadError("Hanya format WebP yang diizinkan.");
      e.target.value = "";
      return;
    }
    setUploadError("");
    try {
      const url = await uploadFile(file);
      const g = [...form.gallery];
      g[idx] = url;
      setForm({
        ...form,
        gallery: g,
        image: form.image || url,
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Gagal upload gambar");
    } finally {
      e.target.value = "";
    }
  }

  function addTag() {
    const t = tagInput.trim().replace(/,+$/, "");
    if (!t) return;
    const newTags = [...new Set([...form.tags, ...t.split(",").map((s) => s.trim()).filter(Boolean)])].slice(0, 10);
    setForm({ ...form, tags: newTags });
    setTagInput("");
  }

  function removeTag(idx: number) {
    setForm({ ...form, tags: form.tags.filter((_, i) => i !== idx) });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const cleanGallery = form.gallery.map((g) => g.trim()).filter(Boolean);

    const payload: Record<string, unknown> = {
      slug: form.slug,
      name: form.name,
      category_slug: form.category_slug,
      description: form.description,
      image: form.image,
      gallery: cleanGallery,
      base_price: Number(form.base_price) || 0,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      focus_keyword: form.focus_keyword,
      tags: form.tags,
      seo_score: seoScore,
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

      <Table headers={["Nama", "Kategori", "Harga", "SEO", "Aksi"]}>
        {items.map((p) => (
          <tr key={p.id} className="hover:bg-neutral-50">
            <td className="px-5 py-3 font-medium text-[#1A2340]">{p.name}</td>
            <td className="px-5 py-3 text-neutral-500">{p.category_slug}</td>
            <td className="px-5 py-3 text-neutral-500">
              Rp {Number(p.base_price).toLocaleString("id-ID")}
            </td>
            <td className="px-5 py-3">
              {p.seo_score ? <Badge>{p.seo_score}</Badge> : <span className="text-neutral-400">-</span>}
            </td>
            <td className="px-5 py-3">
              <div className="flex gap-4">
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
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6">
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
                <Field label="Nama Produk">
                  <TextInput value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} required />
                </Field>
                <Field label="Slug">
                  <TextInput value={form.slug} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, slug: e.target.value })} required />
                </Field>
              </div>

              <Field label="Deskripsi">
                <RichTextEditor
                  key={editingId ?? "new"}
                  value={form.description}
                  onChange={(html) => setForm({ ...form, description: html })}
                />
              </Field>

              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Upload Gambar (maksimal 3, format WebP)
                </label>
                <div className="space-y-2">
                  {form.gallery.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {url ? (
                        <img src={url} alt={`Gambar ${idx + 1}`} className="h-12 w-12 rounded-lg border border-neutral-200 object-cover" />
                      ) : (
                        <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-xs text-neutral-400">
                          Kosong
                        </span>
                      )}
                      <label className="flex-1 cursor-pointer rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 hover:border-[#6B2C91] hover:text-[#6B2C91]">
                        <input type="file" accept="image/webp,.webp" onChange={(e: ChangeEvent<HTMLInputElement>) => handleUploadGallery(idx, e)} className="hidden" />
                        {url ? "Ganti gambar" : "Unggah gambar"}
                      </label>
                      <button type="button" onClick={() => removeGallery(idx)} className="shrink-0 rounded-lg p-2 text-neutral-400 hover:text-red-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
                {form.gallery.length < 3 && (
                  <Button type="button" variant="ghost" onClick={addGallery} className="mt-2">
                    <Plus className="h-4 w-4" /> Tambah Gambar
                  </Button>
                )}
                {form.gallery.some((u) => u.trim() !== "") && (
                  <div className="mt-3">
                    <Field label="Gambar Utama">
                      <SelectInput
                        value={form.image}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, image: e.target.value })}
                      >
                        <option value="">Pilih gambar utama</option>
                        {form.gallery
                          .filter((url) => url.trim() !== "")
                          .map((url, idx) => (
                            <option key={url} value={url}>
                              Gambar {idx + 1}
                            </option>
                          ))}
                      </SelectInput>
                      {form.image && (
                        <img src={form.image} alt="Preview utama" className="mt-2 h-32 w-32 rounded-lg border border-neutral-200 object-cover" />
                      )}
                    </Field>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Kategori Produk">
                  <SelectInput value={form.category_slug} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, category_slug: e.target.value })} required>
                    <option value="">Pilih kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Harga Mulai (Rp)">
                  <TextInput type="number" min={0} value={form.base_price} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, base_price: Number(e.target.value) })} required />
                </Field>
              </div>

              {/* SEO & Meta */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-700">SEO & Meta</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Skor SEO</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-200">
                        <div className={`h-full ${scoreColor(seoScore).bg}`} style={{ width: `${seoScore}%` }} />
                      </div>
                      <span className={`text-sm font-bold ${scoreColor(seoScore).text}`}>{seoScore}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Field label={
                    <span className="flex w-full items-center justify-between">
                      <span>SEO Title</span>
                      <span className={`text-xs ${form.meta_title.length >= 30 && form.meta_title.length <= 60 ? "text-green-600" : "text-neutral-400"}`}>
                        {form.meta_title.length}/60
                      </span>
                    </span>
                  }>
                    <TextInput placeholder="Judul SEO (ideal 30-60 karakter)" value={form.meta_title} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, meta_title: e.target.value })} />
                  </Field>
                  <Field label={
                    <span className="flex w-full items-center justify-between">
                      <span>SEO Description</span>
                      <span className={`text-xs ${form.meta_description.length >= 70 && form.meta_description.length <= 160 ? "text-green-600" : "text-neutral-400"}`}>
                        {form.meta_description.length}/160
                      </span>
                    </span>
                  }>
                    <TextArea rows={2} placeholder="Deskripsi SEO (ideal 70-160 karakter)" value={form.meta_description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, meta_description: e.target.value })} />
                  </Field>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Focus Keyword">
                      <TextInput placeholder="Kata kunci utama" value={form.focus_keyword} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, focus_keyword: e.target.value })} />
                    </Field>
                    <Field label="Tags">
                      <div>
                        <div className="flex items-center gap-2">
                          <TextInput
                            placeholder="Ketik tag, tekan Enter"
                            value={tagInput}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
                            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                              if (e.key === "Enter" || e.key === ",") {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                          />
                          <Button type="button" variant="ghost" onClick={addTag} className="shrink-0">
                            Tambah
                          </Button>
                        </div>
                        {form.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {form.tags.map((tag, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-[#6B2C91]/10 px-2.5 py-0.5 text-xs font-medium text-[#6B2C91]">
                                {tag}
                                <button type="button" onClick={() => removeTag(idx)} className="text-[#6B2C91]/50 hover:text-[#6B2C91]">
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Field>
                  </div>
                </div>
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