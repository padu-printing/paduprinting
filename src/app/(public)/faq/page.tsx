import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { getAllFaqs } from "@/lib/data";
import { SITE_URL, BRAND, LOGO_URL, getFAQSchema } from "@/lib/seo";
import { toJsonLd } from "@/lib/json-ld";
import FinalCtaSection from "@/components/FinalCtaSection";

export async function generateMetadata(): Promise<Metadata> {
  const description =
    `Pertanyaan yang sering ditanyakan tentang layanan percetakan dan digital printing di ${BRAND}: harga, proses order, waktu pengerjaan, pengiriman, dan lain-lain.`;
  return {
    title: `FAQ | ${BRAND}`,
    description,
    alternates: { canonical: `${SITE_URL}/faq` },
    openGraph: {
      title: `FAQ | ${BRAND}`,
      description,
      url: `${SITE_URL}/faq`,
      siteName: BRAND,
      type: "website",
      images: [LOGO_URL],
    },
    twitter: {
      card: "summary_large_image",
      title: `FAQ | ${BRAND}`,
      description,
      images: [LOGO_URL],
    },
  };
}

export default async function FAQPage() {
  const faqs = await getAllFaqs();

  const faqSchema = {
    "@context": "https://schema.org",
    ...getFAQSchema(
      faqs.map((f) => ({ question: f.question, answer: f.answer }))
    ),
  };

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const key = faq.category || "Umum";
    if (!acc[key]) acc[key] = [];
    acc[key].push(faq);
    return acc;
  }, {});

  const groupOrder = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b, "id")
  );

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(faqSchema) }}
      />

      <section className="bg-gradient-to-br from-[#1A2340] to-[#6B2C91] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E9D5F2]">
            FAQ
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Pertanyaan yang Sering Ditanyakan
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-neutral-300">
            Jawaban seputar layanan percetakan PADU Printing. Tidak menemukan
            jawaban? Hubungi kami dan tim akan membantu.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        {faqs.length === 0 ? (
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-8 text-center">
            <p className="text-neutral-500">Belum ada pertanyaan yang tersedia.</p>
          </div>
        ) : (
          groupOrder.map((category) => (
            <div key={category} className="mb-10">
              <h2 className="mb-4 text-lg font-bold text-[#1A2340]">
                {category}
              </h2>
              <div className="space-y-3">
                {grouped[category].map((faq, i) => (
                  <details
                    key={`${category}-${i}`}
                    className="group rounded-xl border border-[#E4E4E7] bg-white shadow-sm open:shadow-md transition-shadow"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-[#1A2340]">
                      {faq.question}
                      <ChevronDown className="h-5 w-5 shrink-0 text-[#6B2C91] transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="border-t border-[#F0F0F2] px-5 py-4 text-[15px] leading-relaxed text-neutral-600 whitespace-pre-wrap">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <FinalCtaSection />
    </main>
  );
}