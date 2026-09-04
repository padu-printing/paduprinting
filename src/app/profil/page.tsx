import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Truck,
  Shield,
  Headphones,
  Award,
  MessageCircle,
} from "lucide-react";
import type { Metadata } from "next";
import { SITE_URL, BRAND, PHONE, WHATSAPP_PHONE, ADDRESS } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Tentang Kami | ${BRAND}`,
  description: `Kenali lebih dekat ${BRAND}, percetakan digital terpercaya di Jakarta Timur yang melayani kebutuhan cetak bisnis dan personal.`,
  alternates: { canonical: `${SITE_URL}/profil` },
  openGraph: {
    title: `Tentang Kami | ${BRAND}`,
    description: `Kenali lebih dekat ${BRAND}, percetakan digital terpercaya di Jakarta Timur.`,
    url: `${SITE_URL}/profil`,
    siteName: BRAND,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Tentang Kami | ${BRAND}`,
    description: `Kenali lebih dekat ${BRAND}, percetakan digital terpercaya di Jakarta Timur.`,
  },
};

export default function ProfilPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A2340] to-[#6B2C91] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Tentang <span className="text-gradient-brand">{BRAND}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-300">
            Percetakan digital terpercaya yang hadir untuk memenuhi kebutuhan cetak bisnis
            dan personal Anda dengan kualitas terbaik.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#1A2340]">Siapa Kami?</h2>
            <div className="mt-6 space-y-4 text-neutral-600 leading-relaxed">
              <p>
                {BRAND} adalah perusahaan percetakan digital yang berlokasi di Jakarta Timur.
                Kami menyediakan berbagai layanan percetakan berkualitas tinggi untuk kebutuhan
                bisnis dan personal Anda.
              </p>
              <p>
                Dengan peralatan modern dan tim yang berpengalaman, kami berkomitmen untuk
                memberikan hasil cetak terbaik dengan harga kompetitif dan pelayanan yang
                memuaskan.
              </p>
              <p>
                Kami melayani berbagai kebutuhan cetak mulai dari banner, kartu nama, stiker,
                souvenir promosi, undangan, packaging, kaos, hingga mug dan tumbler custom.
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-neutral-50 p-8 border border-neutral-200">
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "500+", label: "Klien Puas" },
                { number: "10+", label: "Tahun Pengalaman" },
                { number: "50+", label: "Jenis Produk" },
                { number: "24/7", label: "Layanan Konsultasi" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-[#6B2C91]">{stat.number}</p>
                  <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-8 border border-neutral-200 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#6B2C91]/10 text-[#6B2C91]">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2340]">Visi</h3>
              <p className="mt-3 text-neutral-600 leading-relaxed">
                Menjadi perusahaan percetakan digital terdepan di Indonesia yang dikenal
                dengan kualitas cetak premium, inovasi berkelanjutan, dan pelayanan
                terbaik kepada setiap klien.
              </p>
            </div>
            <div className="rounded-xl bg-white p-8 border border-neutral-200 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E85D75]/10 text-[#E85D75]">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2340]">Misi</h3>
              <ul className="mt-3 space-y-2 text-neutral-600 leading-relaxed">
                <li>&bull; Memberikan hasil cetak berkualitas tinggi dengan harga terjangkau</li>
                <li>&bull; Menggunakan teknologi terbaru dalam setiap proses produksi</li>
                <li>&bull; Memberikan pelayanan yang ramah dan profesional</li>
                <li>&bull; Menjaga kepuasan klien sebagai prioritas utama</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-[#1A2340]">Mengapa Memilih Kami?</h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Truck,
              title: "Pengiriman Cepat",
              desc: "Pengiriman ke seluruh Indonesia via ekspedisi terpercaya. Tersedia same-day delivery untuk area tertentu.",
            },
            {
              icon: Shield,
              title: "Garansi Kualitas",
              desc: "Jaminan garansi cetak ulang jika terjadi kesalahan dari pihak kami. Kepuasan Anda adalah prioritas.",
            },
            {
              icon: Headphones,
              title: "Konsultasi Gratis",
              desc: "Tim kami siap membantu Anda memilih produk dan spesifikasi yang tepat sesuai kebutuhan.",
            },
            {
              icon: Clock,
              title: "Proses Cepat",
              desc: "Proses produksi cepat dan tepat waktu. Tersedia layanan urgent untuk kebutuhan mendesak.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-white p-6 text-center border border-neutral-200 shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#6B2C91]/10 text-[#6B2C91]">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-[#1A2340]">{item.title}</h3>
              <p className="mt-2 text-sm text-neutral-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1A2340]">Lokasi Kami</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B2C91]/10 text-[#6B2C91]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1A2340]">Alamat</h4>
                  <p className="text-neutral-500">
                    {ADDRESS.streetAddress},
                    <br />
                    Bidara Cina, Kec. Jatinegara,
                    <br />
                    {ADDRESS.addressLocality}, {ADDRESS.addressRegion} {ADDRESS.postalCode}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B2C91]/10 text-[#6B2C91]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1A2340]">Telepon / WhatsApp</h4>
                  <p className="text-neutral-500">{PHONE}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B2C91]/10 text-[#6B2C91]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1A2340]">Email</h4>
                  <p className="text-neutral-500">info@paduprinting.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B2C91]/10 text-[#6B2C91]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1A2340]">Jam Operasional</h4>
                  <p className="text-neutral-500">
                    Senin - Minggu: 24 Jam
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.8!2d106.86!3d-6.23!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698e!3s0x0!5e0!3m2!1sid!2sid"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1A2340] to-[#6B2C91] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Hubungi Kami Sekarang</h2>
          <p className="mt-4 text-lg text-neutral-300">
            Konsultasikan kebutuhan percetakan Anda dengan tim kami. Gratis!
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Halo Admin " + BRAND + ", saya ingin mengetahui lebih lanjut tentang layanan Anda.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-button mt-8 inline-flex text-lg"
          >
            <MessageCircle className="h-5 w-5" />
            Hubungi via WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
