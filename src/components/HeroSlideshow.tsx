"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    alt: "PADU Printing - Percetakan Digital",
    link: "/produk",
  },
  {
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    alt: "Banner & Spanduk",
    link: "/produk/banner-spanduk",
  },
  {
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    alt: "Kartu Nama",
    link: "/produk/kartu-nama",
  },
  {
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    alt: "Stiker & Label",
    link: "/produk/stiker-label",
  },
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
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
                className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
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
