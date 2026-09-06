import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { getAllArticles } from "@/lib/data";
import { readTime, formatDate, shortDate } from "@/lib/article";
import ArticleCard from "@/components/article/ArticleCard";
import ArticleFeatured from "@/components/article/ArticleFeatured";
import FinalCtaSection from "@/components/FinalCtaSection";
import type { Metadata } from "next";
import { SITE_URL, BRAND } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Artikel & Tips Percetakan | ${BRAND}`,
  description: `Kumpulan artikel, tips, dan panduan seputar percetakan, desain, branding, dan digital printing dari ${BRAND}.`,
  alternates: { canonical: `${SITE_URL}/artikel` },
  openGraph: {
    title: `Artikel & Tips Percetakan | ${BRAND}`,
    description: `Kumpulan artikel, tips, dan panduan seputar percetakan, desain, branding, dan digital printing dari ${BRAND}.`,
    url: `${SITE_URL}/artikel`,
    siteName: BRAND,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Artikel & Tips Percetakan | ${BRAND}`,
    description: `Kumpulan artikel, tips, dan panduan seputar percetakan, desain, branding, dan digital printing dari ${BRAND}.`,
  },
};

export default async function ArtikelPage() {
  const articles = await getAllArticles();
  const sorted = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const featured = sorted[0];
  const sideArticles = sorted.slice(1, 4);
  const latest = sorted.slice(0, 4);

  return (
    <main>
      <div className="w-full px-4 py-10">
        {/* ===== 3. HERO ARTICLE ===== */}
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
          {/* Left: main */}
          <article className="lg:col-span-2">
            <Link href={`/artikel/${featured.slug}`} className="group block h-full">
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-[14px] bg-[#F3F3F5] sm:min-h-[340px] lg:h-auto">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-[#6B2C91] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {featured.category}
                </span>
                <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7">
                  <h1 className="text-2xl font-extrabold leading-tight text-white transition-colors group-hover:text-[#E9D5F2] sm:text-3xl lg:text-[34px]">
                    {featured.title}
                  </h1>
                  <p className="mt-3 hidden leading-relaxed text-white/85 line-clamp-2 sm:block">
                    {featured.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-white/80">
                    <span>{formatDate(featured.date)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </article>

          {/* Right: side articles */}
          <div className="flex flex-col justify-between divide-y divide-[#F0F0F2]">
            {sideArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/artikel/${a.slug}`}
                className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <img
                  src={a.coverImage}
                  alt={a.title}
                  loading="lazy"
                  className="h-[80px] w-[112px] shrink-0 rounded-[10px] object-cover"
                />
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B2C91]">
                    {a.category}
                  </span>
                  <h3 className="mt-1 text-[15px] font-semibold leading-snug text-[#1A2340] line-clamp-2 group-hover:text-[#6B2C91] transition-colors">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#A1A1AA]">
                    {shortDate(a.date)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== 4. PROMOTIONAL BANNER ===== */}
        <section className="mt-12 overflow-hidden rounded-[14px] bg-[#1A2340] px-6 py-8 sm:px-10 sm:py-9">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                Cetak Berkualitas untuk Bisnis Anda
              </h2>
              <p className="mt-1 text-sm text-[#C7C7D1]">
                Banner &middot; Sticker &middot; Brosur &middot; Merchandise &middot; Packaging
              </p>
            </div>
            <Link
              href="/produk"
              className="inline-flex shrink-0 items-center gap-2 rounded-[10px] bg-white px-6 py-3 text-sm font-bold text-[#1A2340] transition-transform hover:-translate-y-0.5"
            >
              Lihat Produk
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ===== 5. ARTIKEL TERBARU ===== */}
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B2C91]">
                Fresh
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-[#1A2340] sm:text-3xl">
                Artikel Terbaru
              </h2>
            </div>
            <Link
              href="/artikel"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#6B2C91] hover:underline"
            >
              Lihat Semua
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((a) => (
              <ArticleCard
                key={a.slug}
                slug={a.slug}
                title={a.title}
                category={a.category}
                excerpt={a.excerpt}
                coverImage={a.coverImage}
                author={a.author}
                date={shortDate(a.date)}
                readTime={readTime(a.content)}
              />
            ))}
          </div>
        </section>

        {/* ===== 6 & 7. FEATURED + ALL ARTICLES ===== */}
        <section className="mt-14">
          <ArticleFeatured
            all={sorted.map((a) => ({
              slug: a.slug,
              title: a.title,
              category: a.category,
              excerpt: a.excerpt,
              coverImage: a.coverImage,
              author: a.author,
              date: a.date,
              content: a.content,
            }))}
          />
        </section>
      </div>

      {/* ===== 8. FINAL CTA ===== */}
      <FinalCtaSection />
    </main>
  );
}
