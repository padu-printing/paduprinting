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

interface ArticleCategory {
  id: number;
  slug: string;
  name: string;
  description: string;
  sort_order: number;
}

const emptyForm = {
  slug: "",
  name: "",
  description: "",
  sort_order: 0,
};

export default function AdminArticleCategories() {
  const [items, setItems] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("article_categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (!error) setItems(data as ArticleCategory[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function startEdit(c: ArticleCategory) {
    setForm({
      slug: c.slug,
      name: c.name,
      description: c.description,
      sort_order: c.sort_order,
    });
    setEditingId(c.id);
    setShowForm(true);
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const supabase = createClient();
    const { error: dbError } = editingId
      ? await supabase.from("article_categories").update(form).eq("id", editingId)
      : await supabase.from("article_categories").insert(form);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus kategori artikel ini?")) return;
    const supabase = createClient();
    await supabase.from("article_categories").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-sm text-neutral-500">Memuat...</p>;

  return (
    <div>
      <AdminHeader
        title="Kategori Artikel"
        description="Kelola kategori blog / artikel."
        action={
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4" /> Tambah Kategori
          </Button>
        }
      />

      <Table headers={["Nama", "Slug", "Deskripsi", "Urutan", "Aksi"]}>
        {items.map((c) => (
          <tr key={c.id} className="hover:bg-neutral-50">
            <td className="px-5 py-3 font-medium text-[#1A2340]">{c.name}</td>
            <td className="px-5 py-3 text-neutral-500">{c.slug}</td>
            <td className="max-w-xs px-5 py-3 text-neutral-500">{c.description}</td>
            <td className="px-5 py-3 text-neutral-500">{c.sort_order}</td>
            <td className="px-5 py-3">
              <div className="flex gap-4">
                <button onClick={() => startEdit(c)} className="text-neutral-500 hover:text-[#6B2C91]" title="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(c.id)} className="text-neutral-500 hover:text-red-600" title="Hapus">
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
              {editingId ? "Edit Kategori Artikel" : "Tambah Kategori Artikel"}
            </h2>
            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Field label="Nama">
                <TextInput value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} required />
              </Field>
              <Field label="Slug" hint="Contoh: tips-desain">
                <TextInput value={form.slug} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, slug: e.target.value })} required />
              </Field>
              <Field label="Deskripsi">
                <TextArea rows={3} value={form.description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })} />
              </Field>
              <Field label="Urutan">
                <TextInput type="number" value={form.sort_order} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, sort_order: Number(e.target.value) })} />
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