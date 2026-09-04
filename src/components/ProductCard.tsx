import Link from "next/link";
import { Eye } from "lucide-react";
import type { Product } from "@/data/seed";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "horizontal";
}

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.basePrice);

  if (variant === "horizontal") {
    return (
      <Link
        href={`/produk/${product.slug}`}
        className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 shrink-0 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-400 text-sm font-medium">{product.name.charAt(0)}</span>
            </div>
            {product.isBestSeller && (
              <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Best Seller
              </span>
            )}
          </div>
          <div className="p-4 flex flex-col justify-between flex-1">
            <div>
              <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded mb-2">
                {product.categorySlug.replace("-", " ")}
              </span>
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">{product.shortDescription}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-blue-600 font-bold text-sm">
                mulai dari {formattedPrice}
              </p>
              <span className="flex items-center gap-1 text-xs font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
                <Eye className="w-3.5 h-3.5" />
                Lihat Detail
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400 text-3xl font-bold">{product.name.charAt(0)}</span>
        </div>
        {product.isBestSeller && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Best Seller
          </span>
        )}
      </div>
      <div className="p-4">
        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded mb-2">
          {product.categorySlug.replace("-", " ")}
        </span>
        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.shortDescription}</p>
        <div className="flex items-center justify-between">
          <p className="text-blue-600 font-bold text-sm">
            mulai dari {formattedPrice}
          </p>
          <span className="flex items-center gap-1 text-xs font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
            <Eye className="w-3.5 h-3.5" />
            Lihat Detail
          </span>
        </div>
      </div>
    </Link>
  );
}
