"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

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
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.push("/");
  }

  return (
    <>
      {/* Hide header/footer on login page */}
      <style>{`
        header, footer, nav { display: none !important; }
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
          .login-input { height: 62px; }
          .login-btn { height: 62px; }
          @media (max-width: 767px) {
            .login-card {
              padding: 32px 22px !important;
              border-radius: 24px !important;
              max-width: none !important;
              width: calc(100vw - 28px) !important;
              margin: 14px !important;
            }
            .login-logo { max-width: 175px !important; }
            .login-title { font-size: 32px !important; }
            .login-subtitle { font-size: 16px !important; }
            .login-label { font-size: 15px !important; }
            .login-input, .login-btn { height: 58px !important; }
            .login-input { border-radius: 14px !important; }
            .login-btn { border-radius: 14px !important; }
          }
          @media (max-width: 399px) {
            .login-card {
              padding: 28px 18px !important;
              width: calc(100vw - 20px) !important;
            }
            .login-logo { max-width: 155px !important; }
            .login-title { font-size: 29px !important; }
            .login-input, .login-btn { height: 56px !important; }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            .login-card {
              padding: 42px 42px !important;
              max-width: 500px !important;
            }
            .login-logo { max-width: 190px !important; }
            .login-title { font-size: 36px !important; }
            .login-input, .login-btn { height: 60px !important; }
          }
        `}</style>
      </div>

      {/* Centered login card */}
      <main className="flex min-h-svh items-center justify-center overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div
          className="login-card card-anim w-full"
          style={{
            animation: "cardIn 500ms ease-out both",
            padding: "48px 52px",
            borderRadius: "30px",
            maxWidth: "520px",
            background: "rgba(20, 8, 35, 0.58)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(216, 180, 254, 0.65)",
            boxShadow:
              "0 25px 80px rgba(0,0,0,0.55), 0 0 45px rgba(168,85,247,0.12), inset 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Logo */}
          <div className="flex justify-center" style={{ marginBottom: "28px" }}>
            <Image
              src="/logo-horizontal.png"
              alt="PADU Printing"
              width={220}
              height={60}
              priority
              className="login-logo"
              style={{ height: "auto", maxHeight: "60px", maxWidth: "220px" }}
            />
          </div>

          {/* Welcome */}
          <h1
            className="login-title text-center font-semibold tracking-tight text-white"
            style={{
              fontSize: "40px",
              lineHeight: "1.15",
              letterSpacing: "-0.5px",
            }}
          >
            Welcome Back
          </h1>
          <p
            className="login-subtitle text-center"
            style={{
              marginTop: "10px",
              fontSize: "17px",
              color: "rgba(255,255,255,0.62)",
            }}
          >
            Login to your account
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ marginTop: "34px" }}>
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
              className="login-label block font-medium text-white"
              style={{ fontSize: "17px", marginBottom: "10px" }}
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute top-1/2 left-[18px] -translate-y-1/2"
                size={22}
                style={{ color: "rgba(255,255,255,0.85)" }}
              />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input w-full text-white outline-none transition-all duration-200"
                style={{
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1.5px solid rgba(255,255,255,0.85)",
                  padding: "0 18px 0 54px",
                  fontSize: "16px",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#C084FC";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(168,85,247,0.15), 0 0 25px rgba(168,85,247,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.85)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <label
              htmlFor="password"
              className="login-label block font-medium text-white"
              style={{ fontSize: "17px", marginTop: "24px", marginBottom: "10px" }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute top-1/2 left-[18px] -translate-y-1/2"
                size={22}
                style={{ color: "rgba(255,255,255,0.85)" }}
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input w-full text-white outline-none transition-all duration-200"
                style={{
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1.5px solid rgba(255,255,255,0.85)",
                  padding: "0 54px",
                  fontSize: "16px",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#C084FC";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(168,85,247,0.15), 0 0 25px rgba(168,85,247,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.85)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-[18px] -translate-y-1/2 transition-colors"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right" style={{ marginTop: "12px" }}>
              <a
                href="#"
                className="transition-colors hover:underline"
                style={{
                  fontSize: "15px",
                  color: "#C084FC",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E9D5FF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#C084FC")}
              >
                Forget Password ?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="login-btn group relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden font-semibold text-white transition-all duration-200"
              style={{
                borderRadius: "16px",
                background: "linear-gradient(90deg, #A855F7 0%, #7C3AED 50%, #C026D3 100%)",
                border: "1px solid rgba(255,255,255,0.35)",
                boxShadow: "0 10px 30px rgba(168,85,247,0.28)",
                fontSize: "20px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 12px 35px rgba(168,85,247,0.40)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(168,85,247,0.28)";
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
                  Login
                  <ArrowRight
                    size={20}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>

          {/* Sign Up divider */}
          <div
            className="flex items-center gap-4"
            style={{ marginTop: "58px", marginBottom: "8px" }}
          >
            <div className="h-px flex-1" style={{ background: "rgba(192,132,252,0.35)" }} />
            <span
              className="shrink-0 whitespace-nowrap"
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.88)",
              }}
            >
              Are You New Member ?{" "}
              <a
                href="#"
                className="font-bold transition-colors hover:underline"
                style={{ color: "#C084FC" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E9D5FF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#C084FC")}
              >
                Sign UP
              </a>
            </span>
            <div className="h-px flex-1" style={{ background: "rgba(192,132,252,0.35)" }} />
          </div>
        </div>
      </main>
    </>
  );
}
