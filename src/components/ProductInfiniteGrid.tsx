"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import ProductImage from "@/components/ProductImage";

interface GridProduct {
  slug: string;
  name: string;
  categorySlug: string;
  image: string;
  basePrice: number;
  clickCount: number;
}

const PAGE_SIZE = 10;

export default function ProductInfiniteGrid({ products }: { products: GridProduct[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, products.length));
        }
      },
      { rootMargin: "0px 0px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, products.length]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visibleProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      {hasMore ? (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#6B2C91] border-t-transparent" />
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-neutral-400">
          Semua produk sudah ditampilkan.
        </p>
      )}
    </>
  );
}

function ProductCard({ product }: { product: GridProduct }) {
  return (
    <Link
      href={`/produk/${product.slug}`}
      aria-label={`Lihat detail produk ${product.name}`}
      className="group block overflow-hidden rounded-[12px] border border-[#E4E4E7] bg-white hover:shadow-lg transition-shadow duration-200"
    >
      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
        <ProductImage src={product.image} alt={product.name} />
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
