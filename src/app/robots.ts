import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/event"],
      },
    ],
    sitemap: "https://www.paduprinting.com/sitemap.xml",
  };
}
