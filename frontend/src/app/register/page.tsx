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
  { icon: "🤖", title: "Explainable AI Signals", desc: "Know exactly WHY the AI says BUY or SELL" },
  { icon: "📚", title: "AI Trade Journal",       desc: "Auto coaching feedback after every trade" },
  { icon: "⚡", title: "5 Backtest Strategies",  desc: "RSI+MACD, Bollinger, EMA, SuperTrend — test first" },
  { icon: "🌍", title: "27 Live Markets",        desc: "Forex, Crypto, Stocks, Gold, Oil, Indices" },
  { icon: "📊", title: "Portfolio Analytics",    desc: "Sharpe ratio, drawdown, equity curve" },
  { icon: "🔔", title: "Price Alerts",           desc: "Get notified when price hits your target" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [pwStrength, setPwStrength] = useState(0);

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

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
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
      if (result?.error) { setError("Account created! Please sign in."); return; }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const strengthColors = ["bg-slate-700", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthTextColors = ["", "text-red-400", "text-amber-400", "text-blue-400", "text-emerald-400"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[80px]" />
      </div>

      {/* Navbar — exact match to landing page */}
      <nav className="relative z-10 w-full border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">AI</div>
            <span className="font-semibold text-slate-100 text-sm sm:text-base">Trading Copilot</span>
          </Link>
          <p className="text-sm text-slate-400">
            Have an account?{" "}
            <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition">
              Sign in →
            </Link>
          </p>
        </div>
      </nav>

      {/* Main — two column on desktop */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-start">

          {/* ── Left — Features (desktop only) ── */}
          <div className="hidden lg:flex flex-col gap-8">

            {/* Headline */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5 text-xs font-medium text-emerald-400 mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                100% Free · No credit card · No broker needed
              </div>
              <h2 className="text-4xl font-black leading-tight tracking-tight text-slate-100">
                The trading platform<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                  that explains itself
                </span>
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed max-w-sm text-sm">
                Not just signals — full AI reasoning. Paper trade first with virtual money. Real trading when you&apos;re confident.
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-2.5">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3.5 hover:border-slate-700 transition"
                >
                  <span className="text-xl shrink-0 mt-0.5">{f.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{f.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 rounded-2xl border border-slate-800 bg-slate-900/30 px-5 py-4">
              {[
                { value: "27", label: "Live Markets" },
                { value: "5",  label: "AI Strategies" },
                { value: "100%", label: "Free" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-emerald-400">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
              <div className="h-8 w-px bg-slate-800 mx-1" />
              <div className="flex -space-x-2">
                {["🇵🇰", "🇮🇳", "🇺🇸", "🇬🇧", "🇳🇬"].map((flag, i) => (
                  <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-800 text-sm">
                    {flag}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">50+ countries</p>
            </div>

            {/* Quote */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 px-5 py-4">
              <p className="text-sm text-slate-400 italic leading-relaxed">
                &ldquo;Bloomberg charges $24,000/year. This gives you AI signals, backtesting and portfolio analytics — for free.&rdquo;
              </p>
            </div>
          </div>

          {/* ── Right — Form ── */}
          <div className="w-full">

            {/* Mobile header */}
            <div className="lg:hidden mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5 text-xs font-medium text-emerald-400 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                100% Free · No credit card
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-100">Start trading smarter 🚀</h1>
              <p className="mt-2 text-sm text-slate-400">AI signals, backtesting, paper trading — all free</p>
            </div>

            {/* Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-black/30">

              <div className="hidden lg:block mb-7">
                <h1 className="text-2xl font-black tracking-tight text-slate-100">Create your account 🚀</h1>
                <p className="mt-1.5 text-sm text-slate-400">Start paper trading with AI in under 30 seconds</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-1.5">
                    Password
                    <span className="ml-1.5 text-xs font-normal text-slate-500">min. 8 characters</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Choose a strong password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-20 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition"
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>

                  {/* Strength meter */}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                              i <= pwStrength ? strengthColors[pwStrength] : "bg-slate-800"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-medium ${strengthTextColors[pwStrength]}`}>
                          {strengthLabels[pwStrength]}
                        </p>
                        {pwStrength < 4 && (
                          <p className="text-xs text-slate-600">
                            {pwStrength === 0 && "Add 8+ characters"}
                            {pwStrength === 1 && "Add uppercase letter"}
                            {pwStrength === 2 && "Add a number"}
                            {pwStrength === 3 && "Add a symbol"}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3">
                    <span className="text-red-400 shrink-0">⚠️</span>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                      Creating account...
                    </>
                  ) : (
                    "Create free account →"
                  )}
                </button>

                <p className="text-xs text-slate-600 text-center">
                  By signing up you agree to our{" "}
                  <Link href="/terms" className="text-slate-500 hover:text-slate-300 underline underline-offset-2 transition">Terms</Link>
                  {" "}&amp;{" "}
                  <Link href="/privacy" className="text-slate-500 hover:text-slate-300 underline underline-offset-2 transition">Privacy Policy</Link>
                </p>
              </form>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 border-t border-slate-800" />
                <span className="text-xs text-slate-600 uppercase tracking-widest">or</span>
                <div className="flex-1 border-t border-slate-800" />
              </div>

              <Link
                href="/login"
                className="block w-full rounded-xl border border-slate-700 px-4 py-3 text-center text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-100 transition"
              >
                Sign in to existing account
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-slate-700">
              Paper trading only · Educational purposes only · Not financial advice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
