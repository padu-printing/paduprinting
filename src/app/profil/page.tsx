import {
  ArrowRight,
  Building2,
  Megaphone,
  Sparkles,
  User,
  Check,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import {
  SITE_URL,
  BRAND,
  PHONE,
  WHATSAPP_PHONE,
  ADDRESS,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: `Tentang Kami | ${BRAND}`,
  description:
    `Kenali lebih dekat ${BRAND}, mitra percetakan digital terpercaya di Jakarta Timur untuk kebutuhan cetak bisnis, event, dan personal.`,
  alternates: { canonical: `${SITE_URL}/profil` },
  openGraph: {
    title: `Tentang Kami | ${BRAND}`,
    description:
      `Kenali lebih dekat ${BRAND}, mitra percetakan digital terpercaya di Jakarta Timur.`,
    url: `${SITE_URL}/profil`,
    siteName: BRAND,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Tentang Kami | ${BRAND}`,
    description:
      `Kenali lebih dekat ${BRAND}, mitra percetakan digital terpercaya di Jakarta Timur.`,
  },
};

const containerClass = "mx-auto w-[calc(100%-40px)] max-w-[1180px] max-sm:w-[calc(100%-28px)]";

const whatsappLink = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
  "Halo Admin " + BRAND + ", saya ingin berkonsultasi tentang kebutuhan cetak."
)}`;

function Eyebrow({ children, tone = "purple" }: { children: ReactNode; tone?: "purple" | "light" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] ${
        tone === "light" ? "text-[#DDD0FF]" : "text-[#4C1D75]"
      }`}
    >
      {tone === "purple" && <span aria-hidden="true" className="h-0.5 w-6 bg-[#8B5CF6]" />}
      {children}
    </span>
  );
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("https://wa.me") ? "_blank" : undefined}
      rel={href.startsWith("https://wa.me") ? "noopener noreferrer" : undefined}
      className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[15px] px-[22px] text-sm font-extrabold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
      style={{
        background: "linear-gradient(135deg, #4C1D75, #6D28D9)",
        boxShadow: "0 14px 30px rgba(76,29,117,0.22)",
      }}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

function ChatBubble({
  side,
  delay,
  children,
}: {
  side: "in" | "out";
  delay: number;
  children: ReactNode;
}) {
  const isOut = side === "out";
  return (
    <div
      className={`flex ${isOut ? "justify-end" : "justify-start"}`}
      style={{ animation: `chat-in 0.5s ease ${delay}s both` }}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-[1.45] shadow-sm sm:text-[12px] ${
          isOut ? "rounded-br-md bg-[#DCF8C6] text-[#111B13]" : "rounded-bl-md bg-white text-[#16121D]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function TypingBubble({ delay, className = "" }: { delay: number; className?: string }) {
  return (
    <div
      className={`flex ${className}`}
      style={{ animation: "chat-in 0.4s ease " + delay + "s both" }}
    >
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-3 py-2.5 shadow-sm">
        {[0, 0.15, 0.3].map((d) => (
          <span
            key={d}
            className="h-1.5 w-1.5 rounded-full bg-[#A7A29A]"
            style={{ animation: `typing-blink 1.1s ease-in-out ${d}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProfilPage() {
  return (
    <>
      {/* ===================== HERO ===================== */}
      <section
        aria-labelledby="profil-hero-heading"
        className="overflow-hidden py-[70px] max-sm:py-[56px] lg:py-[78px]"
        style={{
          background:
            "radial-gradient(circle at 92% 16%, rgba(139,92,246,0.12), transparent 28%), radial-gradient(circle at 0% 100%, rgba(167,139,250,0.10), transparent 40%), #FFFFFF",
        }}
      >
        <div className={`${containerClass} grid items-center gap-[48px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-[66px]`}>
          {/* Left: content */}
          <div>
            <Eyebrow>Tentang PADU Printing</Eyebrow>
            <h1
              id="profil-hero-heading"
              className="mt-[18px] mb-[22px] text-[46px] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#16121D] sm:text-[56px] lg:text-[clamp(48px,6vw,78px)]"
            >
              More Than Printing.
              <br />
              <span className="text-[#4C1D75]">We Make Your Brand Visible.</span>
            </h1>
            <p className="mb-[30px] max-w-[630px] text-base leading-[1.6] text-[#6F6878] sm:text-lg">
              PADU Printing membantu bisnis, perusahaan, event, dan kebutuhan
              personal menghasilkan media cetak yang profesional, konsisten, dan
              siap memperkuat visual brand Anda.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <PrimaryButton href={whatsappLink}>Konsultasi Sekarang</PrimaryButton>
              <a
                href="/produk"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[15px] border border-[#E7E0EF] bg-white px-[22px] text-sm font-extrabold text-[#16121D] transition-transform duration-200 ease-out hover:-translate-y-0.5"
              >
                Lihat Produk
              </a>
            </div>
          </div>

          {/* Right: visual */}
          <div className="relative min-h-[360px] sm:min-h-[420px] lg:min-h-[470px]" aria-hidden="true">
            {/* Shell */}
            <div
              className="absolute inset-x-0 inset-y-2.5 overflow-hidden rounded-[42px] lg:inset-[22px_8px_18px_40px]"
              style={{
                background: "linear-gradient(145deg, #26103A, #5B2086 58%, #A46AD0)",
                boxShadow: "0 38px 90px rgba(49,19,70,0.28)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 75% 20%, rgba(255,255,255,0.38), transparent 26%)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: 360,
                  height: 360,
                  right: -80,
                  top: -85,
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: 220,
                  height: 220,
                  left: -60,
                  bottom: -70,
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: 340,
                  height: 340,
                  left: "22%",
                  top: "40%",
                  background: "rgba(167,139,250,0.22)",
                  filter: "blur(64px)",
                }}
              />
            </div>

            {/* WhatsApp chat mockup */}
            <div
              className="absolute inset-x-[8px] inset-y-[12px] flex flex-col rotate-[-2deg] overflow-hidden rounded-[20px] sm:inset-x-[12px] sm:inset-y-[14px] lg:inset-x-[16px] lg:inset-y-[18px] lg:rounded-[24px]"
              style={{ boxShadow: "0 24px 50px rgba(0,0,0,0.30)" }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 bg-[#075E54] px-4 py-2.5">
                <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                  <img src="/logo-icon.png" alt="" className="h-8 w-8 object-cover" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#075E54] bg-[#25D366]" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-bold text-white">PADU Printing</p>
                  <p className="text-[10px] leading-tight text-[#C8E3DA]">online</p>
                </div>
              </div>

              {/* Chat area */}
              <div
                className="relative flex-1 overflow-hidden px-3 py-2.5"
                style={{
                  backgroundColor: "#ECE5DC",
                  backgroundImage: "radial-gradient(rgba(20,5,31,0.05) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              >
                <ChatBubble side="in" delay={0.4}>
                  Halo kak, mau tanya-tanya cetak kartu nama.
                </ChatBubble>
                <TypingBubble delay={1.2} />
                <div className="mt-1">
                  <ChatBubble side="out" delay={2}>
                    Siap dibantu! Bahan dan jumlahnya berapa ya?
                  </ChatBubble>
                </div>
                <div className="mt-1">
                  <ChatBubble side="in" delay={2.8}>
                    Art carton, 100 pcs.
                  </ChatBubble>
                </div>
                <TypingBubble delay={3.7} className="mt-1" />
                <div className="mt-1">
                  <ChatBubble side="out" delay={4.6}>
                    Rp 25.000/pc, estimasi 1-2 hari kerja. Mau langsung order?
                  </ChatBubble>
                </div>
                <div className="mt-1 flex justify-end">
                  <div
                    className="w-[84%] overflow-hidden rounded-2xl rounded-br-md bg-white text-[#111B13] shadow-sm sm:w-[76%]"
                    style={{ animation: "chat-in 0.5s ease 5.6s both" }}
                  >
                    <div className="px-3 pb-1.5 pt-2">
                      <p className="text-[11px] font-extrabold text-[#16121D] sm:text-[12px]">
                        Kartu Nama Art Carton
                      </p>
                      <p className="text-[10px] text-[#6F6878]">100 pcs - full color 2 sisi</p>
                      <div className="mt-1 flex items-baseline justify-between">
                        <span className="text-[10px] text-[#6F6878]">Total estimasi</span>
                        <span className="text-[12px] font-extrabold text-[#4C1D75]">
                          Rp 2.500.000
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#25D366] px-3 py-1 text-center text-[10px] font-bold text-white">
                      Lanjut chat via WhatsApp ✓
                    </div>
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="flex items-center gap-2 bg-[#F0F2F5] px-3 py-2.5">
                <div className="flex flex-1 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A7A29A]" style={{ animation: "typing-blink 1.1s ease-in-out 0s infinite" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A7A29A]" style={{ animation: "typing-blink 1.1s ease-in-out 0.15s infinite" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A7A29A]" style={{ animation: "typing-blink 1.1s ease-in-out 0.3s infinite" }} />
                  <span className="ml-1 text-[10px] text-[#6F6878]">PADU sedang mengetik...</span>
                </div>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#25D366]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="bg-[#14051F] py-8 text-white lg:py-[32px]">
        <div className={`${containerClass} grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:gap-[18px]`}>
          {[
            { number: "5+", label: "Tahun Pengalaman" },
            { number: "500+", label: "Klien & Project" },
            { number: "9", label: "Kategori Solusi Cetak" },
            { number: "24/7", label: "Konsultasi via WhatsApp" },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className={`lg:pr-6 lg:last:pr-0 ${
                idx === 3 ? "" : "lg:border-r lg:border-[rgba(255,255,255,0.13)]"
              }`}
            >
              <p className="mb-2 text-[34px] font-extrabold leading-none tracking-[-0.04em] lg:text-[44px]">
                {stat.number}
              </p>
              <p className="text-[13px] text-[rgba(255,255,255,0.68)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== BUSINESS SOLUTIONS ===================== */}
      <section className="bg-[#F8F6FB] py-[70px] lg:py-[94px]">
        <div className={containerClass}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>Printing that works</Eyebrow>
              <h2 className="mt-4 max-w-[700px] text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-[#16121D] lg:text-[42px]">
                Dibuat untuk kebutuhan bisnis yang nyata.
              </h2>
            </div>
            <p className="max-w-[480px] text-[15px] leading-[1.6] text-[#6F6878]">
              Bukan sekadar mencetak. Kami membantu memilih format, material,
              finishing, dan solusi produksi yang paling sesuai dengan tujuan Anda.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Building2, title: "Corporate", desc: "Solusi cetak untuk operasional dan branding perusahaan, dari dokumen hingga packaging." },
              { icon: Megaphone, title: "Promotion", desc: "Material promosi yang siap memperkuat kampanye, event, dan aktivasi di lapangan." },
              { icon: Sparkles, title: "Event", desc: "Kebutuhan cetak untuk pameran, konser, seminar, dan acara berskala besar." },
              { icon: User, title: "Personal", desc: "Cetak personal seperti kartu ucapan, undangan, dan merchandise eksklusif Anda." },
            ].map((item) => (
              <div
                key={item.title}
                className="min-h-[270px] rounded-[22px] border border-[#E7E0EF] bg-white p-7 transition-all duration-200 ease-out hover:-translate-y-1.5 hover:border-[#DDD0FF] hover:shadow-[0_24px_70px_rgba(36,14,51,0.12)]"
              >
                <div className="mb-14 flex h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-[#F2EDF8] text-[#4C1D75]">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2.5 text-[21px] font-bold text-[#16121D]">{item.title}</h3>
                <p className="text-sm leading-[1.6] text-[#6F6878]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHY PADU ===================== */}
      <section className="bg-white py-[70px] lg:py-[94px]">
        <div className={`${containerClass} grid grid-cols-1 items-stretch gap-[44px] lg:grid-cols-[0.9fr_1.1fr]`}>
          {/* Dark panel */}
          <div
            className="relative flex min-h-[460px] flex-col justify-between overflow-hidden rounded-[30px] p-8 text-white lg:p-[38px]"
            style={{
              background: "linear-gradient(145deg, #14051F, #22083D)",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.35), transparent)" }}
            />
            <div aria-hidden="true" className="flex h-0.5 w-12 bg-[#8B5CF6]" />
            <div className="relative">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#DDD0FF]">
                Why PADU
              </p>
              <h2 className="mt-4 max-w-[380px] text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] lg:text-[42px]">
                Printing partner yang bisa diandalkan.
              </h2>
            </div>
            <p className="relative mt-8 text-[15px] leading-[1.7] text-[rgba(255,255,255,0.68)]">
              Kualitas produksi, komunikasi yang jelas, dan proses yang efisien
              menjadi dasar kami dalam menangani setiap pekerjaan cetak.
            </p>
          </div>

          {/* Feature list */}
          <div className="grid gap-[18px]">
            {[
              { num: "01", title: "Quality First", desc: "Standar hasil cetak yang konsisten dan diperiksa sebelum dikirim." },
              { num: "02", title: "Fast Production", desc: "Proses produksi yang cepat dengan estimasi waktu yang jelas." },
              { num: "03", title: "Free Consultation", desc: "Konsultasi spesifikasi, material, dan harga gratis via WhatsApp." },
              { num: "04", title: "Reliable Support", desc: "Tim siap membantu Anda dari awal hingga pesanan selesai." },
            ].map((item) => (
              <div
                key={item.num}
                className="grid grid-cols-[56px_1fr] items-start gap-[18px] rounded-[20px] border border-[#E7E0EF] bg-white p-[26px_28px] transition-transform duration-200 ease-out hover:-translate-y-1"
              >
                <div className="grid h-[56px] w-[56px] place-items-center rounded-[16px] bg-[#F2EDF8] text-lg font-black text-[#4C1D75]">
                  {item.num}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#16121D]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-[1.6] text-[#6F6878]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHAT WE PRINT ===================== */}
      <section className="bg-[#F8F6FB] py-[70px] lg:py-[94px]">
        <div className={containerClass}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>What we print</Eyebrow>
              <h2 className="mt-4 max-w-[700px] text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-[#16121D] lg:text-[42px]">
                Satu partner untuk banyak kebutuhan cetak.
              </h2>
            </div>
            <p className="max-w-[480px] text-[15px] leading-[1.6] text-[#6F6878]">
              Kategori di bawah dapat diarahkan langsung ke koleksi produk yang
              sudah tersedia di website PADU Printing.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/produk/banner-spanduk", title: "Banner & Display", dark: true },
              { href: "/produk/undangan-kartu", title: "Cards & Stationery", dark: false },
              { href: "/produk/stiker-label", title: "Sticker & Label", dark: true },
              { href: "/produk/packaging-label", title: "Packaging", dark: false },
              { href: "/produk/souvenir-promosi", title: "Merchandise", dark: true },
              { href: "/produk", title: "Corporate Printing", dark: false },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className={`group relative block min-h-[290px] overflow-hidden rounded-[24px] p-[26px] transition-all duration-200 ease-out hover:-translate-y-1.5 ${
                  item.dark ? "text-white" : "text-[#16121D]"
                }`}
                style={{
                  background:
                    item.dark
                      ? "linear-gradient(145deg, #2A103F, #6F33A0)"
                      : "linear-gradient(145deg, #EEE8F5, #FFFFFF)",
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute right-[-10px] top-[28px] rotate-[18deg] rounded-[38px] border border-[rgba(124,58,237,0.22)]"
                  style={{ width: 190, height: 190, background: "rgba(124,58,237,0.14)" }}
                />
                <div
                  aria-hidden="true"
                  className="absolute right-[-10px] top-[28px] rotate-[18deg] rounded-[38px] border border-[rgba(124,58,237,0.16)]"
                  style={{ width: 190, height: 190, margin: 8 }}
                />
                <div className="relative flex h-full min-h-[238px] flex-col justify-between">
                  <div className="flex justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-[0.14em]">
                      {item.dark ? "PADU Printing" : "PADU Printing"}
                    </span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                  <h3 className="text-2xl font-extrabold leading-tight">{item.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== VISION & MISSION ===================== */}
      <section className="bg-white py-[70px] lg:py-[94px]">
        <div className={`${containerClass} grid grid-cols-1 gap-[22px] lg:grid-cols-2`}>
          {/* Vision */}
          <div
            className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[30px] bg-[#14051F] p-10 text-white"
            style={{ background: "linear-gradient(145deg, #14051F, #4C1D75)" }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(167,139,250,0.30), transparent)" }}
            />
            <div className="relative">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#DDD0FF]">
                Our Vision
              </p>
              <h3 className="mt-4 text-3xl font-extrabold leading-[1.05] tracking-[-0.04em]">
                Menjadi partner printing yang tumbuh bersama kebutuhan klien.
              </h3>
            </div>
            <p className="relative mt-8 text-[15px] leading-[1.7] text-[rgba(255,255,255,0.68)]">
              Menjadi perusahaan percetakan digital yang dikenal karena kualitas,
              inovasi, ketepatan produksi, dan pengalaman layanan yang konsisten.
            </p>
          </div>

          {/* Mission */}
          <div
            className="flex min-h-[360px] flex-col justify-between rounded-[30px] border border-[#E7E0EF] bg-white p-10"
            style={{ boxShadow: "0 22px 60px rgba(37,18,50,0.06)" }}
          >
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#4C1D75]">
                Our Mission
              </p>
              <h3 className="mt-4 text-3xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#16121D]">
                Lebih rapi. Lebih cepat. Lebih mudah.
              </h3>
            </div>
            <ul className="mt-8 grid gap-[13px]">
              {[
                "Memberikan hasil cetak berkualitas dengan harga yang kompetitif.",
                "Menggunakan teknologi dan proses produksi yang efisien.",
                "Memberikan konsultasi yang jelas dan profesional.",
                "Menjaga kepuasan klien sebagai bagian utama dari setiap project.",
              ].map((mission) => (
                <li key={mission} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F2EDF8] text-[#4C1D75]">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-[15px] leading-[1.6] text-[#6F6878]">{mission}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===================== LOCATION ===================== */}
      <section className="bg-[#F8F6FB] py-[70px] lg:py-[94px]">
        <div className={containerClass}>
          <Eyebrow>Come visit us</Eyebrow>
          <h2 className="mt-4 max-w-[700px] text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-[#16121D] lg:text-[42px]">
            Temui tim PADU Printing di Jakarta Timur.
          </h2>

          <div
            className="mt-10 grid grid-cols-1 overflow-hidden rounded-[30px] border border-[#E7E0EF] bg-white lg:grid-cols-[0.86fr_1.14fr]"
            style={{ boxShadow: "0 22px 60px rgba(37,18,50,0.08)" }}
          >
            <div className="flex flex-col gap-7 p-8 lg:p-10">
              <div className="flex items-start gap-4">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[#F2EDF8] text-[#4C1D75]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#16121D]">Alamat</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-[#6F6878]">
                    {ADDRESS.streetAddress},
                    <br />
                    Bidara Cina, Kecamatan Jatinegara,
                    <br />
                    {ADDRESS.addressLocality} {ADDRESS.postalCode}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[#F2EDF8] text-[#4C1D75]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#16121D]">Telepon / WhatsApp</p>
                  <p className="mt-0.5 text-sm text-[#6F6878]">{PHONE}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[#F2EDF8] text-[#4C1D75]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#16121D]">Email</p>
                  <p className="mt-0.5 text-sm text-[#6F6878]">info@paduprinting.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[#F2EDF8] text-[#4C1D75]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#16121D]">Jam Operasional</p>
                  <p className="mt-0.5 text-sm text-[#6F6878]">Senin - Minggu, 24 jam</p>
                </div>
              </div>

              <div className="mt-2">
                <PrimaryButton href={whatsappLink}>Hubungi via WhatsApp</PrimaryButton>
              </div>
            </div>

            <div className="min-h-[360px] lg:min-h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.8!2d106.86!3d-6.23!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698e!3s0x0!5e0!3m2!1sid!2sid"
                title="Peta lokasi PADU Printing di Google Maps"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[360px] w-full lg:min-h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="bg-[#14051F] py-[88px]">
        <div className={containerClass}>
          <div
            className="relative overflow-hidden rounded-[28px] px-7 py-12 sm:px-12 sm:py-16 lg:rounded-[36px] lg:px-16 lg:py-[70px]"
            style={{
              background:
                "radial-gradient(circle at 82% 20%, rgba(192,132,252,0.35), transparent 28%), radial-gradient(circle at 10% 90%, rgba(124,58,237,0.25), transparent 26%), linear-gradient(135deg, #12041F 0%, #2D0A49 55%, #16051F 100%)",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-[120px] -top-[160px] rounded-full"
              style={{ width: 360, height: 360, border: "1px solid rgba(255,255,255,0.12)" }}
            />
            <div className="relative">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#DDD0FF]">
                Start a project
              </p>
              <h2 className="mt-5 max-w-[780px] text-[clamp(40px,5vw,64px)] font-extrabold leading-[0.98] tracking-[-0.05em] text-white">
                Got Something to Print?
                <br />
                Let&apos;s Make It PADU.
              </h2>
              <p className="mt-6 max-w-[680px] text-[15px] leading-[1.7] text-[rgba(255,255,255,0.68)] lg:text-base">
                Ceritakan kebutuhan cetak Anda. Tim PADU siap membantu memilih
                produk, bahan, ukuran, dan finishing yang paling sesuai.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-[52px] items-center justify-center gap-2 rounded-[15px] bg-white px-[22px] text-sm font-extrabold text-[#14051F] transition-transform duration-200 ease-out hover:-translate-y-0.5"
              >
                Konsultasi via WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}