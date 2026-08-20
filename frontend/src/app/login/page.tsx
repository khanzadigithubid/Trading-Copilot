"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) { setError("Invalid email or password. Please try again."); return; }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[80px]" />
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
          No account?{" "}
          <Link href="/register" className="font-semibold text-emerald-400 hover:text-emerald-300 transition">
            Sign up free →
          </Link>
        </p>
      </nav>

      {/* Content */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">

          {/* Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur p-8 shadow-2xl shadow-black/40">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 border border-emerald-500/20 mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h1 className="text-2xl font-black text-slate-100">Welcome back</h1>
              <p className="mt-1 text-sm text-slate-400">Sign in to your trading dashboard</p>
            </div>

            {/* Form */}
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
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 pr-20 text-sm text-slate-100 placeholder-slate-600 outline-none transition duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
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
                    Signing in...
                  </>
                ) : (
                  <>Sign in<span className="ml-1">→</span></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 border-t border-slate-800" />
              <span className="text-xs text-slate-600 uppercase tracking-widest">or</span>
              <div className="flex-1 border-t border-slate-800" />
            </div>

            <Link
              href="/register"
              className="block w-full rounded-xl border border-slate-700 px-4 py-3 text-center text-sm font-semibold text-slate-300 hover:bg-slate-800/60 hover:border-slate-600 hover:text-slate-100 transition duration-200"
            >
              Create free account
            </Link>
          </div>

          <p className="mt-5 text-center text-xs text-slate-600">
            Paper trading only · Educational purposes · Not financial advice
          </p>
        </div>
      </div>
    </div>
  );
}
