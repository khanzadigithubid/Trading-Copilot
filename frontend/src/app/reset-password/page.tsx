"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STEPS = [
  { num: 1, label: "Enter email" },
  { num: 2, label: "Check inbox" },
  { num: 3, label: "Reset password" },
];

const strengthColors     = ["bg-slate-700", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];
const strengthLabels     = ["", "Weak", "Fair", "Good", "Strong"];
const strengthTextColors = ["", "text-red-400", "text-amber-400", "text-blue-400", "text-emerald-400"];

function getPwStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

function ResetPasswordForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = decodeURIComponent(searchParams.get("token") || "").trim();

  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw]                   = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [done, setDone]                       = useState(false);
  const [error, setError]                     = useState("");
  const [countdown, setCountdown]             = useState(5);

  const pwStrength     = getPwStrength(password);
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0
    ? password === confirmPassword : null;

  useEffect(() => {
    if (!token) setError("Invalid or missing reset token. Please request a new link.");
  }, [token]);

  useEffect(() => {
    if (!done) return;
    if (countdown <= 0) { router.push("/login"); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [done, countdown, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 8)          { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });

      if (res.ok) {
        setDone(true);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Reset failed. The link may have expired.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Success state ── */
  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-4xl">
          ✅
        </div>
        <h2 className="text-xl font-black text-slate-100 mb-3">Password reset!</h2>
        <p className="text-sm text-slate-400 mb-1">Your password has been changed successfully.</p>
        <p className="text-sm text-slate-400 mb-6">
          Redirecting to sign in in{" "}
          <span className="font-bold text-emerald-400">{countdown}s</span>...
        </p>

        {/* Countdown bar */}
        <div className="mb-6 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-emerald-500 transition-all duration-1000"
            style={{ width: `${(countdown / 5) * 100}%` }}
          />
        </div>

        <Link
          href="/login"
          className="block w-full rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
        >
          Sign in now →
        </Link>
      </div>
    );
  }

  /* ── Form state ── */
  return (
    <>
      <div className="mb-7">
        <div className="mb-5 text-4xl">🔒</div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Set new password</h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Choose a strong password to secure your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* New password */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">
            New password
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
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
                {pwStrength < 4 && password.length > 0 && (
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

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">
            Confirm new password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              className={`w-full rounded-xl border bg-slate-950 px-4 py-3 pr-20 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:ring-2 ${
                passwordsMatch === false
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                  : passwordsMatch === true
                  ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20"
                  : "border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
          {passwordsMatch === false && (
            <p className="mt-1 text-xs text-red-400">❌ Passwords do not match</p>
          )}
          {passwordsMatch === true && (
            <p className="mt-1 text-xs text-emerald-400">✅ Passwords match</p>
          )}
        </div>

        {/* Token missing */}
        {!token && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3">
            <span className="shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-medium text-amber-300">Invalid reset link</p>
              <p className="text-xs text-slate-500 mt-0.5">
                <Link href="/forgot-password" className="text-emerald-400 hover:underline">
                  Request a new one →
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* General error */}
        {error && token && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3">
            <span className="text-red-400 shrink-0">⚠️</span>
            <div>
              <p className="text-sm text-red-300">{error}</p>
              {error.toLowerCase().includes("expir") && (
                <Link href="/forgot-password" className="text-xs text-emerald-400 hover:underline mt-0.5 block">
                  Request a new reset link →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !token || passwordsMatch === false}
          className="w-full rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              Resetting...
            </>
          ) : (
            "Reset password →"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/forgot-password" className="text-sm text-slate-600 hover:text-slate-400 transition">
          ← Request a new reset link
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
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

          {/* Steps — step 3 active, 1+2 completed */}
          <div className="mb-8 flex items-center justify-center">
            {STEPS.map((step, i) => {
              const isCompleted = step.num < 3;
              const isActive    = step.num === 3;
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
                    <div className={`mb-5 mx-2 h-px w-12 ${
                      step.num < 3 ? "bg-emerald-500" : "bg-slate-800"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-black/30">
            <Suspense fallback={
              <div className="flex justify-center py-10">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              </div>
            }>
              <ResetPasswordForm />
            </Suspense>
          </div>

          <p className="mt-4 text-center text-xs text-slate-700">
            🔒 Token expires in 1 hour · Secure connection
          </p>
        </div>
      </div>
    </div>
  );
}
