import Link from "next/link";
import { notFound } from "next/navigation";
import { Package, ChevronRight, Eye } from "lucide-react";
import {
  categories,
  products,
  getCategoryBySlug,
  getProductsByCategory,
  getProductBySlug,
} from "@/data/seed";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductImage from "@/components/ProductImage";
import type { Metadata } from "next";
import {
  SITE_URL,
  BRAND,
  getProductSchema,
  getBreadcrumbSchema,
  getOrganizationSchema,
} from "@/lib/seo";

export async function generateStaticParams() {
  const categoryParams = categories.map((c) => ({ slug: c.slug }));
  const productParams = products.map((p) => ({ slug: p.slug }));
  return [...categoryParams, ...productParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (category) {
    const url = `${SITE_URL}/produk/${category.slug}`;
    return {
      title: `${category.name} Jakarta Timur | ${BRAND}`,
      description: category.description,
      alternates: { canonical: url },
      openGraph: {
        title: `${category.name} Jakarta Timur | ${BRAND}`,
        description: category.description,
        url,
        siteName: BRAND,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${category.name} Jakarta Timur | ${BRAND}`,
        description: category.description,
      },
    };
  }
  const product = getProductBySlug(slug);
  if (product) {
    const url = `${SITE_URL}/produk/${product.slug}`;
    return {
      title: `Cetak ${product.name} Jakarta Timur | ${BRAND}`,
      description: product.shortDescription,
      alternates: { canonical: url },
      openGraph: {
        title: `Cetak ${product.name} Jakarta Timur | ${BRAND}`,
        description: product.shortDescription,
        url,
        siteName: BRAND,
        type: "website",
        images: [{ url: product.image }],
      },
      twitter: {
        card: "summary_large_image",
        title: `Cetak ${product.name} Jakarta Timur | ${BRAND}`,
        description: product.shortDescription,
        images: [product.image],
      },
    };
  }
  return { title: "Tidak Ditemukan" };
}

export default async function ProdukSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = getCategoryBySlug(slug);
  if (category) {
    return <CategoryView category={category} />;
  }

  const product = getProductBySlug(slug);
  if (product) {
    return <ProductView product={product} />;
  }

  notFound();
}

function CategoryView({
  category,
}: {
  category: (typeof categories)[0];
}) {
  const categoryProducts = getProductsByCategory(category.slug);
  const url = `${SITE_URL}/produk/${category.slug}`;
  const orgSchema = getOrganizationSchema();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      getBreadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Produk", url: `${SITE_URL}/produk` },
        { name: category.name, url },
      ]),
      orgSchema,
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href="/" className="hover:text-[#6B2C91] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/produk" className="hover:text-[#6B2C91] transition-colors">
              Produk
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#1A2340] font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-br from-[#1A2340] to-[#6B2C91] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">{category.name}</h1>
              <p className="mt-2 text-neutral-300 text-lg">{category.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {categoryProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-500 text-lg">Belum ada produk di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categoryProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/produk/${product.slug}`}
                className="card-hover group block rounded-xl bg-white border border-neutral-200 overflow-hidden"
              >
                <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
                  <ProductImage src={product.image} alt={`Cetak ${product.name} - ${BRAND}`} iconClassName="h-10 w-10 text-neutral-300" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold text-[#1A2340] group-hover:text-[#6B2C91] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
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
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function ProductView({ product }: { product: (typeof products)[0] }) {
  const category = categories.find((c) => c.slug === product.categorySlug);
  const url = `${SITE_URL}/produk/${product.slug}`;
  const orgSchema = getOrganizationSchema();

  const breadcrumbItems = [
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Produk", url: `${SITE_URL}/produk` },
  ];
  if (category) {
    breadcrumbItems.push({ name: category.name, url: `${SITE_URL}/produk/${category.slug}` });
  }
  breadcrumbItems.push({ name: product.name, url });

  const productSchema = getProductSchema({
    name: product.name,
    description: product.description,
    url,
    image: [product.image],
    price: product.basePrice,
  });

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      productSchema,
      getBreadcrumbSchema(breadcrumbItems),
      orgSchema,
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href="/" className="hover:text-[#6B2C91] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/produk" className="hover:text-[#6B2C91] transition-colors">
              Produk
            </Link>
            {category && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link
                  href={`/produk/${category.slug}`}
                  className="hover:text-[#6B2C91] transition-colors"
                >
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#1A2340] font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductDetailClient product={product} categoryName={category?.name || ""} />
      </section>

      <RelatedProducts currentProduct={product} />
    </>
  );
}

function RelatedProducts({ currentProduct }: { currentProduct: (typeof products)[0] }) {
  const related = products
    .filter(
      (p) =>
        p.categorySlug === currentProduct.categorySlug &&
        p.slug !== currentProduct.slug
    )
    .slice(0, 4);

  if (related.length === 0) return null;

  const category = categories.find((c) => c.slug === currentProduct.categorySlug);

  return (
    <section className="border-t border-neutral-200 bg-neutral-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#1A2340]">
          Produk Lain di {category?.name || "Kategori Ini"}
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {related.map((product) => (
            <Link
              key={product.slug}
              href={`/produk/${product.slug}`}
              className="card-hover block rounded-xl bg-white border border-neutral-200 overflow-hidden"
            >
              <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
                <ProductImage src={product.image} alt={`Cetak ${product.name} - ${BRAND}`} iconClassName="h-10 w-10 text-neutral-300" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-[#1A2340] line-clamp-1">{product.name}</h3>
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
          ))}
        </div>
      </div>
    </section>
  );
}
