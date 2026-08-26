"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID  = "service_4s8szz7";
const EMAILJS_TEMPLATE_ID = "template_s91wpzj";
const EMAILJS_PUBLIC_KEY  = "P3bPGuO0JpSGjBpSJ";

const STEPS = [
  { num: 1, label: "Enter email" },
  { num: 2, label: "Check inbox" },
  { num: 3, label: "Reset password" },
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
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
        setError("Something went wrong. Please try again.");
        return;
      }

      const data = await res.json();

      if (data.reset_token) {
        const resetLink = `https://kw-trading-copilot.vercel.app/reset-password?token=${data.reset_token}`;
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: "AI Trading Copilot",
            from_email: "noreply@trading-copilot.app",
            email: data.email,
            subject: "Reset your AI Trading Copilot password",
            message: `Click the link below to reset your password (expires in 1 hour):\n\n${resetLink}\n\nIf you did not request this, ignore this email.`,
            phone: "",
          },
          EMAILJS_PUBLIC_KEY
        );
      }

      setActiveStep(2);
      setSent(true);
    } catch (err) {
      console.error(err);
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col">

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] h-[500px] w-[500px] rounded-full bg-emerald-600/8 blur-[130px]" />
        <div className="absolute bottom-0 right-[10%] h-[350px] w-[350px] rounded-full bg-blue-600/6 blur-[100px]" />
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
        <Link
          href="/login"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to sign in
        </Link>
      </nav>

      {/* Main */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">

          {/* Steps indicator */}
          <div className="mb-10 flex items-center justify-center gap-0">
            {STEPS.map((step, i) => {
              const isCompleted = step.num < activeStep;
              const isActive    = step.num === activeStep;
              return (
                <div key={step.num} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                        isCompleted
                          ? "border-emerald-500 bg-emerald-500 text-slate-950"
                          : isActive
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                          : "border-white/10 bg-white/4 text-slate-600"
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        step.num
                      )}
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap transition-colors ${
                      isActive ? "text-emerald-400" : isCompleted ? "text-emerald-500" : "text-slate-600"
                    }`}>
                      {step.label}
                    </span>
                  </div>

                  {/* Connector */}
                  {i < STEPS.length - 1 && (
                    <div className={`mb-5 mx-3 h-px w-16 transition-all duration-500 ${
                      step.num < activeStep ? "bg-emerald-500" : "bg-white/8"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-xl p-8 shadow-2xl shadow-black/60">

            {sent ? (
              /* ── Success state ── */
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
                  <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>

                <h2 className="text-2xl font-black text-white tracking-tight">Check your inbox</h2>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  We sent a reset link to{" "}
                  <span className="font-semibold text-slate-200">{email}</span>.
                  <br />
                  The link expires in <span className="text-emerald-400 font-medium">1 hour</span>.
                </p>

                {/* Tip box */}
                <div className="mt-6 rounded-xl border border-amber-500/15 bg-amber-500/6 px-4 py-3.5 text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-amber-400 mt-0.5 shrink-0">💡</span>
                    <div>
                      <p className="text-xs font-semibold text-amber-300">Can&apos;t find the email?</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Check your spam or junk folder. Sometimes it takes 1–2 minutes to arrive.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/login"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 transition-all"
                  >
                    Back to sign in
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => { setSent(false); setEmail(""); setActiveStep(1); }}
                    className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/8 hover:text-slate-200 transition-all"
                  >
                    Try a different email
                  </button>
                </div>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                <div className="mb-7">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Forgot your password?</h1>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    No worries. Enter your email and we&apos;ll send you a secure reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                        Sending reset link...
                      </>
                    ) : (
                      <>
                        Send reset link
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to sign in
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Security note */}
          {!sent && (
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Secure · Token expires in 1 hour · No spam ever
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
