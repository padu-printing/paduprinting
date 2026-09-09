import type { Metadata } from "next";
import { SITE_URL, BRAND, LOGO_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Produk Percetakan & Digital Printing | PADU Printing`,
  description: `Lihat berbagai produk percetakan dan digital printing dari PADU Printing: banner, kartu nama, stiker, souvenir promosi, undangan, packaging, kaos, dan mug custom.`,
  alternates: { canonical: `${SITE_URL}/produk` },
  openGraph: {
    title: `Produk Percetakan & Digital Printing | PADU Printing`,
    description: `Lihat berbagai produk percetakan dan digital printing dari PADU Printing.`,
    url: `${SITE_URL}/produk`,
    siteName: BRAND,
    type: "website",
    images: [LOGO_URL],
  },
  twitter: {
    card: "summary_large_image",
    title: `Produk Percetakan & Digital Printing | PADU Printing`,
    description: `Lihat berbagai produk percetakan dan digital printing dari PADU Printing.`,
    images: [LOGO_URL],
  },
};

export default function ProdukLayout({ children }: { children: React.ReactNode }) {
  return children;
}
