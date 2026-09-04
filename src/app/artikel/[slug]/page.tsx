import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, User, Clock, MessageCircle } from "lucide-react";
import { articles, getArticleBySlug } from "@/data/seed";
import { readTime, shortDate, extractHeadings } from "@/lib/article";
import ArticleBody from "@/components/article/ArticleBody";
import ArticleToc from "@/components/article/ArticleToc";
import ArticleCard from "@/components/article/ArticleCard";
import type { Metadata } from "next";

const SITE = "https://paduprinting.example.com";

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Artikel Tidak Ditemukan" };
  const url = `${SITE}/artikel/${article.slug}`;
  return {
    title: `${article.title} - PADU Printing`,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url,
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
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const headings = extractHeadings(article.content);
  const related = articles
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  const url = `${SITE}/artikel/${article.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: article.title,
        description: article.excerpt,
        image: article.coverImage,
        author: { "@type": "Organization", name: article.author },
        datePublished: article.date,
        dateModified: article.date,
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Artikel", item: `${SITE}/artikel` },
          { "@type": "ListItem", position: 3, name: article.category, item: url },
        ],
      },
    ],
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

      {/* Article header */}
      <div className="mx-auto max-w-[760px] px-4 pt-10 sm:px-6 lg:px-8">
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
      </div>

      {/* Hero image */}
      <div className="mx-auto max-w-[980px] px-4 pt-8 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[14px] bg-[#F3F3F5]">
          <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Content + TOC */}
      <div className="mx-auto max-w-[980px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] lg:items-start">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <ArticleToc headings={headings} />
          </aside>

          <article className="min-w-0">
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

            {/* CTA */}
            <section className="mt-8 rounded-[14px] bg-[#1A2340] px-6 py-8 text-center">
              <h2 className="text-xl font-extrabold text-white">Butuh Bantuan Percetakan?</h2>
              <p className="mt-1 text-sm text-[#C7C7D1]">
                Konsultasikan kebutuhan Anda langsung dengan tim kami.
              </p>
              <a
                href="https://wa.me/6282123496469"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-[10px] bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1EBE57]"
              >
                <MessageCircle className="h-4 w-4" />
                Chat via WhatsApp
              </a>
            </section>
          </article>
        </div>
      </div>

      {/* Related */}
      <section className="border-t border-[#EEEEF0] bg-[#FBFBFB]">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-[#1A2340]">Artikel Lainnya</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
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
                compact
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}