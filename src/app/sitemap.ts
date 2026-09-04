import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { categories, products, articles } from "@/data/seed";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const home = {
    url: `${SITE_URL}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 1,
  };

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/produk`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/artikel`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/profil`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/produk/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/produk/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/artikel/${a.slug}`,
    lastModified: a.date,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [home, ...staticPages, ...categoryPages, ...productPages, ...articlePages];
}
