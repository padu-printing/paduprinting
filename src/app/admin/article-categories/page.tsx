"use client";

import { useEffect, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AdminHeader,
  Button,
  ConfirmDialog,
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
};

export default function AdminArticleCategories() {
  const [items, setItems] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

  async function handleDeleteConfirmed() {
    if (confirmDeleteId === null) return;
    setDeleting(true);
    setDeleteError("");
    const supabase = createClient();
    const { error } = await supabase.from("article_categories").delete().eq("id", confirmDeleteId);
    setDeleting(false);
    if (error) {
      setDeleteError(error.message);
      return;
    }
    setConfirmDeleteId(null);
    load();
  }

  function onDragStart(index: number) {
    setDragIndex(index);
  }

  function onDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    setOverIndex(index);
  }

  function onDrop(index: number) {
    if (dragIndex !== null && dragIndex !== index) {
      const next = [...items];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      setItems(next);
      saveOrder(next);
    }
    setDragIndex(null);
    setOverIndex(null);
  }

  function onDragEnd() {
    setDragIndex(null);
    setOverIndex(null);
  }

  async function saveOrder(list: ArticleCategory[]) {
    const supabase = createClient();
    await Promise.all(
      list.map((c, order) =>
        supabase.from("article_categories").update({ sort_order: order }).eq("id", c.id)
      )
    );
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

      <p className="mb-3 text-sm text-neutral-500">
        Seret baris (ikon <GripVertical className="inline h-3.5 w-3.5 text-neutral-400" />) untuk mengubah urutan.
      </p>

      <Table headers={["Nama", "Slug", "Deskripsi", "Aksi"]}>
        {items.map((c, idx) => (
          <tr
            key={c.id}
            draggable
            onDragStart={() => onDragStart(idx)}
            onDragOver={(e: DragEvent) => onDragOver(e, idx)}
            onDrop={() => onDrop(idx)}
            onDragEnd={onDragEnd}
            className={`hover:bg-neutral-50 ${overIndex === idx ? "bg-neutral-100" : ""}`}
          >
            <td className="px-5 py-3">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-neutral-400 active:cursor-grabbing" />
                <span className="font-medium text-[#1A2340]">{c.name}</span>
              </div>
            </td>
            <td className="px-5 py-3 text-neutral-500">{c.slug}</td>
            <td className="max-w-xs px-5 py-3 text-neutral-500">{c.description}</td>
            <td className="px-5 py-3">
              <div className="flex gap-4">
                <button onClick={() => startEdit(c)} className="text-neutral-500 hover:text-[#6B2C91]" title="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => setConfirmDeleteId(c.id)} className="text-neutral-500 hover:text-red-600" title="Hapus">
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

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Hapus kategori artikel?"
        message={deleteError ? `Gagal menghapus: ${deleteError}` : "Kategori ini akan dihapus permanen. Artikel di dalamnya bisa menjadi tidak terkait."}
        loading={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => { setConfirmDeleteId(null); setDeleteError(""); }}
      />
    </div>
  );
}