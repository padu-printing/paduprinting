import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id-ID" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
