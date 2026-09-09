"use client";

import { useRef } from "react";
import Link from "next/link";
import { Eye, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductImage from "@/components/ProductImage";

export interface FeaturedProduct {
  slug: string;
  name: string;
  image: string;
  basePrice: number;
  clickCount: number;
}

function ProductCard({ product }: { product: FeaturedProduct }) {
  return (
    <Link
      href={`/produk/${product.slug}`}
      className="card-hover block w-full rounded-xl bg-white border border-neutral-200 overflow-hidden"
    >
      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
        <ProductImage src={product.image} alt={product.name} iconClassName="h-10 w-10" />
      </div>
      <div className="p-3">
        <h3 className="min-h-[2.5rem] text-sm font-bold text-padu-navy line-clamp-2">{product.name}</h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-neutral-500">Harga Mulai dari</span>
          <div className="flex items-center gap-1 text-xs text-neutral-400">
            <Eye className="h-3 w-3" />
            <span>{product.clickCount.toLocaleString("id-ID")}</span>
          </div>
        </div>
        <div className="mt-2 w-full rounded-lg bg-[#6B2C91] py-1.5 text-center text-xs font-bold text-white">
          Rp {product.basePrice.toLocaleString("id-ID")}
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedProductsCarousel({
  products,
}: {
  products: FeaturedProduct[];
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollProducts = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = Math.round(
        (scrollContainerRef.current.querySelector('[class*="basis-"]') as HTMLElement | null)?.offsetWidth ?? 220
      );
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-padu-navy">Produk Pilihan</h2>
          </div>
          <Link href="/produk" className="hidden sm:flex items-center gap-1 text-sm text-[#6B2C91] hover:text-[#5A2478] font-semibold transition-colors">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="relative mt-10">
          <button
            onClick={() => scrollProducts('left')}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-padu-navy" />
          </button>
          <button
            onClick={() => scrollProducts('right')}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-padu-navy" />
          </button>
          <div
            ref={scrollContainerRef}
            className="-mx-3 flex overflow-x-auto px-3 pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {products.map((product) => (
              <div key={product.slug} className="shrink-0 basis-[80%] snap-start px-3 sm:basis-[48%] lg:basis-[24%] xl:basis-[20%]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}