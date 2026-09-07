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

interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  sort_order: number;
}

const emptyForm = {
  slug: "",
  name: "",
  description: "",
  icon: "",
  image: "",
};

export default function AdminCategories() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (!error) setItems(data as Category[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(c: Category) {
    setForm({
      slug: c.slug,
      name: c.name,
      description: c.description,
      icon: c.icon,
      image: c.image,
    });
    setEditingId(c.id);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (editingId) {
      await supabase.from("categories").update(form).eq("id", editingId);
    } else {
      await supabase.from("categories").insert(form);
    }
    setShowForm(false);
    load();
  }

  async function handleDeleteConfirmed() {
    if (confirmDeleteId === null) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", confirmDeleteId);
    setDeleting(false);
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

  async function saveOrder(list: Category[]) {
    const supabase = createClient();
    await Promise.all(
      list.map((c, order) =>
        supabase.from("categories").update({ sort_order: order }).eq("id", c.id)
      )
    );
  }

  if (loading) return <p className="text-sm text-neutral-500">Memuat...</p>;

  return (
    <div>
      <AdminHeader
        title="Kategori"
        description="Kelola kategori produk."
        action={
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4" /> Tambah Kategori
          </Button>
        }
      />

      <p className="mb-3 text-sm text-neutral-500">
        Seret baris (ikon <GripVertical className="inline h-3.5 w-3.5 text-neutral-400" />) untuk mengubah urutan.
      </p>

      <Table headers={["Nama", "Slug", "Icon", "Gambar", "Aksi"]}>
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
            <td className="px-5 py-3 text-neutral-500">{c.icon}</td>
            <td className="px-5 py-3 text-neutral-500">{c.image}</td>
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
              {editingId ? "Edit Kategori" : "Tambah Kategori"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Field label="Nama">
                <TextInput value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} required />
              </Field>
              <Field label="Slug" hint="Contoh: banner-spanduk">
                <TextInput value={form.slug} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, slug: e.target.value })} required />
              </Field>
              <Field label="Deskripsi">
                <TextArea rows={3} value={form.description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })} />
              </Field>
              <Field label="Icon" hint="Nama icon lucide, contoh: Megaphone, Package">
                <TextInput value={form.icon} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, icon: e.target.value })} />
              </Field>
              <Field label="Gambar URL">
                <TextInput value={form.image} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, image: e.target.value })} />
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
        title="Hapus kategori?"
        message="Kategori ini akan dihapus permanen. Produk di dalamnya bisa menjadi tidak terkait."
        loading={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
