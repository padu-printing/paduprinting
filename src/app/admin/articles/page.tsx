"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
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

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  image_alt: string;
  date: string;
  author: string;
  category: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  tags: string[];
  seo_score: number;
}

const emptyForm = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_image: "",
  image_alt: "",
  date: "",
  author: "",
  category: "",
  meta_title: "",
  meta_description: "",
  focus_keyword: "",
  tags: [] as string[],
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ");
}

interface SeoCheck {
  label: string;
  earned: number;
  max: number;
  passed: boolean;
}

function computeSeoChecks(o: {
  title: string;
  description: string;
  focusKeyword: string;
  tags: string[];
  content: string;
}): { checks: SeoCheck[]; total: number } {
  const title = o.title.trim();
  const desc = o.description.trim();
  const kw = o.focusKeyword.trim().toLowerCase();
  const text = `${o.title} ${o.description} ${stripHtml(o.content)}`.toLowerCase();

  const checks: SeoCheck[] = [];

  const titleLen = title.length;
  if (titleLen >= 30 && titleLen <= 60) checks.push({ label: "SEO Title 30–60 karakter", earned: 25, max: 25, passed: true });
  else if (titleLen > 0) checks.push({ label: "SEO Title 30–60 karakter", earned: 12, max: 25, passed: false });
  else checks.push({ label: "SEO Title 30–60 karakter", earned: 0, max: 25, passed: false });

  const descLen = desc.length;
  if (descLen >= 70 && descLen <= 160) checks.push({ label: "SEO Description 70–160 karakter", earned: 20, max: 20, passed: true });
  else if (descLen > 0) checks.push({ label: "SEO Description 70–160 karakter", earned: 10, max: 20, passed: false });
  else checks.push({ label: "SEO Description 70–160 karakter", earned: 0, max: 20, passed: false });

  if (kw) {
    const kwInTitle = title.toLowerCase().includes(kw);
    const kwInDesc = desc.toLowerCase().includes(kw);
    const kwInContent = text.includes(kw);
    checks.push({ label: `Kata kunci "${o.focusKeyword.trim()}" di judul`, earned: kwInTitle ? 15 : 0, max: 15, passed: kwInTitle });
    checks.push({ label: `Kata kunci "${o.focusKeyword.trim()}" di deskripsi`, earned: kwInDesc ? 10 : 0, max: 10, passed: kwInDesc });
    checks.push({ label: `Kata kunci "${o.focusKeyword.trim()}" di konten`, earned: kwInContent ? 5 : 0, max: 5, passed: kwInContent });
  } else {
    checks.push({ label: "Isi Focus Keyword", earned: 0, max: 30, passed: false });
  }

  if (o.tags.length >= 3) checks.push({ label: "Tags minimal 3", earned: 10, max: 10, passed: true });
  else if (o.tags.length > 0) checks.push({ label: "Tags minimal 3", earned: 4, max: 10, passed: false });
  else checks.push({ label: "Tags minimal 3", earned: 0, max: 10, passed: false });

  const words = stripHtml(o.content).trim().split(/\s+/).filter(Boolean).length;
  if (words >= 300) checks.push({ label: "Panjang konten ≥ 300 kata", earned: 20, max: 20, passed: true });
  else if (words >= 100) checks.push({ label: "Panjang konten ≥ 300 kata", earned: 14, max: 20, passed: false });
  else if (words > 0) checks.push({ label: "Panjang konten ≥ 300 kata", earned: 7, max: 20, passed: false });
  else checks.push({ label: "Panjang konten ≥ 300 kata", earned: 0, max: 20, passed: false });

  const earned = checks.reduce((sum, c) => sum + c.earned, 0);
  return { checks, total: Math.min(100, earned) };
}

function scoreColor(score: number) {
  if (score >= 80) return { bg: "bg-green-500", text: "text-green-600" };
  if (score >= 50) return { bg: "bg-amber-500", text: "text-amber-600" };
  return { bg: "bg-red-500", text: "text-red-600" };
}

export default function AdminArticles() {
  const [items, setItems] = useState<Article[]>([]);
  const [articleCategories, setArticleCategories] = useState<{ id: number; slug: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  async function load() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("date", { ascending: false });
    if (!error) setItems(data as Article[]);
    const { data: cats } = await supabase
      .from("article_categories")
      .select("id, slug, name")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (cats) setArticleCategories(cats);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
    setTagInput("");
    setEditingId(null);
    setShowForm(true);
    setUploadError("");
    setError("");
  }

  function startEdit(a: Article) {
    setForm({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      cover_image: a.cover_image,
      image_alt: a.image_alt || "",
      date: a.date,
      author: a.author,
      category: a.category,
      meta_title: a.meta_title || "",
      meta_description: a.meta_description || "",
      focus_keyword: a.focus_keyword || "",
      tags: Array.isArray(a.tags) ? (a.tags as string[]) : [],
    });
    setTagInput("");
    setEditingId(a.id);
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

  async function handleUploadImage(e: ChangeEvent<HTMLInputElement>) {
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
      setForm({ ...form, cover_image: url });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Gagal upload gambar");
    } finally {
      setUploading(false);
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

  const seo = useMemo(
    () =>
      computeSeoChecks({
        title: form.meta_title,
        description: form.meta_description,
        focusKeyword: form.focus_keyword,
        tags: form.tags,
        content: form.content,
      }),
    [form.meta_title, form.meta_description, form.focus_keyword, form.tags, form.content]
  );
  const seoScore = seo.total;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const payload: Record<string, unknown> = {
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      cover_image: form.cover_image,
      image_alt: form.image_alt,
      date: form.date,
      author: form.author,
      category: form.category,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      focus_keyword: form.focus_keyword,
      tags: form.tags,
      seo_score: seoScore,
    };

    const supabase = createClient();
    const { error: dbError } = editingId
      ? await supabase.from("articles").update(payload).eq("id", editingId)
      : await supabase.from("articles").insert(payload);

    if (dbError) {
      setError(dbError.message);
      return;
    }
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus artikel ini?")) return;
    const supabase = createClient();
    await supabase.from("articles").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-sm text-neutral-500">Memuat...</p>;

  return (
    <div>
      <AdminHeader
        title="Artikel"
        description="Kelola blog / artikel."
        action={
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4" /> Tambah Artikel
          </Button>
        }
      />

      <Table headers={["Judul", "Kategori", "Tanggal", "SEO", "Aksi"]}>
        {items.map((a) => (
          <tr key={a.id} className="hover:bg-neutral-50">
            <td className="max-w-xs px-5 py-3 font-medium text-[#1A2340]">{a.title}</td>
            <td className="px-5 py-3 text-neutral-500">{a.category}</td>
            <td className="px-5 py-3 text-neutral-500">{a.date}</td>
            <td className="px-5 py-3">
              {a.seo_score ? <Badge>{a.seo_score}</Badge> : <span className="text-neutral-400">-</span>}
            </td>
            <td className="px-5 py-3">
              <div className="flex gap-4">
                <button onClick={() => startEdit(a)} className="text-neutral-500 hover:text-[#6B2C91]" title="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(a.id)} className="text-neutral-500 hover:text-red-600" title="Hapus">
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
              {editingId ? "Edit Artikel" : "Tambah Artikel"}
            </h2>
            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* 1 & 2. Judul + Slug */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Judul Artikel">
                  <TextInput value={form.title} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, title: e.target.value })} required />
                </Field>
                <Field label="Slug">
                  <TextInput value={form.slug} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, slug: e.target.value })} required />
                </Field>
              </div>

              {/* 3. Kategori + meta tambahan */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Kategori">
                  <SelectInput value={form.category} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, category: e.target.value })}>
                    <option value="">Pilih kategori</option>
                    {articleCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Tanggal">
                  <TextInput type="date" value={form.date} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, date: e.target.value })} />
                </Field>
                <Field label="Penulis">
                  <TextInput value={form.author} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, author: e.target.value })} />
                </Field>
              </div>

              {/* 4. Excerpt */}
              <Field label="Excerpt" hint="Ringkasan singkat yang tampil di kartu artikel & hasil pencarian.">
                <TextArea rows={2} value={form.excerpt} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, excerpt: e.target.value })} />
              </Field>

              {/* 5 & 6. Gambar + Alt text */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Gambar Cover (WebP)">
                  {form.cover_image ? (
                    <div className="relative inline-block">
                      <img
                        src={form.cover_image}
                        alt={form.image_alt || form.title || "Cover artikel"}
                        className="h-32 w-44 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, cover_image: "" })}
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
                        onChange={handleUploadImage}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  )}
                  {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
                </Field>
                <Field label="Alt Text Gambar" hint="Deskripsi teks untuk gambar (penting untuk SEO & aksesibilitas).">
                  <TextInput value={form.image_alt} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, image_alt: e.target.value })} placeholder="Contoh: Banner vinyl cetak PADU" />
                </Field>
              </div>

              {/* 7. Konten */}
              <Field label="Konten Artikel">
                <RichTextEditor
                  key={editingId ?? "new"}
                  value={form.content}
                  onChange={(html) => setForm({ ...form, content: html })}
                  placeholder="Tulis konten artikel..."
                />
              </Field>

              {/* 8 & 9. SEO Meta + Penilaian + Preview Google */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-700">SEO Meta</p>
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

                {/* Preview Google + penilaian */}
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-lg border border-neutral-200 bg-white p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                      Preview Hasil Google
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
                          <img src="/favicon.ico" alt="" className="h-4 w-4" />
                        </span>
                        <span className="text-sm text-neutral-600">PADU Printing</span>
                      </div>
                      <p className="line-clamp-2 text-[16px] leading-snug text-[#1a0dab]">
                        {form.meta_title || form.title || "Judul artikel Anda"}
                      </p>
                      <p className="text-xs text-[#006621]">
                        {`www.paduprinting.com/artikel/${form.slug || "slug-artikel"}`}
                      </p>
                      <p className="line-clamp-3 text-sm leading-snug text-neutral-600">
                        {form.meta_description || form.excerpt || "Deskripsi artikel akan tampil di sini..."}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-neutral-200 bg-white p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                      Penilaian SEO
                    </p>
                    <ul className="space-y-1.5">
                      {seo.checks.map((c, idx) => (
                        <li key={idx} className="flex items-center justify-between gap-2 text-sm">
                          <span className="flex items-center gap-2 text-neutral-600">
                            <span
                              className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                c.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                              }`}
                            >
                              {c.passed ? "✓" : "!"}
                            </span>
                            {c.label}
                          </span>
                          <span className={`shrink-0 text-xs tabular-nums ${c.passed ? "text-green-600" : "text-neutral-400"}`}>
                            {c.earned}/{c.max}
                          </span>
                        </li>
                      ))}
                    </ul>
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