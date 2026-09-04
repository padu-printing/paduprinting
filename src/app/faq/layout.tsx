import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `FAQ - Pertanyaan yang Sering Ditanyakan | PADU Printing`,
  description: `Temukan jawaban atas pertanyaan yang sering ditanyakan tentang layanan percetakan, pemesanan, pembayaran, pengiriman, dan desain di PADU Printing.`,
  alternates: { canonical: `https://www.paduprinting.com/faq` },
  openGraph: {
    title: `FAQ - Pertanyaan yang Sering Ditanyakan | PADU Printing`,
    description: `Temukan jawaban atas pertanyaan yang sering ditanyakan tentang layanan percetakan di PADU Printing.`,
    url: `https://www.paduprinting.com/faq`,
    siteName: "PADU Printing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `FAQ - Pertanyaan yang Sering Ditanyakan | PADU Printing`,
    description: `Temukan jawaban atas pertanyaan yang sering ditanyakan tentang layanan percetakan di PADU Printing.`,
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
