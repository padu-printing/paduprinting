"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  Layers,
  PenTool,
  BookOpen,
  Megaphone,
  Briefcase,
  TrendingUp,
  Printer,
  Palette,
} from "lucide-react";
import { shortDate } from "@/lib/article";

interface FeatArticle {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  coverImage: string;
  author: string;
  date: string;
  content?: string;
}

interface CategoryOption {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryOption[] = [
  { name: "Semua", icon: Layers },
  { name: "Tips Desain", icon: PenTool },
  { name: "Panduan", icon: BookOpen },
  { name: "Promotion", icon: Megaphone },
  { name: "Business", icon: Briefcase },
  { name: "Marketing", icon: TrendingUp },
  { name: "Printing", icon: Printer },
  { name: "Design", icon: Palette },
];

const PAGE_SIZE = 9;

export default function ArticleFeatured({ all }: { all: FeatArticle[] }) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === "Semua"
      ? all
      : all.filter((a) => a.category === activeCategory);

  const visibleArticles = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filtered.length) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, filtered.length)
          );
        }
      },
      { rootMargin: "0px 0px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, visibleCount, filtered.length]);

  return (
    <div className="mt-0 flex flex-col gap-8 lg:flex-row">
      {/* Category filter sidebar (like /produk) */}
      <aside className="lg:w-[260px] lg:shrink-0">
        <div className="lg:sticky lg:top-[76px] lg:max-h-[calc(100vh-100px)] lg:overflow-auto">
          <ul className="space-y-1 rounded-xl bg-[#6B2C91] p-2">
            {CATEGORIES.map((c) => {
              const isActive = activeCategory === c.name;
              const Icon = c.icon;
              return (
                <li key={c.name}>
                  <button
                    type="button"
                    onClick={() => setActiveCategory(c.name)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-white font-semibold text-[#6B2C91]"
                        : "text-white/90 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {c.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* All articles */}
      <div className="flex-1">
        {filtered.length === 0 ? (
          <p className="text-sm text-[#A1A1AA]">Belum ada artikel di kategori ini.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visibleArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/artikel/${a.slug}`}
                className="group flex flex-col overflow-hidden rounded-[14px] bg-white ring-1 ring-[#EEEEF0] transition-shadow hover:shadow-[0_10px_30px_rgba(17,24,39,0.08)]"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#F3F3F5]">
                  <img
                    src={a.coverImage}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B2C91]">
                    {a.category}
                  </span>
                  <h4 className="mt-1.5 font-bold leading-snug text-[#1A2340] line-clamp-2 transition-colors group-hover:text-[#6B2C91]">
                    {a.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#52525B] line-clamp-2">
                    {a.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-4 text-[10px] text-[#A1A1AA] min-[720px]:text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {shortDate(a.date)}
                    </span>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#6B2C91]">
                    Baca
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
              ))}
            </div>

            {hasMore ? (
              <div ref={sentinelRef} className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#6B2C91] border-t-transparent" />
              </div>
            ) : (
              filtered.length > PAGE_SIZE && (
                <p className="py-8 text-center text-sm text-neutral-400">
                  Semua artikel sudah ditampilkan.
                </p>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}