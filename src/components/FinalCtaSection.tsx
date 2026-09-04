import { ArrowRight } from "lucide-react";

interface BrandLogo {
  name: string;
  initial: string;
}

const brands: BrandLogo[] = [
  { name: "Tokopedia", initial: "T" },
  { name: "Shopee", initial: "S" },
  { name: "Lazada", initial: "L" },
  { name: "Gojek", initial: "G" },
  { name: "Blibli", initial: "B" },
];

export default function FinalCtaSection() {
  return (
    <section
      className="relative overflow-hidden py-20"
      style={{ backgroundColor: "#4C1D68" }}
      aria-labelledby="final-cta-heading"
    >
      {/* ---- Section background decoration ---- */}
      {/* Radial glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(217,183,255,0.14), transparent 45%), radial-gradient(circle at 85% 10%, rgba(217,183,255,0.10), transparent 40%), radial-gradient(circle at 50% 110%, rgba(139,61,190,0.35), transparent 55%)",
        }}
      />
      {/* Fine technical grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* Dot / halftone pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      {/* Thin curved flowing lines */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
        viewBox="0 0 1440 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-50 650C200 500 300 300 500 380C700 460 720 220 900 280C1080 340 1150 150 1500 220"
          stroke="white"
          strokeWidth="1"
        />
        <path
          d="M-50 200C250 350 450 550 700 470C950 390 1000 620 1250 540"
          stroke="white"
          strokeWidth="1"
        />
      </svg>

      {/* ---- Main container ---- */}
      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-white/15 px-6 py-16 sm:px-12 sm:py-20 lg:py-24"
          style={{
            backgroundColor: "rgba(38,14,54,0.55)",
            boxShadow:
              "0 0 0 1px rgba(217,183,255,0.06), 0 0 60px rgba(217,183,255,0.12), inset 0 0 60px rgba(0,0,0,0.25)",
          }}
        >
          {/* Inner grid pattern */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          {/* Inner glow top */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full"
            style={{ background: "radial-gradient(closest-side, rgba(217,183,255,0.18), transparent)" }}
          />

          {/* Content */}
          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            {/* Headline */}
            <h2
              id="final-cta-heading"
              className="mt-8 text-[40px] font-extrabold leading-[1.02] tracking-tight text-white sm:text-[52px] lg:text-[68px]"
            >
              Percetakan Digital untuk{" "}
              <span className="text-[#D9B7FF]">Bisnis Anda.</span>
            </h2>

            {/* Description */}
            <p
              className="mt-6 max-w-[700px] text-base leading-[1.6] sm:text-lg"
              style={{ color: "rgba(255,255,255,0.68)" }}
            >
              Solusi printing untuk kebutuhan promosi, branding, event, hingga
              operasional bisnis Anda dengan proses yang mudah dan hasil yang konsisten.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://wa.me/6285280059274"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 sm:w-auto"
                style={{
                  backgroundColor: "#D9B7FF",
                  color: "#3B1A57",
                  boxShadow: "0 0 20px rgba(217,183,255,0.25)",
                }}
              >
                Konsultasi B2B
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/6285280059274?text=Halo PADU Printing, saya ingin meminta penawaran."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-white/10 sm:w-auto"
              >
                Minta Penawaran
              </a>
            </div>

            {/* Trusted brands */}
            <div className="mt-14 w-full">
              <div className="mx-auto h-px w-full max-w-md" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
              <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">
                Dipercaya oleh
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
                {brands.map((brand) => (
                  <div
                    key={brand.name}
                    className="flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full border border-white/40 opacity-50 transition-opacity duration-300 hover:opacity-90"
                    title={brand.name}
                  >
                    <span className="text-xs font-bold text-white">
                      {brand.initial}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
