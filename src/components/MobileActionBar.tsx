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
      className="fixed inset-x-4 bottom-4 z-40 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="rounded-full border border-white/70 bg-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        <div className="grid grid-cols-3 rounded-full">
          <Link
            href="/produk"
            className={`${itemClass} text-[#6B2C91] hover:bg-purple-100/70 rounded-full`}
          >
            <Package className="h-5 w-5" />
            Produk
          </Link>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${itemClass} text-[#6B2C91] hover:bg-purple-100/70 rounded-full`}
          >
            <MapPin className="h-5 w-5" />
            Lokasi Toko
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${itemClass} text-[#25D366] hover:bg-green-100/70 rounded-full`}
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}