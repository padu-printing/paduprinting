"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, ChevronDown, Check } from "lucide-react";
import { buildWhatsAppMessage, getWhatsAppLink } from "@/lib/whatsapp";
import type { Product } from "@/data/seed";
import { calculatePrice, getWhatsAppPhoneNumber } from "@/data/seed";
import ProductImage from "@/components/ProductImage";

interface ProductDetailClientProps {
  product: Product;
  categoryName: string;
}

export default function ProductDetailClient({ product, categoryName }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const handleVariantChange = (groupName: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [groupName]: value }));
  };

  const totalPrice = calculatePrice(product, selectedVariants, quantity);

  const handleWhatsAppOrder = () => {
    const message = buildWhatsAppMessage({
      name: "",
      category: categoryName,
      tipe: product.name,
      bahan: selectedVariants["Bahan"] || selectedVariants["Jenis Bahan"] || undefined,
      laminating: selectedVariants["Finishing"] || undefined,
      tinta: selectedVariants["Jenis Sablon"] || selectedVariants["Cetak"] || undefined,
      sisiCetak: undefined,
      ukuran: selectedVariants["Ukuran"] || selectedVariants["Kapasitas"] || undefined,
      qty: quantity,
      estimasiTotal: totalPrice,
      catatan: notes || undefined,
    });
    const phone = getWhatsAppPhoneNumber();
    const url = getWhatsAppLink(phone, message);
    window.open(url, "_blank");
  };

  const getSelectedLabel = (groupName: string): string => {
    const group = product.variantGroups.find((g) => g.name === groupName);
    if (!group) return "";
    const selected = selectedVariants[groupName];
    if (!selected) return "Pilih";
    const option = group.options.find((o) => o.value === selected);
    return option?.label || "Pilih";
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
        <div className="mt-4 flex gap-3">
          {Array.from({ length: 3 }).map((_, idx) => (
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
                src={product.gallery[idx] || product.image}
                alt={`${product.name} ${idx + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
                iconClassName="h-6 w-6"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-2xl font-bold text-padu-navy">{product.name}</h1>
        <p className="mt-2 text-lg font-bold text-padu-orange">
          Harga Mulai dari Rp {product.basePrice.toLocaleString("id-ID")}
        </p>
        <p className="mt-4 text-sm text-neutral-600 leading-relaxed">{product.description}</p>

        <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500">
          <span className="font-medium text-padu-navy">Estimasi Produksi:</span>
          <span>{product.productionTime}</span>
        </div>

        {/* Variant Selectors */}
        {product.variantGroups.length > 0 && (
          <div className="mt-6 space-y-4">
            {product.variantGroups.map((group) => (
              <div key={group.name}>
                <label className="block text-sm font-semibold text-padu-navy mb-1.5">
                  {group.name}
                </label>
                <VariantSelect
                  groupName={group.name}
                  options={group.options}
                  selected={selectedVariants[group.name]}
                  onSelect={(value) => handleVariantChange(group.name, value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Quantity */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-padu-navy mb-1.5">Jumlah</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-32 rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-padu-orange focus:outline-none focus:ring-2 focus:ring-padu-orange/20"
          />
        </div>

        {/* Price Tier Table */}
        {product.priceTiers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-padu-navy mb-2">Harga Per Unit</h3>
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-4 py-2 text-left font-semibold text-padu-navy">Quantity</th>
                    <th className="px-4 py-2 text-left font-semibold text-padu-navy">Harga/pc</th>
                  </tr>
                </thead>
                <tbody>
                  {product.priceTiers.map((tier, idx) => (
                    <tr key={idx} className="border-t border-neutral-100">
                      <td className="px-4 py-2 text-neutral-600">
                        {tier.minQty.toLocaleString("id-ID")}
                        {tier.maxQty ? ` - ${tier.maxQty.toLocaleString("id-ID")}` : " +"}
                      </td>
                      <td className="px-4 py-2 font-medium text-padu-navy">
                        Rp {tier.pricePerUnit.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="mt-3 text-xs text-neutral-400 italic">
          *Estimasi, harga final dikonfirmasi admin
        </p>

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

        {/* Price Summary */}
        <div className="mt-6 rounded-lg bg-neutral-50 p-4 border border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Total Estimasi</span>
            <span className="text-xl font-bold text-padu-navy">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-padu-navy mb-2">Spesifikasi</h3>
            <div className="space-y-2">
              {product.specifications.map((spec, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm border-b border-neutral-100 pb-2">
                  <span className="text-neutral-500">{spec.label}</span>
                  <span className="font-medium text-padu-navy">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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

function VariantSelect({
  groupName,
  options,
  selected,
  onSelect,
}: {
  groupName: string;
  options: { value: string; label: string; priceModifier: number }[];
  selected?: string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selectedOption = options.find((o) => o.value === selected);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
          open
            ? "bg-[#5A2478] text-white"
            : "bg-[#6B2C91] text-white hover:bg-[#5A2478]"
        }`}
      >
        <span className={selectedOption ? "text-white" : "text-white/70"}>
          {selectedOption ? selectedOption.label : `Pilih ${groupName}`}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-auto rounded-xl border border-gray-200 bg-white p-1 shadow-2xl">
          {options.map((option) => {
            const isSelected = option.value === selected;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  isSelected ? "bg-[#6B2C91] text-white" : "text-neutral-700 hover:bg-gray-50"
                }`}
              >
                <span className="font-medium">{option.label}</span>
                <span className="flex items-center gap-1.5">
                  {option.priceModifier > 0 && (
                    <span className={`text-xs ${isSelected ? "text-white/80" : "text-neutral-400"}`}>
                      +Rp {option.priceModifier.toLocaleString("id-ID")}
                    </span>
                  )}
                  {option.priceModifier < 0 && (
                    <span className={`text-xs ${isSelected ? "text-white/80" : "text-emerald-600"}`}>
                      Hemat Rp {Math.abs(option.priceModifier).toLocaleString("id-ID")}
                    </span>
                  )}
                  {isSelected && <Check className="h-4 w-4" />}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
