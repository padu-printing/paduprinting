"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useContent } from "@/data/content";
import type { Product } from "@/data/seed";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

function searchProducts(products: Product[], query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.shortDescription.toLowerCase().includes(lowerQuery) ||
      product.categorySlug.replace("-", " ").includes(lowerQuery)
  );
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const { content } = useContent();
  const { products } = content;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      setResults(searchProducts(products, query));
    } else {
      setResults([]);
    }
  }, [query, products]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 pt-20">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk cetakan..."
            className="w-full pl-14 pr-14 py-5 text-xl border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors bg-white shadow-lg"
          />
          <button
            onClick={() => {
              setQuery("");
              onClose();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {results.map((product) => (
              <Link
                key={product.slug}
                href={`/produk/${product.slug}`}
                onClick={() => {
                  setQuery("");
                  onClose();
                }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-gray-400 font-bold absolute">
                    {product.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">{product.shortDescription}</p>
                  <p className="text-sm text-blue-600 font-medium mt-0.5">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(product.basePrice)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {query.trim().length >= 2 && results.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Tidak ditemukan produk untuk &ldquo;{query}&rdquo;</p>
            <p className="text-gray-400 text-sm mt-1">Coba kata kunci lain atau lihat kategori produk kami</p>
          </div>
        )}

        {query.trim().length < 2 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Ketik minimal 2 karakter untuk mulai mencari</p>
          </div>
        )}
      </div>
    </div>
  );
}
