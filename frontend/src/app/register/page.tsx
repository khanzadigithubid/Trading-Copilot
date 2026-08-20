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
  { icon: "📚", title: "AI Trade Journal", desc: "Auto coaching feedback after every trade" },
  { icon: "🌍", title: "27 Real Markets", desc: "Forex, Crypto, Stocks, Gold, Oil — all live" },
  { icon: "📊", title: "Portfolio Analytics", desc: "Sharpe ratio, drawdown, equity curve" },
  { icon: "🔔", title: "Price Alerts", desc: "Get notified when price hits your target" },
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

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  useEffect(() => {
    // Password strength indicator
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPwStrength(strength);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-20 h-[600px] w-[600px] rounded-full bg-emerald-500/6 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      {/* Top nav */}
      <nav className="relative flex items-center justify-between px-6 py-4 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20">
            AI
          </div>
          <span className="font-bold text-slate-100">Trading Copilot</span>
        </Link>
        <p className="text-sm text-slate-400">
          Have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition">
            Sign in →
          </Link>
        </p>
      </nav>

      <div className="relative flex items-start justify-center px-4 py-10 lg:min-h-[calc(100vh-65px)] lg:items-center">
        <div className="w-full max-w-5xl grid gap-10 lg:grid-cols-[1fr_420px] items-center">

          {/* Left panel — desktop only */}
          <div className="hidden lg:flex flex-col gap-8">
            {/* Headline */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                100% Free · No credit card · No broker needed
              </span>
              <h2 className="text-4xl font-black leading-tight tracking-tight">
                The trading platform<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                  that explains itself
                </span>
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed max-w-sm">
                Not just signals. Full AI reasoning. Trade smarter from day one — paper trade first, real money when you&apos;re ready.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 px-4 py-3.5 hover:border-slate-700 transition">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-lg">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{f.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/30 px-5 py-4">
              <div className="flex -space-x-2 shrink-0">
                {["🇵🇰", "🇮🇳", "🇺🇸", "🇬🇧", "🇳🇬"].map((flag, i) => (
                  <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-800 text-base">{flag}</div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300">Traders from 50+ countries</p>
                <p className="text-xs text-slate-500 mt-0.5">&ldquo;Bloomberg charges $24k/yr for this. This is free.&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="w-full">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur p-8 shadow-2xl shadow-black/40">
              {/* Mobile header */}
              <div className="lg:hidden mb-6 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  100% Free · No credit card
                </span>
              </div>

              <div className="mb-6">
                <h1 className="text-xl font-black text-slate-100">Create your account</h1>
                <p className="mt-1 text-sm text-slate-400">Start paper trading with AI in 30 seconds</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

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
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 pr-20 text-sm text-slate-100 placeholder-slate-600 outline-none transition duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition min-w-[44px] min-h-[36px] flex items-center justify-center"
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>

                  {/* Password strength */}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? strengthColors[pwStrength] : "bg-slate-800"}`}
                          />
                        ))}
                      </div>
                      {pwStrength > 0 && (
                        <p className={`text-xs ${pwStrength >= 3 ? "text-emerald-400" : pwStrength === 2 ? "text-amber-400" : "text-red-400"}`}>
                          {strengthLabels[pwStrength]} password
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3">
                    <span className="text-red-400 mt-0.5 shrink-0">⚠️</span>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-slate-950 transition duration-200 hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                      Creating account...
                    </>
                  ) : (
                    <>Create free account <span>→</span></>
                  )}
                </button>

                <p className="text-xs text-slate-500 text-center">
                  By signing up you agree to our{" "}
                  <Link href="/terms" className="text-slate-400 hover:text-slate-200 underline underline-offset-2 transition">Terms</Link>
                  {" "}&amp;{" "}
                  <Link href="/privacy" className="text-slate-400 hover:text-slate-200 underline underline-offset-2 transition">Privacy Policy</Link>
                </p>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 border-t border-slate-800" />
                <span className="text-xs text-slate-600 uppercase tracking-widest">or</span>
                <div className="flex-1 border-t border-slate-800" />
              </div>

              <Link
                href="/login"
                className="block w-full rounded-xl border border-slate-700 px-4 py-3 text-center text-sm font-semibold text-slate-300 hover:bg-slate-800/60 hover:border-slate-600 hover:text-slate-100 transition duration-200"
              >
                Sign in to existing account
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-slate-600">
              Paper trading only · Educational purposes only · Not financial advice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
