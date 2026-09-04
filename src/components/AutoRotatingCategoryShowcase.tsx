"use client";

import { useState, useEffect } from "react";
import CategoryShowcaseBlock from "./CategoryShowcaseBlock";
import { useContent } from "@/data/content";

export default function AutoRotatingCategoryShowcase() {
  const { content } = useContent();
  const { categories, products } = content;
  const activeCategories = categories;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeCategories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeCategories.length]);

  const category = activeCategories[currentIndex];
  const categoryProducts = products
    .filter((p) => p.categorySlug === category.slug)
    .slice(0, 6);

  return (
    <div className="relative my-16">
      <CategoryShowcaseBlock
        category={{
          name: category.name,
          slug: category.slug,
          bannerImage: category.image,
          bannerBackgroundColor: undefined,
        }}
        products={categoryProducts.map((p) => ({
          id: p.slug,
          name: p.name,
          slug: p.slug,
          image: p.image,
          categoryName: category.name,
          priceFrom: p.basePrice,
          clickCount: p.clickCount,
        }))}
      />

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {activeCategories.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              i === currentIndex ? "bg-[#6B2C91]" : "bg-gray-300"
            }`}
            aria-label={`Go to category ${activeCategories[i].name}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + activeCategories.length) % activeCategories.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
        aria-label="Previous category"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % activeCategories.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
        aria-label="Next category"
      >
        ›
      </button>
    </div>
  );
}
