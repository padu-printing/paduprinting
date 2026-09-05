"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppMessage, getWhatsAppLink } from "@/lib/whatsapp";
import type { Product } from "@/data/seed";
import { getWhatsAppPhoneNumber } from "@/data/seed";
import ProductImage from "@/components/ProductImage";

interface ProductDetailClientProps {
  product: Product;
  categoryName: string;
}

export default function ProductDetailClient({ product, categoryName }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [notes, setNotes] = useState("");

  const handleWhatsAppOrder = () => {
    const message = buildWhatsAppMessage({
      name: "",
      category: categoryName,
      tipe: product.name,
      qty: 1,
      estimasiTotal: product.basePrice,
      catatan: notes || undefined,
    });
    const phone = getWhatsAppPhoneNumber();
    const url = getWhatsAppLink(phone, message);
    window.open(url, "_blank");
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Image Gallery */}
      <div className="lg:sticky lg:top-[76px] lg:self-start">
        <div className="relative aspect-[4/5] rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200">
          <ProductImage
            src={product.gallery[selectedImage] || product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
            iconClassName="h-32 w-32"
          />
        </div>
        {product.gallery.length > 1 && (
          <div className="mt-4 flex gap-3">
            {product.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 bg-neutral-100 flex items-center justify-center transition-colors ${
                  selectedImage === idx
                    ? "border-[#6B2C91]"
                    : "border-transparent hover:border-neutral-300"
                }`}
              >
                <ProductImage
                  src={img || product.image}
                  alt={`${product.name} ${idx + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  iconClassName="h-6 w-6"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-2xl font-bold text-padu-navy">{product.name}</h1>
        <p className="mt-2 text-lg font-bold text-padu-orange">
          Harga Mulai dari Rp {product.basePrice.toLocaleString("id-ID")}
        </p>
        <div
          className="prose prose-sm prose-neutral max-w-none mt-4 text-neutral-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-padu-navy mb-1.5">Catatan (opsional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Tulis catatan untuk pesanan Anda..."
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-padu-orange focus:outline-none focus:ring-2 focus:ring-padu-orange/20 resize-none"
          />
        </div>

        {/* WhatsApp Button */}
        <div className="mt-8">
          <button
            onClick={handleWhatsAppOrder}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 text-base font-bold text-white transition-colors hover:bg-[#1EBE57] lg:w-auto"
          >
            <MessageCircle className="h-5 w-5" />
            Pesan Sekarang via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}