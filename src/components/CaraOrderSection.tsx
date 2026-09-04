import {
  ShoppingCart,
  FileEdit,
  MessageCircle,
  CheckCircle2,
  Pointer,
  ArrowRight,
} from "lucide-react";

interface OrderStep {
  step: number;
  icon: typeof ShoppingCart;
  title: string;
  desc: string;
}

const steps: OrderStep[] = [
  {
    step: 1,
    icon: ShoppingCart,
    title: "Pilih Produk",
    desc: "Browse katalog produk kami dan pilih yang sesuai kebutuhan Anda.",
  },
  {
    step: 2,
    icon: FileEdit,
    title: "Isi Spesifikasi",
    desc: "Tentukan ukuran, bahan, finishing, dan jumlah yang diinginkan.",
  },
  {
    step: 3,
    icon: MessageCircle,
    title: "Kirim ke WhatsApp",
    desc: "Klik tombol pesan dan data order otomatis terkirim ke admin.",
  },
  {
    step: 4,
    icon: CheckCircle2,
    title: "Konfirmasi & Bayar",
    desc: "Admin akan mengkonfirmasi harga dan proses pembayaran.",
  },
];

function ProcessIndicator({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3, 4].map((num) => {
        const isActive = num === activeStep;
        return (
          <div key={num} className="flex items-center gap-2">
            <div
              className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                isActive
                  ? "border border-[#D9B7FF] text-white shadow-[0_0_14px_rgba(217,183,255,0.4)]"
                  : "border border-white/10 text-[#D9B7FF]/40"
              }`}
            >
              {isActive && (
                <Pointer className="absolute -top-4 h-3.5 w-3.5 text-[#D9B7FF] drop-shadow-[0_0_6px_rgba(217,183,255,0.6)]" />
              )}
              {num}
            </div>
            {num < 4 && <div className="h-px w-3 bg-white/15" />}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ step }: { step: OrderStep }) {
  return (
    <div className="group relative flex h-full flex-col rounded-[18px] border border-white/15 bg-white/[0.035] p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(217,183,255,0.15)]">
      {/* Process indicator */}
      <ProcessIndicator activeStep={step.step} />

      {/* Divider */}
      <div className="my-4 h-px w-full bg-white/10" />

      {/* Content */}
      <div className="flex flex-1 flex-col items-center text-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white shadow-[inset_0_0_20px_rgba(217,183,255,0.08)] transition-all duration-300 group-hover:border-[#D9B7FF]/40 group-hover:text-[#D9B7FF]">
          <step.icon className="h-6 w-6" strokeWidth={1.6} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-white">{step.title}</h3>
        <div className="mt-2 h-0.5 w-7 rounded-full bg-[#D9B7FF]/60" />
        <p className="mt-3 text-sm leading-relaxed text-white/65">{step.desc}</p>
      </div>
    </div>
  );
}

export default function CaraOrderSection() {
  return (
    <section
      className="relative overflow-hidden py-20"
      style={{ backgroundColor: "#6B2C91" }}
      aria-labelledby="cara-order-heading"
    >
      {/* Soft ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 0%, rgba(217,183,255,0.10), transparent 45%), radial-gradient(circle at 80% 100%, rgba(217,183,255,0.08), transparent 45%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2
            id="cara-order-heading"
            className="text-2xl font-bold tracking-tight text-white"
          >
            Cara Mudah Order Online
          </h2>
        </div>

        {/* Cards + connectors */}
        <div className="mt-14 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, idx) => (
            <div key={step.step} className="relative h-full">
              <OrderCard step={step} />
              {/* Desktop connector between cards */}
              {idx < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 lg:flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[#8B3DBE] text-white shadow-[0_0_16px_rgba(217,183,255,0.25)]"
                >
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
