"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Slide {
  image: string;
  alt: string;
  link: string;
}

const fallbackSlides: Slide[] = [
  {
    image: "/logo-horizontal.png",
    alt: "PADU Printing - Percetakan Digital",
    link: "/produk",
  },
  {
    image: "/logo-horizontal.png",
    alt: "Banner & Spanduk",
    link: "/produk/banner-spanduk",
  },
  {
    image: "/logo-horizontal.png",
    alt: "Kartu Nama",
    link: "/produk/kartu-nama",
  },
  {
    image: "/logo-horizontal.png",
    alt: "Stiker & Label",
    link: "/produk/stiker-label",
  },
];

export default function HeroSlideshow() {
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (slides.length === 0 ? prev : (prev + 1) % slides.length));
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) =>
      slides.length === 0 ? prev : (prev - 1 + slides.length) % slides.length
    );
  }, [slides.length]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!url) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("hero_slides")
        .select("image, alt, link")
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });
      if (!data || data.length === 0 || cancelled) return;
      const mapped = (data as Slide[]).filter((s) => s.image);
      if (mapped.length > 0) {
        setSlides(mapped);
        setCurrent(0);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full overflow-hidden bg-gray-100">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="w-full shrink-0">
            <Link href={slide.link}>
              <img
                src={slide.image}
                alt={slide.alt}
                className="h-[200px] w-full object-cover sm:h-[300px] md:h-[400px] lg:h-[500px]"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === current ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
