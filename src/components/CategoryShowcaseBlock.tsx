import Link from "next/link";
import { Eye } from "lucide-react";
import ProductImage from "@/components/ProductImage";

interface CategoryShowcaseBlockProps {
  category: {
    name: string;
    slug: string;
    bannerImage?: string;
    bannerBackgroundColor?: string;
  };
  products: Array<{
    id: string;
    name: string;
    slug: string;
    image: string;
    categoryName?: string;
    priceFrom: number;
    clickCount: number;
  }>;
}

export default function CategoryShowcaseBlock({ category, products }: CategoryShowcaseBlockProps) {
  const displayGradient = !category.bannerImage && !category.bannerBackgroundColor;

  return (
    <section className="my-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop: 2-column grid */}
        <div className="hidden lg:grid" style={{ gridTemplateColumns: "30% 70%", gap: "24px" }}>
          {/* Left panel - category banner */}
          <Link
            href={`/kategori/${category.slug}`}
            aria-label={`Lihat semua produk kategori ${category.name}`}
            className="group block overflow-hidden transition-all duration-200 hover:scale-[1.01]"
            style={{
              minHeight: "480px",
              height: "100%",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: category.bannerImage
                ? `linear-gradient(rgba(26,35,64,0.35), rgba(26,35,64,0.35)), url(${category.bannerImage})`
                : category.bannerBackgroundColor
                  ? `${category.bannerBackgroundColor}`
                  : undefined,
              backgroundColor: !category.bannerImage && !category.bannerBackgroundColor
                ? undefined
                : undefined,
              ...(displayGradient ? { background: "linear-gradient(135deg, #F5A623 0%, #EF4444 25%, #EC1E63 45%, #6B2C91 65%, #2554C7 80%, #1CB5B0 100%)" } : {}),
            }}
          >
            <div className="text-center px-8">
              <h2 className="text-[36px] font-semibold text-white leading-tight">
                {category.name}
              </h2>
              <p className="mt-3 text-[16px] text-white opacity-90">
                Belanja {category.name}
              </p>
              <span className="mt-4 inline-flex items-center text-white text-2xl transition-transform group-hover:translate-x-1">
                ›
              </span>
            </div>
          </Link>

          {/* Right grid - 3×2 product cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: "16px" }}>
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Mobile: banner + horizontal scroll */}
        <div className="lg:hidden">
          {/* Mobile banner */}
          <Link
            href={`/kategori/${category.slug}`}
            aria-label={`Lihat semua produk kategori ${category.name}`}
            className="block overflow-hidden mb-4 transition-all duration-200"
            style={{
              height: "140px",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: category.bannerImage
                ? `linear-gradient(rgba(26,35,64,0.35), rgba(26,35,64,0.35)), url(${category.bannerImage})`
                : undefined,
              backgroundColor: category.bannerBackgroundColor,
              ...(displayGradient ? { background: "linear-gradient(135deg, #F5A623 0%, #EF4444 25%, #EC1E63 45%, #6B2C91 65%, #2554C7 80%, #1CB5B0 100%)" } : {}),
            }}
          >
            <div className="text-center px-6">
              <h2 className="text-[24px] font-semibold text-white leading-tight">
                {category.name}
              </h2>
              <p className="mt-1 text-[16px] text-white opacity-90">
                Belanja {category.name}
              </p>
              <span className="mt-2 inline-flex items-center text-white text-lg">
                ›
              </span>
            </div>
          </Link>

          {/* Mobile horizontal scroll */}
          <div className="flex gap-3 overflow-x-auto" style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
            {products.slice(0, 6).map((product) => (
              <div key={product.id} style={{ flex: "0 0 65%", scrollSnapAlign: "start" }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: CategoryShowcaseBlockProps["products"][0] }) {
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
          Rp {product.priceFrom.toLocaleString("id-ID")}
        </div>
      </div>
    </Link>
  );
}
