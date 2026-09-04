"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AdminHeader,
  Button,
  Field,
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
  date: string;
  author: string;
  category: string;
}

const emptyForm = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_image: "",
  date: "",
  author: "",
  category: "",
};

export default function AdminArticles() {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("date", { ascending: false });
    if (!error) setItems(data as Article[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(a: Article) {
    setForm({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      cover_image: a.cover_image,
      date: a.date,
      author: a.author,
      category: a.category,
    });
    setEditingId(a.id);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (editingId) {
      await supabase.from("articles").update(form).eq("id", editingId);
    } else {
      await supabase.from("articles").insert(form);
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

      <Table headers={["Judul", "Kategori", "Tanggal", "Penulis", "Aksi"]}>
        {items.map((a) => (
          <tr key={a.id} className="hover:bg-neutral-50">
            <td className="max-w-xs px-5 py-3 font-medium text-[#1A2340]">{a.title}</td>
            <td className="px-5 py-3 text-neutral-500">{a.category}</td>
            <td className="px-5 py-3 text-neutral-500">{a.date}</td>
            <td className="px-5 py-3 text-neutral-500">{a.author}</td>
            <td className="px-5 py-3">
              <div className="flex gap-2">
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
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="text-lg font-bold text-[#1A2340]">
              {editingId ? "Edit Artikel" : "Tambah Artikel"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Field label="Judul">
                <TextInput value={form.title} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, title: e.target.value })} required />
              </Field>
              <Field label="Slug">
                <TextInput value={form.slug} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, slug: e.target.value })} required />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Kategori">
                  <TextInput value={form.category} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, category: e.target.value })} />
                </Field>
                <Field label="Tanggal">
                  <TextInput type="date" value={form.date} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, date: e.target.value })} />
                </Field>
                <Field label="Penulis">
                  <TextInput value={form.author} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, author: e.target.value })} />
                </Field>
              </div>
              <Field label="Cover Image URL">
                <TextInput value={form.cover_image} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, cover_image: e.target.value })} />
              </Field>
              <Field label="Ringkasan (excerpt)">
                <TextArea rows={2} value={form.excerpt} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, excerpt: e.target.value })} />
              </Field>
              <Field label="Konten (HTML)" hint="Boleh pakai tag HTML sederhana (h2, p, ul, li, strong).">
                <TextArea rows={12} className="font-mono text-xs" value={form.content} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, content: e.target.value })} />
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
