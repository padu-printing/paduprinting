import Link from "next/link";
import { Package } from "lucide-react";
import type { Category } from "@/data/seed";

interface CategoryCardProps {
  category: Category;
  productCount: number;
}

export default function CategoryCard({ category, productCount }: CategoryCardProps) {
  return (
    <Link
      href={`/produk/${category.slug}`}
      className="group relative block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Package className="w-10 h-10 text-gray-300" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {productCount} produk
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
          {category.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
      </div>
    </Link>
  );
}
