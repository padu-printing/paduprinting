"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { faqs, getFAQCategories } from "@/data/seed";
import { WHATSAPP_PHONE } from "@/lib/seo";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(getFAQCategories()[0] || "");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = getFAQCategories();
  const filteredFAQs = faqs.filter((f) => f.category === activeCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-4">
            <nav className="flex w-full flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setOpenIndex(null);
                  }}
                  className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-[#6B2C91] text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </aside>

          {/* FAQ List */}
          <div className="min-w-0 w-full space-y-3">
            {filteredFAQs.map((faq, idx) => (
              <div
                key={`${activeCategory}-${idx}`}
                className="w-full max-w-full rounded-xl border border-neutral-200 bg-white overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="flex w-full min-h-[56px] items-center justify-between px-6 py-4 text-left"
                >
                  <span className="min-w-0 font-semibold text-[#1A2340] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-200 ${
                      openIndex === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === idx && (
                  <div className="min-w-0 px-6 pb-4 text-neutral-600 leading-relaxed border-t border-neutral-100 pt-4 break-words">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#1A2340]">Masih Ada Pertanyaan?</h2>
          <p className="mt-2 text-neutral-500">
            Hubungi kami langsung untuk mendapatkan jawaban dari tim kami.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Halo Admin PADU Printing, saya punya pertanyaan.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-button mt-6 inline-flex"
          >
            <MessageCircle className="h-5 w-5" />
            Tanya via WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
