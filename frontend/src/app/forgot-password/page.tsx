"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const STEPS = [
  { num: 1, label: "Enter email" },
  { num: 2, label: "Check inbox" },
  { num: 3, label: "Reset password" },
];

export default function ForgotPasswordPage() {
  const [email, setEmail]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [sent, setSent]             = useState(false);
  const [error, setError]           = useState("");
  const [activeStep, setActiveStep] = useState(1);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Something went wrong. Please try again.");
        return;
      }

      // Backend sends email directly via Gmail SMTP — no EmailJS needed
      setActiveStep(2);
      setSent(true);
    } catch {
      setError("Cannot reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">AI</div>
            <span className="font-semibold text-slate-100 text-sm sm:text-base">Trading Copilot</span>
          </Link>
          <Link href="/login" className="text-sm text-slate-400 hover:text-slate-100 transition">
            ← Back to sign in
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">

          {/* Step indicator */}
          <div className="mb-8 flex items-center justify-center">
            {STEPS.map((step, i) => {
              const isCompleted = step.num < activeStep;
              const isActive    = step.num === activeStep;
              return (
                <div key={step.num} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                      isCompleted
                        ? "border-emerald-500 bg-emerald-500 text-slate-950"
                        : isActive
                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                        : "border-slate-700 bg-slate-900 text-slate-600"
                    }`}>
                      {isCompleted ? "✓" : step.num}
                    </div>
                    <span className={`text-[10px] font-medium whitespace-nowrap ${
                      isActive ? "text-emerald-400" : isCompleted ? "text-emerald-500" : "text-slate-600"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`mb-5 mx-2 h-px w-12 transition-all ${
                      step.num < activeStep ? "bg-emerald-500" : "bg-slate-800"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-black/30">

            {sent ? (
              /* ── Success state ── */
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-4xl">
                  📧
                </div>
                <h2 className="text-xl font-black text-slate-100 mb-3">Check your inbox</h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-2">
                  We sent a reset link to{" "}
                  <span className="font-semibold text-slate-200">{email}</span>.
                </p>
                <p className="text-sm text-slate-400 mb-6">
                  Link expires in <span className="text-emerald-400 font-medium">1 hour</span>.
                </p>

                {/* Tip */}
                <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-left">
                  <p className="text-xs font-semibold text-amber-400 mb-0.5">💡 Can&apos;t find the email?</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Check your spam or junk folder. It can take 1–2 minutes to arrive.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block w-full rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
                  >
                    Back to sign in →
                  </Link>
                  <button
                    onClick={() => { setSent(false); setEmail(""); setActiveStep(1); }}
                    className="block w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
                  >
                    Try a different email
                  </button>
                </div>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                <div className="mb-7">
                  <div className="mb-5 text-4xl">🔑</div>
                  <h1 className="text-2xl font-black text-slate-100 tracking-tight">Forgot your password?</h1>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    No worries. Enter your email and we&apos;ll send you a secure reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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

                  {error && (
                    <div className="flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3">
                      <span className="text-red-400 shrink-0">⚠️</span>
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      "Send reset link →"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/login" className="text-sm text-slate-600 hover:text-slate-400 transition">
                    ← Back to sign in
                  </Link>
                </div>
              </>
            )}
          </div>

          {!sent && (
            <p className="mt-4 text-center text-xs text-slate-700">
              🔒 Token expires in 1 hour · No spam ever
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
