"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import * as seed from "@/data/seed";

export interface ContentData {
  categories: seed.Category[];
  products: seed.Product[];
  articles: seed.Article[];
  faqs: seed.FAQ[];
  settings: Record<string, string>;
  isDatabase: boolean;
}

export const EMPTY_CONTENT: ContentData = {
  categories: [],
  products: [],
  articles: [],
  faqs: [],
  settings: {},
  isDatabase: false,
};

// Map snake_case DB row -> camelCase seed shape
function mapCategory(row: any): seed.Category {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    icon: row.icon ?? "",
    image: row.image ?? "",
  };
}

function mapProduct(row: any): seed.Product {
  return {
    slug: row.slug,
    name: row.name,
    categorySlug: row.category_slug,
    description: row.description ?? "",
    shortDescription: row.short_description ?? "",
    image: row.image ?? "",
    gallery: Array.isArray(row.gallery) ? row.gallery : row.gallery ?? [],
    basePrice: Number(row.base_price ?? 0),
    productionTime: row.production_time ?? "",
    variantGroups: Array.isArray(row.variant_groups) ? row.variant_groups : [],
    priceTiers: Array.isArray(row.price_tiers) ? row.price_tiers : [],
    specifications: Array.isArray(row.specifications) ? row.specifications : [],
    isBestSeller: !!row.is_best_seller,
    clickCount: Number(row.click_count ?? 0),
  };
}

function mapArticle(row: any): seed.Article {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    coverImage: row.cover_image ?? "",
    date: row.date ?? "",
    author: row.author ?? "",
    category: row.category ?? "",
  };
}

function mapFaq(row: any): seed.FAQ {
  return {
    question: row.question,
    answer: row.answer ?? "",
    category: row.category ?? "Umum",
  };
}

async function loadFromDatabase(): Promise<ContentData | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;

  const supabase = createClient();

  const [c, p, a, f, s] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }).order("name"),
    supabase.from("products").select("*").order("name", { ascending: true }),
    supabase.from("articles").select("*").order("date", { ascending: false }),
    supabase.from("faqs").select("*").order("sort_order", { ascending: true }),
    supabase.from("site_settings").select("*"),
  ]);

  if (c.error && p.error) return null;

  const settings: Record<string, string> = {};
  (s.data ?? []).forEach((r: any) => (settings[r.key] = r.value));

  const hasProducts = !p.error && p.data && p.data.length > 0;

  return {
    categories: c.data ? c.data.map(mapCategory) : [],
    products: p.data ? p.data.map(mapProduct) : [],
    articles: a.data ? a.data.map(mapArticle) : [],
    faqs: f.data ? f.data.map(mapFaq) : [],
    settings,
    isDatabase: hasProducts,
  };
}

interface ContentContextValue {
  content: ContentData;
  reload: () => Promise<void>;
}

function seedContent(): ContentData {
  return {
    categories: seed.categories,
    products: seed.products,
    articles: seed.articles,
    faqs: seed.faqs,
    settings: {},
    isDatabase: false,
  };
}

const ContentContext = createContext<ContentContextValue>({
  content: seedContent(),
  reload: async () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentData>(seedContent);

  async function reload() {
    try {
      const db = await loadFromDatabase();
      if (db) {
        // Only use DB content if at least one source table returned data,
        // otherwise keep seed fallback.
        const hasAny =
          db.categories.length > 0 ||
          db.products.length > 0 ||
          db.articles.length > 0 ||
          db.faqs.length > 0;
        if (hasAny) {
          setContent(db);
        }
      }
    } catch {
      // keep seed fallback
    }
  }

  useEffect(() => {
    reload();
  }, []);

  return (
    <ContentContext.Provider value={{ content, reload }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
