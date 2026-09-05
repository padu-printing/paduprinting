"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { useContent } from "@/data/content";

export default function Footer() {
  const { content } = useContent();
  const { categories } = content;
  return (
    <footer className="bg-[#0D1220] text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo-icon.png" alt="Padu Printing" className="h-9 w-auto" />
              <span className="text-lg font-bold text-white">
                Padu <span className="text-padu-orange">Printing</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              <span className="font-bold text-white">PADU Printing</span>{" "}
              <span className="italic">- Different Element. One Brilliant Solution.</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              Solusi percetakan digital terpercaya untuk kebutuhan bisnis dan
              personal Anda: mulai dari Offset, Bisnis Kit, Display Promotion,
              Packaging, Merchandise, hingga Stationery. Setiap elemen berbeda,
              kami satukan menjadi hasil cetak yang presisi, berkualitas, dan
              tepat waktu. Pesan mudah lewat WhatsApp. Konsultasi gratis dan
              proses cepat.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produk</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/produk/${cat.slug}`} className="text-sm hover:text-padu-orange transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Tautan</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-padu-orange transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/produk" className="text-sm hover:text-padu-orange transition-colors">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/profil" className="text-sm hover:text-padu-orange transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/artikel" className="text-sm hover:text-padu-orange transition-colors">
                  Artikel
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-padu-orange transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-padu-orange" />
                <span>Jl. Otista Raya No.161a, RT.2/RW.8, Bidara Cina, Kecamatan Jatinegara, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13330</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-padu-orange" />
                <span>+62 821-2349-6469</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-padu-orange" />
                <span>info@paduprinting.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} PADU Printing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
