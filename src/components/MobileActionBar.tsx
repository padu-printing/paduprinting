"use client";

import Link from "next/link";
import { MessageCircle, MapPin, Package } from "lucide-react";
import { WHATSAPP_PHONE, ADDRESS } from "@/lib/seo";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
  "Halo Admin PADU Printing, saya mau tanya-tanya seputar produk."
)}`;

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${ADDRESS.streetAddress}, ${ADDRESS.addressLocality}, ${ADDRESS.addressRegion} ${ADDRESS.postalCode}`
)}`;

const itemClass =
  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold text-gray-600 transition-colors";

export default function MobileActionBar() {
  return (
    <nav
      aria-label="Akses cepat mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden"
    >
      <div className="grid grid-cols-3">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${itemClass} text-[#25D366] hover:bg-green-50`}
        >
          <MessageCircle className="h-5 w-5" />
          WhatsApp
        </a>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${itemClass} text-[#6B2C91] hover:bg-purple-50`}
        >
          <MapPin className="h-5 w-5" />
          Lokasi Toko
        </a>
        <Link
          href="/produk"
          className={`${itemClass} text-[#6B2C91] hover:bg-purple-50`}
        >
          <Package className="h-5 w-5" />
          Produk
        </Link>
      </div>
    </nav>
  );
}