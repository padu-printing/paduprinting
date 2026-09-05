"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useContent } from "@/data/content";

const WHATSAPP_NUMBER = "6282123496469";

export default function Header() {
  const { content } = useContent();
  const { categories, products } = content;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [kategoriOpen, setKategoriOpen] = useState(false);
  const [activeKategori, setActiveKategori] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const kategoriRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (kategoriRef.current && !kategoriRef.current.contains(e.target as Node)) {
        setKategoriOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getProductsForCategory = (catSlug: string) => {
    return products.filter((p) => p.categorySlug === catSlug).slice(0, 4);
  };

  return (
    <>
      {/* ===== MAIN HEADER ===== */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-lg" : "shadow-sm"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <img src="/logo-horizontal.png" alt="Padu Printing" className="h-9 w-auto" />
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl relative" ref={searchRef}>
              <div className="w-full relative">
                <div className="flex items-center gap-2 bg-gray-100 focus-within:ring-2 focus-within:ring-[#6B2C91]/20 rounded-full px-4 py-2.5 transition-all">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Mau Cetak Apa Hari ini?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                  />
                </div>

                {/* Search Dropdown */}
                {searchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    {/* Search Results */}
                    {searchQuery.trim() && (
                      <div className="p-3">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                          Hasil Pencarian
                        </div>
                        <div className="space-y-1">
                          {products
                            .filter(
                              (p) =>
                                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .slice(0, 5)
                            .map((product) => (
                              <Link
                                key={product.slug}
                                href={`/produk/${product.slug}`}
                                onClick={() => {
                                  setSearchFocused(false);
                                  setSearchQuery("");
                                }}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                                  <p className="text-xs text-[#F5A623] font-semibold">
                                    Rp {product.basePrice.toLocaleString("id-ID")}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          {products.filter(
                            (p) =>
                              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
                          ).length === 0 && (
                            <p className="text-sm text-gray-400 py-2 px-1">Produk tidak ditemukan</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Divider */}
                    {searchQuery.trim() && <div className="border-t border-gray-100" />}

                    {/* Recommended Products */}
                    <div className="p-3">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                        Produk Rekomendasi
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {products.filter((p) => p.isBestSeller).slice(0, 2).map((product) => (
                          <Link
                            key={product.slug}
                            href={`/produk/${product.slug}`}
                            onClick={() => {
                              setSearchFocused(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                              <p className="text-xs text-[#F5A623] font-semibold">
                                Rp {product.basePrice.toLocaleString("id-ID")}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Admin%20PADU%20Printing%2C%20saya%20mau%20tanya-tanya%20seputar%20produk.`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE57] text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md"
              >
                <img
                  src="/logo-icon.png"
                  alt="PADU Printing"
                  className="h-4 w-4 object-contain"
                />
                WhatsApp
              </a>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== SECONDARY NAVBAR (Desktop) ===== */}
      <div className="hidden lg:block bg-[#f3f4f6] border-b border-gray-200 relative z-40" ref={kategoriRef}>
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center gap-0 h-11">
            {/* Kategori Button */}
            <div
              className="relative"
              onMouseEnter={() => setKategoriOpen(true)}
              onMouseLeave={() => setKategoriOpen(false)}
            >
              <button
                onClick={() => setKategoriOpen(!kategoriOpen)}
                className={`flex items-center gap-2 px-4 h-11 text-sm font-semibold transition-colors rounded-t-xl w-[260px] ${
                  kategoriOpen
                    ? "bg-[#6B2C91] text-white"
                    : "bg-[#6B2C91] text-white hover:bg-[#5A2478]"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Pilih Kategori</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${kategoriOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Mega Dropdown */}
              {kategoriOpen && (
                <div className="absolute top-full left-0 w-[700px] bg-white rounded-b-xl shadow-2xl border border-gray-200 flex overflow-hidden">
                  {/* Left: Category List */}
                  <div className="w-[260px] bg-gray-50 border-r border-gray-200 py-2 overflow-y-auto max-h-[480px]">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onMouseEnter={() => setActiveKategori(cat.slug)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                          activeKategori === cat.slug
                            ? "bg-white text-[#6B2C91] font-semibold"
                            : "text-gray-700 hover:bg-white hover:text-[#6B2C91]"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                    <div className="border-t border-gray-200 mt-2 pt-2 px-4 pb-2">
                      <Link
                        href="/produk"
                        onClick={() => setKategoriOpen(false)}
                        className="block text-sm font-semibold text-[#2554C7] hover:text-[#6B2C91] transition-colors"
                      >
                        Lihat Semua Produk →
                      </Link>
                    </div>
                  </div>

                  {/* Right: Submenu / Products */}
                  <div className="flex-1 p-4 overflow-y-auto max-h-[480px]">
                    {activeKategori ? (
                      (() => {
                        const cat = categories.find((c) => c.slug === activeKategori);
                        const catProducts = getProductsForCategory(activeKategori);
                        return (
                          <div>
                            <div className="mb-3">
                              <h3 className="font-semibold text-[#1A2340] text-sm">{cat?.name}</h3>
                              <p className="text-xs text-gray-500 mt-0.5">{cat?.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {catProducts.map((product) => (
                                <Link
                                  key={product.slug}
                                  href={`/produk/${product.slug}`}
                                  onClick={() => setKategoriOpen(false)}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                                >
                                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-800 group-hover:text-[#6B2C91] transition-colors truncate">
                                      {product.name}
                                    </p>
                                    <p className="text-xs text-[#F5A623] font-semibold">
                                      Rp {product.basePrice.toLocaleString("id-ID")}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <Link
                                href={`/produk/${activeKategori}`}
                                onClick={() => setKategoriOpen(false)}
                                className="text-sm font-semibold text-[#2554C7] hover:text-[#6B2C91] transition-colors"
                              >
                                Lihat Semua {cat?.name} →
                              </Link>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Pilih kategori untuk melihat produk
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-0 ml-1">
              <Link
                href="/"
                className="px-4 h-11 flex items-center text-sm font-medium text-gray-700 hover:text-[#6B2C91] hover:bg-gray-50 transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/produk"
                className="px-4 h-11 flex items-center text-sm font-medium text-gray-700 hover:text-[#6B2C91] hover:bg-gray-50 transition-colors"
              >
                Semua Produk
              </Link>
              <Link
                href="/artikel"
                className="px-4 h-11 flex items-center text-sm font-medium text-gray-700 hover:text-[#6B2C91] hover:bg-gray-50 transition-colors"
              >
                Artikel
              </Link>
              <Link
                href="/profil"
                className="px-4 h-11 flex items-center text-sm font-medium text-gray-700 hover:text-[#6B2C91] hover:bg-gray-50 transition-colors"
              >
                Tentang Kami
              </Link>
              <Link
                href="/faq"
                className="px-4 h-11 flex items-center text-sm font-medium text-gray-700 hover:text-[#6B2C91] hover:bg-gray-50 transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
                <img src="/logo-horizontal.png" alt="Padu Printing" className="h-8 w-auto" />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav */}
            <nav className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 px-4 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Beranda
                </Link>

                <div className="py-2 px-4">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Kategori Produk</p>
                  <div className="space-y-0.5">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/produk/${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2.5 px-3 text-sm text-gray-700 hover:text-[#6B2C91] hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/produk"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 px-3 text-sm text-[#2554C7] font-semibold hover:bg-blue-50 rounded-lg transition-colors mt-1"
                  >
                    Lihat Semua Produk →
                  </Link>
                </div>

                <hr className="border-gray-100 my-2" />

                <Link href="/artikel" onClick={() => setMobileOpen(false)} className="block py-3 px-4 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors">
                  Artikel
                </Link>
                <Link href="/profil" onClick={() => setMobileOpen(false)} className="block py-3 px-4 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors">
                  Tentang Kami
                </Link>
                <Link href="/faq" onClick={() => setMobileOpen(false)} className="block py-3 px-4 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-colors">
                  FAQ
                </Link>
              </div>
            </nav>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-gray-100 space-y-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Admin%20PADU%20Printing%2C%20saya%20mau%20tanya-tanya%20seputar%20produk.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE57] text-white px-4 py-3 rounded-full text-sm font-medium transition-colors w-full"
              >
                <img
                  src="/logo-icon.png"
                  alt="PADU Printing"
                  className="h-4 w-4 object-contain"
                />
                Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
