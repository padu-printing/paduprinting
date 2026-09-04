"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
  price_tiers: unknown;
  specifications: unknown;
  is_best_seller: boolean;
  click_count: number;
}

const emptyForm = {
  slug: "",
  name: "",
  category_slug: "",
  description: "",
  short_description: "",
  image: "",
  gallery: "",
  base_price: 0,
  production_time: "",
  variant_groups: "[]",
  price_tiers: "[]",
  specifications: "[]",
  is_best_seller: false,
};

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; slug: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

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
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function startEdit(p: Product) {
    setForm({
      slug: p.slug,
      name: p.name,
      category_slug: p.category_slug,
      description: p.description,
      short_description: p.short_description,
      image: p.image,
      gallery: JSON.stringify(p.gallery, null, 2),
      base_price: p.base_price,
      production_time: p.production_time,
      variant_groups: JSON.stringify(p.variant_groups, null, 2),
      price_tiers: JSON.stringify(p.price_tiers, null, 2),
      specifications: JSON.stringify(p.specifications, null, 2),
      is_best_seller: p.is_best_seller,
    });
    setEditingId(p.id);
    setShowForm(true);
    setError("");
  }

  function parseJson(str: string): unknown {
    const s = str.trim();
    if (!s) return [];
    return JSON.parse(s);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    let payload: Record<string, unknown>;
    try {
      payload = {
        slug: form.slug,
        name: form.name,
        category_slug: form.category_slug,
        description: form.description,
        short_description: form.short_description,
        image: form.image,
        gallery: form.gallery.trim() || "[]",
        base_price: Number(form.base_price) || 0,
        production_time: form.production_time,
        variant_groups: JSON.stringify(parseJson(form.variant_groups)),
        price_tiers: JSON.stringify(parseJson(form.price_tiers)),
        specifications: JSON.stringify(parseJson(form.specifications)),
        is_best_seller: form.is_best_seller,
      };
    } catch {
      setError("JSON tidak valid. Periksa format kolom gallery / variant / price tier / spek.");
      return;
    }

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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Gambar URL">
                  <TextInput value={form.image} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, image: e.target.value })} />
                </Field>
                <Field label="Waktu Produksi">
                  <TextInput value={form.production_time} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, production_time: e.target.value })} />
                </Field>
              </div>
              <Field label="Gallery (JSON array URL)" hint='["/image1.png", "/image2.png"]'>
                <TextArea rows={3} value={form.gallery} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, gallery: e.target.value })} />
              </Field>
              <Field label="Variant Groups (JSON)" hint='[{"name":"Bahan","options":[{"label":"","value":"","priceModifier":0}]}]'>
                <TextArea rows={5} className="font-mono text-xs" value={form.variant_groups} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, variant_groups: e.target.value })} />
              </Field>
              <Field label="Price Tiers (JSON)" hint='[{"minQty":100,"maxQty":null,"pricePerUnit":1000}]'>
                <TextArea rows={4} className="font-mono text-xs" value={form.price_tiers} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, price_tiers: e.target.value })} />
              </Field>
              <Field label="Spesifikasi (JSON)" hint='[{"label":"Ukuran","value":"A3"}]'>
                <TextArea rows={4} className="font-mono text-xs" value={form.specifications} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, specifications: e.target.value })} />
              </Field>
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
