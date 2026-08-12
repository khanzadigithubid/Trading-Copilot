"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID  = "service_4s8szz7";
const EMAILJS_TEMPLATE_ID = "template_s91wpzj";
const EMAILJS_PUBLIC_KEY  = "P3bPGuO0JpSGjBpSJ";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Step 1: Backend generates token
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

      // Step 2: If token returned, send email via EmailJS from browser
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

      setSent(true);
    } catch (err) {
      console.error(err);
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">AI</div>
          <span className="font-semibold text-sm">Trading Copilot</span>
        </Link>
        <Link href="/login" className="text-sm text-slate-400 hover:text-slate-100 transition">
          Back to sign in
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {sent ? (
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto mb-6">
                <span className="text-3xl">📧</span>
              </div>
              <h1 className="text-2xl font-bold mb-3">Check your email</h1>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                We sent a password reset link to{" "}
                <span className="text-slate-200 font-medium">{email}</span>.
                The link expires in 1 hour.
              </p>
              <p className="text-xs text-slate-600 mb-6">
                Did not receive it? Check your spam folder.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="text-sm text-emerald-400 hover:underline"
              >
                Try a different email
              </button>
              <div className="mt-6">
                <Link href="/login"
                  className="block w-full rounded-xl border border-slate-700 px-4 py-3 text-center text-sm font-medium text-slate-300 hover:bg-slate-800 transition">
                  Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                  <span className="text-2xl">🔑</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-100">Forgot password?</h1>
                <p className="mt-1.5 text-sm text-slate-400">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
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
                      Sending...
                    </>
                  ) : "Send reset link"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-slate-500 hover:text-slate-300 transition">
                  ← Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
