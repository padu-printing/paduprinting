import { Truck, Shield, Clock, Headphones } from "lucide-react";
import { getAllCategories, getAllProducts } from "@/lib/data";
import HeroSlideshow from "@/components/HeroSlideshow";
import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";
import AutoRotatingCategoryShowcase from "@/components/AutoRotatingCategoryShowcase";
import CaraOrderSection from "@/components/CaraOrderSection";
import GallerySection from "@/components/GallerySection";
import FinalCtaSection from "@/components/FinalCtaSection";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickFeatured<T extends { slug: string; clickCount: number }>(products: T[]): T[] {
  const visited = [...products]
    .filter((p) => p.clickCount > 0)
    .sort((a, b) => b.clickCount - a.clickCount);
  const enoughTraffic = visited.length >= 4 && visited[0].clickCount >= 5;
  if (enoughTraffic) return visited.slice(0, 12);
  return shuffle(products).slice(0, 12);
}

export default async function Home() {
  const categories = await getAllCategories();
  const products = await getAllProducts();

  const featured = pickFeatured(products).map((p) => ({
    slug: p.slug,
    name: p.name,
    image: p.image,
    basePrice: p.basePrice,
    clickCount: p.clickCount,
  }));

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

      {/* Produk Pilihan */}
      <FeaturedProductsCarousel products={featured} />

      {/* Auto-Rotating Category Showcase */}
      <AutoRotatingCategoryShowcase categories={categories} products={products} />

      {/* Cara Order */}
      <CaraOrderSection />

      {/* Gallery */}
      <GallerySection />

      {/* Final CTA */}
      <FinalCtaSection />
    </>
  );
}