import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Produk Percetakan & Digital Printing | PADU Printing`,
  description: `Lihat berbagai produk percetakan dan digital printing dari PADU Printing: banner, kartu nama, stiker, souvenir promosi, undangan, packaging, kaos, dan mug custom.`,
  alternates: { canonical: `https://www.paduprinting.com/produk` },
  openGraph: {
    title: `Produk Percetakan & Digital Printing | PADU Printing`,
    description: `Lihat berbagai produk percetakan dan digital printing dari PADU Printing.`,
    url: `https://www.paduprinting.com/produk`,
    siteName: "PADU Printing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Produk Percetakan & Digital Printing | PADU Printing`,
    description: `Lihat berbagai produk percetakan dan digital printing dari PADU Printing.`,
  },
};

export default function ProdukLayout({ children }: { children: React.ReactNode }) {
  return children;
}
