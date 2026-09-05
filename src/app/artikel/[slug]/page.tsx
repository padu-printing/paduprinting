import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Calendar, ChevronRight, Clock, Tag, User } from "lucide-react";
import { getAllArticles, getAllProducts, getArticleBySlug } from "@/lib/data";
import { readTime, shortDate, extractHeadings } from "@/lib/article";
import ArticleBody from "@/components/article/ArticleBody";
import ArticleToc from "@/components/article/ArticleToc";
import ProductImage from "@/components/ProductImage";
import FinalCtaSection from "@/components/FinalCtaSection";
import type { Product } from "@/data/seed";
import type { Metadata } from "next";
import {
  SITE_URL,
  BRAND,
  getBlogPostingSchema,
  getBreadcrumbSchema,
  getOrganizationSchema,
} from "@/lib/seo";

function ProductRecCard({ product }: { product: Product }) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.basePrice);

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[14px] bg-white ring-1 ring-[#EEEEF0] transition-shadow hover:shadow-[0_10px_30px_rgba(17,24,39,0.08)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F3F5]">
        <ProductImage src={product.image} alt={product.name} iconClassName="h-10 w-10" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold leading-snug text-[#1A2340] transition-colors group-hover:text-[#6B2C91] line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-[#52525B] line-clamp-2">
          {product.shortDescription}
        </p>
        <div className="mt-3 flex items-center justify-between pt-1">
          <span className="text-sm font-bold text-[#6B2C91]">
            mulai dari {formattedPrice}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B2C91]">
            Detail
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Artikel Tidak Ditemukan" };
  const url = `${SITE_URL}/artikel/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url,
      siteName: BRAND,
      images: [{ url: article.coverImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
    },
  };
}

export default async function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const headings = extractHeadings(article.content);
  const allArticles = await getAllArticles();
  const recommended = allArticles
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);
  const categories = [...new Set(allArticles.map((a) => a.category))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "id"));
  const allProducts = await getAllProducts();
  const recommendedProducts = [...allProducts]
    .sort((a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0))
    .slice(0, 4);
  const url = `${SITE_URL}/artikel/${article.slug}`;
  const orgSchema = getOrganizationSchema();

  const blogSchema = getBlogPostingSchema({
    title: article.title,
    description: article.excerpt,
    url,
    image: article.coverImage,
    datePublished: article.date,
    dateModified: article.date,
    author: article.author,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Artikel", url: `${SITE_URL}/artikel` },
    { name: article.title, url },
  ]);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [blogSchema, breadcrumbSchema, orgSchema],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-[#EEEEF0] bg-white">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto flex h-12 max-w-[1280px] items-center gap-2 px-4 text-sm text-[#71717A] sm:px-6 lg:px-8"
        >
          <Link href="/" className="hover:text-[#6B2C91]">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#C7C7D1]" />
          <Link href="/artikel" className="hover:text-[#6B2C91]">Artikel</Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#C7C7D1]" />
          <span className="truncate font-medium text-[#1A2340]">{article.title}</span>
        </nav>
      </div>

      {/* Article: konten kiri + sidebar kanan */}
      <div className="mx-auto max-w-[1200px] px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start xl:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0">
            <header className="text-center">
              <span className="inline-block rounded-full bg-[#6B2C91]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#6B2C91]">
                {article.category}
              </span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#1A2340] sm:text-4xl">
                {article.title}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#52525B]">
                {article.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[#71717A]">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-[#6B2C91]" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#6B2C91]" />
                  {shortDate(article.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#6B2C91]" />
                  {readTime(article.content)} mnt baca
                </span>
              </div>
            </header>

            {article.coverImage && article.coverImage !== "/logo-icon.png" && (
              <div className="mt-8">
                <div className="relative aspect-[16/9] overflow-hidden rounded-[14px] bg-[#F3F3F5]">
                  <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover" />
                </div>
              </div>
            )}

            <div className="mt-10">
              <ArticleBody content={article.content} headings={headings} />

              {/* Tags / share */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#EEEEF0] pt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[#1A2340]">Kategori:</span>
                  <span className="rounded-full bg-[#6B2C91]/10 px-3 py-1 text-xs font-semibold text-[#6B2C91]">
                    {article.category}
                  </span>
                </div>
              </div>
            </div>
          </article>

          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <ArticleToc headings={headings} />

            {/* Sidebar kategori */}
            <div className="rounded-[14px] border border-[#EEEEF0] bg-white p-5">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-[#1A2340]">
                <Tag className="h-4 w-4 text-[#6B2C91]" />
                Kategori
              </h2>
              <nav className="mt-4 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href="/artikel"
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      cat === article.category
                        ? "bg-[#6B2C91] text-white"
                        : "bg-[#F3F3F5] text-[#52525B] hover:bg-[#E9D5F2] hover:text-[#6B2C91]"
                    }`}
                  >
                    {cat}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Artikel rekomendasi */}
            <div className="rounded-[14px] border border-[#EEEEF0] bg-white p-5">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-[#1A2340]">
                <BookOpen className="h-4 w-4 text-[#6B2C91]" />
                Artikel Rekomendasi
              </h2>
              <div className="mt-4 space-y-4">
                {recommended.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/artikel/${a.slug}`}
                    className="group flex items-start gap-3"
                  >
                    <span className="relative h-14 w-[76px] shrink-0 overflow-hidden rounded-[8px] bg-[#F3F3F5]">
                      <img
                        src={a.coverImage}
                        alt={a.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#6B2C91]">
                        {a.category}
                      </span>
                      <span className="mt-0.5 block text-[13px] font-semibold leading-snug text-[#1A2340] transition-colors group-hover:text-[#6B2C91] line-clamp-2">
                        {a.title}
                      </span>
                      <span className="mt-1 block text-xs text-[#A1A1AA]">
                        {shortDate(a.date)} &middot; {readTime(a.content)} mnt
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Produk rekomendasi */}
      <section className="border-t border-[#EEEEF0] bg-[#FBFBFB]">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B2C91]">
                Produk
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-[#1A2340]">
                Produk Rekomendasi
              </h2>
            </div>
            <Link
              href="/produk"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#6B2C91] hover:underline"
            >
              Lihat Semua
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedProducts.map((p) => (
              <ProductRecCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <FinalCtaSection />
    </>
  );
}
