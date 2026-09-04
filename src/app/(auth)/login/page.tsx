"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <>
      <style>{`
        body { background: #08020F !important; }
      `}</style>

      {/* Full-screen background */}
      <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: "#08020F" }}>
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #08020F 0%, #120522 45%, #08020F 100%)",
          }}
        />
        {/* Radial center glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(126,34,206,0.28), transparent 45%)",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(8,2,15,0.85) 100%)",
          }}
        />

        {/* Abstract light ribbon 1 */}
        <div
          className="absolute"
          style={{
            top: "10%",
            left: "-10%",
            width: "60%",
            height: "55%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(168,85,247,0.35), transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.5,
            transform: "rotate(-15deg)",
            animation: "ribbonFloat 12s ease-in-out infinite",
          }}
        />
        {/* Abstract light ribbon 2 */}
        <div
          className="absolute"
          style={{
            bottom: "5%",
            right: "-8%",
            width: "50%",
            height: "50%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(192,132,252,0.20), transparent 70%)",
            filter: "blur(90px)",
            opacity: 0.4,
            transform: "rotate(20deg)",
            animation: "ribbonFloat2 14s ease-in-out infinite",
          }}
        />
        {/* Abstract light ribbon 3 - subtle diagonal */}
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "20%",
            width: "45%",
            height: "35%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(124,58,237,0.30), transparent 65%)",
            filter: "blur(100px)",
            opacity: 0.3,
            transform: "rotate(35deg)",
            animation: "ribbonFloat3 16s ease-in-out infinite",
          }}
        />

        <style>{`
          @keyframes ribbonFloat {
            0%, 100% { transform: rotate(-15deg) translate(0, 0); }
            50% { transform: rotate(-12deg) translate(20px, -15px); }
          }
          @keyframes ribbonFloat2 {
            0%, 100% { transform: rotate(20deg) translate(0, 0); }
            50% { transform: rotate(23deg) translate(-15px, 10px); }
          }
          @keyframes ribbonFloat3 {
            0%, 100% { transform: rotate(35deg) translate(0, 0); }
            50% { transform: rotate(32deg) translate(10px, -20px); }
          }
          @keyframes cardIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .ribbon-anim { animation: none !important; }
            .card-anim { animation: none !important; opacity: 1 !important; }
          }
          .login-input { height: 44px; }
          .login-btn { height: 44px; }
          @media (max-width: 767px) {
            .login-card {
              padding: 24px 22px !important;
              border-radius: 8px !important;
              max-width: none !important;
              width: calc(100vw - 28px) !important;
              margin: 14px !important;
            }
            .login-logo { max-width: 160px !important; }
            .login-input, .login-btn { height: 42px !important; }
            .login-input { border-radius: 8px !important; }
            .login-btn { border-radius: 8px !important; }
          }
          @media (max-width: 399px) {
            .login-card {
              padding: 20px 18px !important;
              width: calc(100vw - 20px) !important;
            }
            .login-logo { max-width: 140px !important; }
            .login-input, .login-btn { height: 40px !important; }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            .login-card {
              padding: 24px 30px !important;
              max-width: 420px !important;
            }
            .login-logo { max-width: 170px !important; }
            .login-input, .login-btn { height: 44px !important; }
          }
        `}</style>
      </div>

      {/* Centered login card */}
      <main className="flex h-svh items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
        <div
          className="login-card card-anim w-full"
          style={{
            animation: "cardIn 500ms ease-out both",
            padding: "28px",
            borderRadius: "8px",
            maxWidth: "440px",
            background: "#FFFFFF",
            boxShadow:
              "0 25px 80px rgba(0,0,0,0.35), 0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          {/* Logo */}
          <div className="flex justify-center" style={{ marginBottom: "18px" }}>
            <Image
              src="/logo-horizontal.png"
              alt="PADU Printing"
              width={180}
              height={49}
              priority
              className="login-logo"
              style={{ height: "auto", maxWidth: "180px", objectFit: "contain" }}
            />
          </div>

          {/* Welcome */}
          <h1
            className="login-title text-center font-semibold tracking-tight"
            style={{
              fontSize: "18px",
              lineHeight: "1.15",
              letterSpacing: "-0.5px",
              color: "#1A1A2E",
            }}
          >
            Selamat Datang Kembali
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            {/* Error */}
            {error && (
              <div
                className="mb-4 rounded-xl px-4 py-3 text-center text-sm font-medium"
                style={{
                  background: "rgba(252, 165, 165, 0.08)",
                  border: "1px solid rgba(252, 165, 165, 0.25)",
                  color: "#FCA5A5",
                }}
              >
                {error}
              </div>
            )}

            {/* Email */}
            <label
              htmlFor="email"
              className="login-label block font-medium"
              style={{ fontSize: "14px", marginBottom: "10px", color: "#1A1A2E" }}
            >
              Alamat Email
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute top-1/2 left-[18px] -translate-y-1/2"
                size={22}
                style={{ color: "#A1A1AA" }}
              />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input w-full outline-none transition-all duration-200"
                style={{
                  borderRadius: "8px",
                  background: "#F4F4F5",
                  border: "1.5px solid #E4E4E7",
                  padding: "0 18px 0 54px",
                  fontSize: "14px",
                  color: "#1A1A2E",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#A855F7";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(168,85,247,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E4E4E7";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <label
              htmlFor="password"
              className="login-label block font-medium"
              style={{ fontSize: "14px", marginTop: "18px", marginBottom: "8px", color: "#1A1A2E" }}
            >
              Kata Sandi
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute top-1/2 left-[18px] -translate-y-1/2"
                size={22}
                style={{ color: "#A1A1AA" }}
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input w-full outline-none transition-all duration-200"
                style={{
                  borderRadius: "8px",
                  background: "#F4F4F5",
                  border: "1.5px solid #E4E4E7",
                  padding: "0 54px",
                  fontSize: "14px",
                  color: "#1A1A2E",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#A855F7";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(168,85,247,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E4E4E7";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-[18px] -translate-y-1/2 transition-colors"
                style={{ color: "#A1A1AA" }}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right" style={{ marginTop: "12px" }}>
              <a
                href="#"
                className="transition-colors"
                style={{
                  fontSize: "14px",
                  color: "#6B2C91",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#5A2478")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6B2C91")}
              >
                Lupa kata sandi
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="login-btn group relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden font-semibold text-white transition-all duration-200"
              style={{
                borderRadius: "8px",
                background: "#6B2C91",
                border: "1px solid rgba(255,255,255,0.35)",
                boxShadow: "0 10px 30px rgba(107,44,145,0.28)",
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "#5A2478";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 12px 35px rgba(107,44,145,0.40)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#6B2C91";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(107,44,145,0.28)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-5 w-5 animate-spin rounded-full"
                    style={{ border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff" }}
                  />
                  Logging in...
                </span>
              ) : (
                <>
                  Masuk
                  <ArrowRight
                    size={20}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
