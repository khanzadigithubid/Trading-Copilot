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
  { icon: "🤖", text: "AI signals with plain-English explanation" },
  { icon: "📚", text: "Auto trade coaching after every position" },
  { icon: "🌍", text: "27 markets — Forex, Crypto, Stocks, Gold" },
  { icon: "📊", text: "Portfolio analytics & risk manager" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch<TokenResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) { setError("Account created — please sign in."); return; }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">AI</div>
          <span className="font-semibold text-sm">Trading Copilot</span>
        </Link>
        <p className="text-sm text-slate-400">
          Have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition">
            Sign in
          </Link>
        </p>
      </div>

      {/* Main — 2 column on desktop */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl grid gap-12 lg:grid-cols-2 items-center">

          {/* Left — features (desktop only) */}
          <div className="hidden lg:block">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                100% Free · No credit card
              </span>
            </div>
            <h2 className="text-3xl font-bold leading-tight">
              Start trading smarter<br />
              <span className="text-emerald-400">with AI by your side</span>
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              Join traders who use AI to understand markets — not just guess. 
              Get started in 30 seconds.
            </p>
            <div className="mt-8 space-y-4">
              {FEATURES.map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-lg">{f.icon}</span>
                  </div>
                  <p className="text-sm text-slate-300">{f.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-2">
                  {["🇵🇰","🇮🇳","🇺🇸","🇬🇧","🇳🇬"].map((flag, i) => (
                    <span key={i} className="text-lg">{flag}</span>
                  ))}
                </div>
                <span className="text-xs text-slate-400">Traders worldwide</span>
              </div>
              <p className="text-xs text-slate-500">
                &ldquo;Bloomberg charges $24,000/year for this level of insight. This is free.&rdquo;
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="w-full max-w-sm mx-auto lg:mx-0">
            <div className="mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6 lg:hidden">
                <span className="text-2xl">🚀</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-100">Create your account</h1>
              <p className="mt-1.5 text-sm text-slate-400">Free forever · No credit card needed</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
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
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Password
                  <span className="ml-1 text-xs text-slate-500 font-normal">(min. 8 characters)</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 pr-10 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition text-xs"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                    Creating account...
                  </>
                ) : "Create free account →"}
              </button>

              <p className="text-xs text-slate-500 text-center leading-relaxed">
                By signing up you agree to our{" "}
                <Link href="/terms" className="text-slate-400 hover:text-slate-200 underline">Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-slate-400 hover:text-slate-200 underline">Privacy Policy</Link>
              </p>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 border-t border-slate-800" />
              <span className="text-xs text-slate-600">OR</span>
              <div className="flex-1 border-t border-slate-800" />
            </div>

            <Link
              href="/login"
              className="block w-full rounded-xl border border-slate-700 px-4 py-3 text-center text-sm font-medium text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition"
            >
              Sign in to existing account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
