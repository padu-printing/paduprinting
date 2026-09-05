"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Tags, Newspaper, BookMarked, Images, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const tables = ["products", "categories", "articles", "article_categories", "gallery_items", "faqs"];
      const result: Record<string, number> = {};
      for (const t of tables) {
        const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
        result[t] = count ?? 0;
      }
      setCounts(result);
      setLoaded(true);
    }
    load();
  }, []);

  const cards = [
    { key: "products", label: "Produk", icon: Package, href: "/admin/products" },
    { key: "categories", label: "Kategori", icon: Tags, href: "/admin/categories" },
    { key: "articles", label: "Artikel", icon: Newspaper, href: "/admin/articles" },
    { key: "article_categories", label: "Kategori Artikel", icon: BookMarked, href: "/admin/article-categories" },
    { key: "gallery_items", label: "Galeri Hasil Cetak", icon: Images, href: "/admin/gallery" },
    { key: "faqs", label: "FAQ", icon: HelpCircle, href: "/admin/faqs" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A2340]">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Kelola konten website PADU Printing dari sini.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6B2C91]/10 text-[#6B2C91]">
              <c.icon className="h-6 w-6" />
            </div>
            <p className="mt-4 text-3xl font-bold text-[#1A2340]">
              {loaded ? (counts[c.key] ?? 0) : "..."}
            </p>
            <p className="mt-1 text-sm font-medium text-neutral-600">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-[#1A2340]">Catatan</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-neutral-600">
          <li>
            Data dibaca langsung dari Supabase. Public bisa melihat konten; hanya
            admin yang login bisa mengubahnya.
          </li>
          <li>
            Kolom JSON (gallery, variant, price tier, spek) diisi lewat form
            dengan format yang sesuai.
          </li>
          <li>
            Isi gambar pakai URL (path lokal seperti <code>/logo-icon.png</code>{" "}
            atau URL eksternal).
          </li>
        </ul>
      </div>
    </div>
  );
}
