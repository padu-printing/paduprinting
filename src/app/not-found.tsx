import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { SITE_URL, BRAND } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Halaman Tidak Ditemukan | ${BRAND}`,
  description: `Halaman yang Anda cari tidak ditemukan. Kembali ke beranda ${BRAND} dan jelajahi layanan percetakan digital kami.`,
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/` },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-extrabold text-[#6B2C91]">404</p>
        <h1 className="mt-4 text-2xl font-bold text-[#1A2340]">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mx-auto mt-3 max-w-md text-neutral-500">
          Halaman yang Anda cari mungkin telah dipindah atau tidak tersedia.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-[10px] bg-[#6B2C91] px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          Kembali ke Beranda
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}