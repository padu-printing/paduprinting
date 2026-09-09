import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { toJsonLd } from "@/lib/json-ld";
import {
  SITE_URL,
  BRAND,
  getOrganizationSchema,
  getLocalBusinessSchema,
  getWebSiteSchema,
} from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orgSchema = getOrganizationSchema();
const bizSchema = getLocalBusinessSchema();
const webSchema = getWebSiteSchema();

const rootSchema = {
  "@context": "https://schema.org",
  "@graph": [orgSchema, bizSchema, webSchema],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND} | Percetakan & Digital Printing Jakarta Timur`,
    template: `%s | ${BRAND}`,
  },
  description:
    `${BRAND} melayani kebutuhan percetakan dan digital printing untuk bisnis, perusahaan, event, promosi, dan kebutuhan personal di Jakarta Timur.`,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: BRAND,
    title: `${BRAND} | Percetakan & Digital Printing Jakarta Timur`,
    description:
      `${BRAND} melayani kebutuhan percetakan dan digital printing untuk bisnis, perusahaan, event, promosi, dan kebutuhan personal di Jakarta Timur.`,
    images: [
      {
        url: `${SITE_URL}/logo-icon.png`,
        width: 512,
        height: 512,
        alt: BRAND,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND} | Percetakan & Digital Printing Jakarta Timur`,
    description:
      `${BRAND} melayani kebutuhan percetakan dan digital printing untuk bisnis, perusahaan, event, promosi, dan kebutuhan personal di Jakarta Timur.`,
    images: [`${SITE_URL}/logo-icon.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id-ID" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(rootSchema) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var V="2026-09-08-v1";var k="padu-cc";if(sessionStorage.getItem(k)!==V){if("serviceWorker" in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister();});}).catch(function(){});}if("caches" in window){caches.keys().then(function(ns){ns.forEach(function(n){caches.delete(n);});}).catch(function(){});}sessionStorage.setItem(k,V);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
