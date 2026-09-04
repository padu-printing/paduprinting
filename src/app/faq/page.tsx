import { Metadata } from "next";
import FinalCtaSection from "@/components/FinalCtaSection";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Pertanyaan yang sering ditanyakan tentang layanan percetakan di PADU Printing.",
  alternates: { canonical: "https://www.paduprinting.com/faq" },
};

export default function FAQPage() {
  return <FinalCtaSection />;
}
