"use client";
import { useRef } from "react";
import Link from "next/link";
import {
  Truck,
  Shield,
  Clock,
  Headphones,
  Eye,
  ArrowRight,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { categories as seedCategories, products as seedProducts } from "@/data/seed";
import { useContent } from "@/data/content";
import HeroSlideshow from "@/components/HeroSlideshow";
import AutoRotatingCategoryShowcase from "@/components/AutoRotatingCategoryShowcase";
import CaraOrderSection from "@/components/CaraOrderSection";
import GallerySection from "@/components/GallerySection";
import FinalCtaSection from "@/components/FinalCtaSection";
import ProductImage from "@/components/ProductImage";

function CategoryCard({ category }: { category: typeof seedCategories[0] }) {
  return (
    <Link href={`/produk/${category.slug}`} className="card-hover block rounded-xl bg-white border border-neutral-200 p-6 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-padu-orange/10 text-padu-orange">
        <Package className="h-8 w-8" />
      </div>
      <h3 className="font-semibold text-padu-navy">{category.name}</h3>
      <p className="mt-1 text-sm text-neutral-500 line-clamp-2">{category.description}</p>
    </Link>
  );
}

function ProductCard({ product }: { product: typeof seedProducts[0] }) {
  return (
    <Link href={`/produk/${product.slug}`} className="card-hover block min-w-[200px] max-w-[220px] rounded-xl bg-white border border-neutral-200 overflow-hidden">
      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
        <ProductImage src={product.image} alt={product.name} iconClassName="h-10 w-10" />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-bold text-padu-navy line-clamp-1">{product.name}</h3>
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

export default function Home() {
  const { content } = useContent();
  const { categories, products } = content;
  const bestSellers = products.filter((p) => p.isBestSeller);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollProducts = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 220;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Hero Slideshow */}
      <HeroSlideshow />

      {/* Trust Bar */}
      <section className="bg-[#6B2C91]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Truck, label: "Pengiriman ke Seluruh Indonesia", sublabel: "Via ekspedisi terpercaya" },
              { icon: Shield, label: "Garansi Cetak Ulang", sublabel: "Jika terjadi kesalahan" },
              { icon: Clock, label: "Proses Cepat", sublabel: "1-7 hari kerja" },
              { icon: Headphones, label: "Konsultasi Gratis", sublabel: "Tim kami siap membantu" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-xl p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-neutral-400">{item.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* Best Seller */}
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
            <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto pb-4 snap-x scroll-smooth" style={{ scrollbarWidth: 'none' }}>
              {bestSellers.map((product) => (
                <div key={product.slug} className="snap-start shrink-0 w-[220px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Auto-Rotating Category Showcase */}
      <AutoRotatingCategoryShowcase />

      {/* Cara Order */}
      <CaraOrderSection />

      {/* Gallery */}
      <GallerySection />

      {/* Final CTA */}
      <FinalCtaSection />
    </>
  );
}
