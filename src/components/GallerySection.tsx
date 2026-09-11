"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface GalleryItem {
  src: string;
  title: string;
  tall?: boolean;
}

interface GalleryRow {
  image: string;
  title: string;
  tall: boolean;
}

const skeletonBoxes: { tall: boolean }[] = Array.from({ length: 10 }, (_, i) => ({
  tall: i % 4 === 0,
}));

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!url) {
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase
        .from("gallery_items")
        .select("image, title, tall")
        .order("id", { ascending: true });
      if (cancelled) return;
      if (data && data.length > 0) {
        const mapped = (data as GalleryRow[])
          .filter((r) => r.image)
          .map((r) => ({ src: r.image, title: r.title, tall: r.tall }));
        if (mapped.length > 0) setItems(mapped);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-padu-navy">Galeri Hasil Cetak</h2>
          <p className="mt-2 text-neutral-500">
            Beberapa hasil karya kami untuk pelanggan
          </p>
        </div>

        {/* Masonry layout */}
        <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-5 [column-fill:_balance]">
          {loading
            ? skeletonBoxes.map((box, idx) => (
                <div key={idx} className="mb-4 break-inside-avoid">
                  <div
                    className={`w-full animate-pulse rounded-xl bg-neutral-200 ${
                      box.tall ? "aspect-[4/5]" : "aspect-square"
                    }`}
                  />
                </div>
              ))
            : items.map((item, idx) => (
                <div key={idx} className="mb-4 break-inside-avoid">
                  <div className="group relative overflow-hidden rounded-xl">
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                        item.tall ? "aspect-[4/5]" : "aspect-square"
                      }`}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="p-3 text-sm font-medium text-white">{item.title}</p>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}