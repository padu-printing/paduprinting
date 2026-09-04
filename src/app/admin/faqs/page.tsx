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
  SelectInput,
  Table,
} from "../components/ui";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

const emptyForm = { question: "", answer: "", category: "Umum", sort_order: 0 };

export default function AdminFaqs() {
  const [items, setItems] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const cats = items.map((f) => f.category).filter((v, i, a) => a.indexOf(v) === i);

  async function load() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error) setItems(data as FAQ[]);
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

  function startEdit(f: FAQ) {
    setForm({ question: f.question, answer: f.answer, category: f.category, sort_order: f.sort_order });
    setEditingId(f.id);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (editingId) {
      await supabase.from("faqs").update(form).eq("id", editingId);
    } else {
      await supabase.from("faqs").insert(form);
    }
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus FAQ ini?")) return;
    const supabase = createClient();
    await supabase.from("faqs").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-sm text-neutral-500">Memuat...</p>;

  return (
    <div>
      <AdminHeader
        title="FAQ"
        description="Kelola pertanyaan yang sering diajukan."
        action={
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4" /> Tambah FAQ
          </Button>
        }
      />

      <Table headers={["Pertanyaan", "Kategori", "Urutan", "Aksi"]}>
        {items.map((f) => (
          <tr key={f.id} className="hover:bg-neutral-50">
            <td className="max-w-sm px-5 py-3 font-medium text-[#1A2340]">{f.question}</td>
            <td className="px-5 py-3 text-neutral-500">{f.category}</td>
            <td className="px-5 py-3 text-neutral-500">{f.sort_order}</td>
            <td className="px-5 py-3">
              <div className="flex gap-2">
                <button onClick={() => startEdit(f)} className="text-neutral-500 hover:text-[#6B2C91]" title="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(f.id)} className="text-neutral-500 hover:text-red-600" title="Hapus">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="text-lg font-bold text-[#1A2340]">
              {editingId ? "Edit FAQ" : "Tambah FAQ"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Field label="Pertanyaan">
                <TextInput value={form.question} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, question: e.target.value })} required />
              </Field>
              <Field label="Jawaban">
                <TextArea rows={4} value={form.answer} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, answer: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Kategori">
                  <SelectInput
                    value={form.category}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, category: e.target.value })}
                  >
                    {cats.length === 0 && <option value="Umum">Umum</option>}
                    {cats.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Umum">+ Umum</option>
                  </SelectInput>
                </Field>
                <Field label="Urutan">
                  <TextInput type="number" value={form.sort_order} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, sort_order: Number(e.target.value) })} />
                </Field>
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
