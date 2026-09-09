import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getAllCategories, getAllProducts, getAllArticles } from "@/lib/data";

function lastModified(date?: string, fallback?: string): string {
  return (date && date.trim()) || fallback || new Date().toISOString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getAllCategories();
  const products = await getAllProducts();
  const articles = await getAllArticles();
  const generatedAt = new Date().toISOString();

  const home = {
    url: `${SITE_URL}/`,
    lastModified: generatedAt,
    changeFrequency: "weekly" as const,
    priority: 1,
  };

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/produk`,
      lastModified: generatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/artikel`,
      lastModified: generatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/profil`,
      lastModified: generatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: generatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/produk/${cat.slug}`,
    lastModified: lastModified(cat.updatedAt, generatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/produk/${p.slug}`,
    lastModified: lastModified(p.updatedAt, generatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/artikel/${a.slug}`,
    lastModified: lastModified(a.updatedAt, a.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [home, ...staticPages, ...categoryPages, ...productPages, ...articlePages];
}