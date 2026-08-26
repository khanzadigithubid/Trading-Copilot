"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

interface TokenResponse {
  access_token: string;
  token_type: string;
}

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Signals with Full Reasoning",
    desc: "Not just BUY/SELL — know exactly why the AI thinks so",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
  },
  {
    icon: "📊",
    title: "5-Strategy Backtester",
    desc: "RSI+MACD, Bollinger Bands, EMA Cross, SuperTrend, Mean Reversion",
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/20",
  },
  {
    icon: "🎓",
    title: "AI Trade Coach",
    desc: "Post-trade analysis: what you did right, what to improve",
    color: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/20",
  },
  {
    icon: "🌍",
    title: "27 Live Markets",
    desc: "Forex, Crypto, Stocks, Gold, Silver, Oil, Indices — all in one place",
    color: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/20",
  },
];

const STATS = [
  { value: "27", label: "Markets" },
  { value: "5", label: "Strategies" },
  { value: "100%", label: "Free" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [pwStrength, setPwStrength] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  useEffect(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    setPwStrength(s);
  }, [password]);

  if (!mounted || status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch<TokenResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Account created! Please sign in manually.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const strengthMeta = [
    { label: "", color: "bg-slate-800" },
    { label: "Weak", color: "bg-red-500" },
    { label: "Fair", color: "bg-amber-500" },
    { label: "Good", color: "bg-blue-500" },
    { label: "Strong", color: "bg-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 overflow-x-hidden">

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-5%] h-[700px] w-[700px] rounded-full bg-emerald-600/8 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-violet-600/6 blur-[120px]" />
        <div className="absolute top-[50%] left-[50%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/5 blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow">
            AI
          </div>
          <span className="font-bold text-slate-100 tracking-tight">Trading Copilot</span>
        </Link>
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
            Sign in
          </Link>
        </p>
      </nav>

      {/* Main grid */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl items-center gap-16 px-6 py-10 lg:grid lg:grid-cols-[1fr_460px]">

        {/* ── Left panel (desktop only) ── */}
        <div className="hidden lg:flex flex-col gap-10">

          {/* Headline */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% Free · No credit card · No broker needed
            </div>
            <h2 className="text-5xl font-black leading-tight tracking-tight text-white">
              Trade smarter<br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                with AI by your side
              </span>
            </h2>
            <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-md">
              Professional trading tools that explain every decision. Learn faster, risk less, trade better.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
            <div className="h-8 w-px bg-white/8 mx-2" />
            <div className="flex -space-x-2">
              {["🇵🇰", "🇮🇳", "🇺🇸", "🇬🇧", "🇳🇬"].map((flag, i) => (
                <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0a0a0f] bg-slate-800 text-sm shadow-sm">
                  {flag}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">Traders from 50+ countries</p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} p-4 backdrop-blur-sm`}
              >
                <div className="text-2xl mb-2.5">{f.icon}</div>
                <p className="text-sm font-semibold text-slate-200 leading-snug">{f.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="rounded-2xl border border-white/6 bg-white/3 px-5 py-4">
            <p className="text-sm text-slate-400 italic leading-relaxed">
              &ldquo;Bloomberg charges $24,000/year for professional terminal access. This gives you AI-powered signals, backtesting, and portfolio analytics for free.&rdquo;
            </p>
          </div>
        </div>

        {/* ── Right panel — form ── */}
        <div className="w-full">

          {/* Mobile header */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% Free · No credit card
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Start trading smarter</h1>
            <p className="mt-2 text-sm text-slate-500">AI signals, backtesting, paper trading — all free</p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-xl p-8 shadow-2xl shadow-black/60">

            {/* Desktop header */}
            <div className="hidden lg:block mb-7">
              <h1 className="text-2xl font-black text-white tracking-tight">Create your account</h1>
              <p className="mt-1.5 text-sm text-slate-500">Start paper trading with AI in under 30 seconds</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email address
                </label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg className="h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/8 bg-white/5 pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:border-emerald-500/60 focus:bg-white/8 focus:ring-2 focus:ring-emerald-500/15"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                  <span className="ml-1.5 text-xs font-normal text-slate-600">min. 8 characters</span>
                </label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg className="h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a strong password"
                    className="w-full rounded-xl border border-white/8 bg-white/5 pl-11 pr-16 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:border-emerald-500/60 focus:bg-white/8 focus:ring-2 focus:ring-emerald-500/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-white/8 transition-all"
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Strength meter */}
                {password.length > 0 && (
                  <div className="mt-2.5 space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= pwStrength ? strengthMeta[pwStrength].color : "bg-white/8"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-medium transition-colors ${
                        pwStrength >= 3 ? "text-emerald-400" : pwStrength === 2 ? "text-amber-400" : "text-red-400"
                      }`}>
                        {strengthMeta[pwStrength].label} password
                      </p>
                      {pwStrength < 3 && (
                        <p className="text-xs text-slate-600">
                          Add {pwStrength < 1 ? "8+ chars" : pwStrength < 2 ? "uppercase" : "numbers/symbols"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/15">
                    <svg className="h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create free account
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-xs text-slate-600 text-center leading-relaxed">
                By creating an account you agree to our{" "}
                <Link href="/terms" className="text-slate-500 hover:text-slate-300 underline underline-offset-2 transition">Terms</Link>
                {" "}&amp;{" "}
                <Link href="/privacy" className="text-slate-500 hover:text-slate-300 underline underline-offset-2 transition">Privacy Policy</Link>
              </p>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 border-t border-white/6" />
              <span className="text-xs text-slate-600 font-medium uppercase tracking-widest">or</span>
              <div className="flex-1 border-t border-white/6" />
            </div>

            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/8 hover:border-white/12 hover:text-slate-100 transition-all duration-200"
            >
              Sign in to existing account
            </Link>
          </div>

          <p className="mt-5 text-center text-xs text-slate-700">
            Paper trading only · Educational purposes · Not financial advice
          </p>
        </div>
      </div>
    </div>
  );
}
