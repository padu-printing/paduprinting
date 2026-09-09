import { getAllCategories, getAllProducts } from "@/lib/data";
import ProdukGridClient from "@/components/ProdukGridClient";

export default async function ProdukPage() {
  const categories = await getAllCategories();
  const products = await getAllProducts();

  return (
    <ProdukGridClient
      categories={categories.map((c) => ({
        slug: c.slug,
        name: c.name,
        icon: c.icon,
      }))}
      products={products.map((p) => ({
        slug: p.slug,
        name: p.name,
        categorySlug: p.categorySlug,
        image: p.image,
        basePrice: p.basePrice,
        clickCount: p.clickCount,
      }))}
    />
  );
}