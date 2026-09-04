"use client";

import { useState } from "react";
import { Package, Megaphone, CreditCard, Tag, Gift, Mail, Shirt, Coffee } from "lucide-react";
import { useContent } from "@/data/content";
import ProductInfiniteGrid from "@/components/ProductInfiniteGrid";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Megaphone,
  CreditCard,
  Tag,
  Gift,
  Mail,
  Package,
  Shirt,
  Coffee,
};

export default function ProdukPage() {
  const { content } = useContent();
  const { categories, products } = content;
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProducts = products.filter(
    (p) => activeCategory === "all" || p.categorySlug === activeCategory
  );

  return (
    <section className="w-full px-4 py-10">
      <div className="mt-0 flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-[260px] lg:shrink-0">
          <div className="lg:sticky lg:top-[76px]">
            <ul className="space-y-1 rounded-xl bg-[#6B2C91] p-2">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    activeCategory === "all"
                      ? "bg-white text-[#6B2C91]"
                      : "text-white/90 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  <Package className="h-4 w-4" />
                  Semua Produk
                </button>
              </li>
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon] || Package;
                const isActive = activeCategory === cat.slug;
                return (
                  <li key={cat.slug}>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(cat.slug)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-white font-semibold text-[#6B2C91]"
                          : "text-white/90 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {cat.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <ProductInfiniteGrid
            key={activeCategory}
            products={filteredProducts.map((p) => ({
              slug: p.slug,
              name: p.name,
              categorySlug: p.categorySlug,
              image: p.image,
              basePrice: p.basePrice,
              clickCount: p.clickCount,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
