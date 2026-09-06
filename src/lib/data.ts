import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import * as seed from "@/data/seed";

type Category = seed.Category;
type Product = seed.Product;
type Article = seed.Article;
type FAQ = seed.FAQ;

function mapCategory(row: Record<string, unknown>): Category {
  return {
    slug: row.slug as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    icon: (row.icon as string) ?? "",
    image: (row.image as string) ?? "",
  };
}

function mapProduct(row: Record<string, unknown>): Product {
  const gallery = row.gallery;
  const variants = row.variant_groups;
  const tiers = row.price_tiers;
  const specs = row.specifications;

  return {
    slug: row.slug as string,
    name: row.name as string,
    categorySlug: row.category_slug as string,
    description: (row.description as string) ?? "",
    shortDescription: (row.short_description as string) ?? "",
    image: (row.image as string) ?? "",
    gallery: Array.isArray(gallery) ? gallery : [],
    basePrice: Number(row.base_price ?? 0),
    productionTime: (row.production_time as string) ?? "",
    variantGroups: Array.isArray(variants)
      ? (variants as seed.VariantGroup[])
      : [],
    priceTiers: Array.isArray(tiers) ? (tiers as seed.PriceTier[]) : [],
    specifications: Array.isArray(specs)
      ? (specs as { label: string; value: string }[])
      : [],
    isBestSeller: !!row.is_best_seller,
    clickCount: Number(row.click_count ?? 0),
    metaTitle: (row.meta_title as string) ?? "",
    metaDescription: (row.meta_description as string) ?? "",
    focusKeyword: (row.focus_keyword as string) ?? "",
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    seoScore: Number(row.seo_score ?? 0),
  };
}

function mapArticle(row: Record<string, unknown>): Article {
  return {
    slug: row.slug as string,
    title: row.title as string,
    excerpt: (row.excerpt as string) ?? "",
    content: (row.content as string) ?? "",
    coverImage: (row.cover_image as string) ?? "",
    date: (row.date as string) ?? "",
    author: (row.author as string) ?? "",
    category: (row.category as string) ?? "",
    metaTitle: (row.meta_title as string) ?? "",
    metaDescription: (row.meta_description as string) ?? "",
    focusKeyword: (row.focus_keyword as string) ?? "",
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    seoScore: Number(row.seo_score ?? 0),
  };
}

function mapFaq(row: Record<string, unknown>): FAQ {
  return {
    question: row.question as string,
    answer: (row.answer as string) ?? "",
    category: (row.category as string) ?? "Umum",
  };
}

type DataBundle = {
  categories: Category[];
  products: Product[];
  articles: Article[];
  faqs: FAQ[];
};

const loadAll = cache(async (): Promise<DataBundle> => {
  const seedBundle: DataBundle = {
    categories: seed.categories,
    products: seed.products,
    articles: seed.articles,
    faqs: seed.faqs,
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return seedBundle;
  }

  try {
    const supabase = await createClient();

    const [catRes, prodRes, artRes, faqRes] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("name"),
      supabase.from("products").select("*").order("name"),
      supabase.from("articles").select("*").order("date", { ascending: false }),
      supabase
        .from("faqs")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

    const categories = catRes.data ? catRes.data.map(mapCategory) : [];
    const products = prodRes.data ? prodRes.data.map(mapProduct) : [];
    const articles = artRes.data ? artRes.data.map(mapArticle) : [];
    const faqs = faqRes.data ? faqRes.data.map(mapFaq) : [];

    if (categories.length > 0 || products.length > 0) {
      return { categories, products, articles, faqs };
    }
  } catch {
    // fall back to seed data
  }

  return seedBundle;
});

export async function getAllCategories(): Promise<Category[]> {
  return (await loadAll()).categories;
}

export async function getAllProducts(): Promise<Product[]> {
  return (await loadAll()).products;
}

export async function getAllArticles(): Promise<Article[]> {
  return (await loadAll()).articles;
}

export async function getAllFaqs(): Promise<FAQ[]> {
  return (await loadAll()).faqs;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const cats = await getAllCategories();
  return cats.find((c) => c.slug === slug);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.categorySlug === categorySlug);
}

export async function getBestSellers(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.isBestSeller);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getAllArticles();
  return articles.find((a) => a.slug === slug);
}

export async function getRelatedArticles(
  currentSlug: string,
  _category: string,
  limit = 3
): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles
    .filter((a) => a.slug !== currentSlug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export async function getFAQCategories(): Promise<string[]> {
  const faqs = await getAllFaqs();
  const cats = new Set(faqs.map((f) => f.category));
  return [...cats];
}
