"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STEPS = [
  { num: 1, label: "Enter email" },
  { num: 2, label: "Check inbox" },
  { num: 3, label: "Reset password" },
];

const strengthMeta = [
  { label: "", color: "bg-slate-800", textColor: "text-slate-500" },
  { label: "Weak",   color: "bg-red-500",     textColor: "text-red-400" },
  { label: "Fair",   color: "bg-amber-500",   textColor: "text-amber-400" },
  { label: "Good",   color: "bg-blue-500",    textColor: "text-blue-400" },
  { label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-400" },
];

function getPwStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

function getPwHint(strength: number, pw: string): string {
  if (pw.length === 0) return "";
  if (pw.length < 8) return "Need at least 8 characters";
  if (!/[A-Z]/.test(pw)) return "Add an uppercase letter";
  if (!/[0-9]/.test(pw)) return "Add a number";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Add a symbol for max strength";
  return "Great password!";
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = decodeURIComponent(searchParams.get("token") || "").trim();

  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [done, setDone]                       = useState(false);
  const [error, setError]                     = useState("");
  const [countdown, setCountdown]             = useState(5);

  const pwStrength = getPwStrength(password);
  const pwHint     = getPwHint(pwStrength, password);
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0
    ? password === confirmPassword
    : null;

  useEffect(() => {
    if (!token) setError("Invalid or missing reset token. Please request a new reset link.");
  }, [token]);

  // Countdown redirect after success
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
        {/* Animated checkmark */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/15 animate-ping opacity-30" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
            <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">Password reset!</h2>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          Your password has been changed successfully.
          <br />
          Redirecting to sign in in{" "}
          <span className="font-bold text-emerald-400">{countdown}s</span>...
        </p>

        {/* Countdown ring */}
        <div className="my-6 flex items-center justify-center">
          <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke="#10b981" strokeWidth="2.5"
              strokeDasharray={`${(countdown / 5) * 100} 100`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
        </div>

        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all"
        >
          Sign in now
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    );
  }

  /* ── Form state ── */
  return (
    <>
      <div className="mb-7">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Set new password</h1>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          Choose a strong password to secure your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* New password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            New password
          </label>
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full rounded-xl border border-white/8 bg-white/5 pl-11 pr-16 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:border-emerald-500/60 focus:bg-white/8 focus:ring-2 focus:ring-emerald-500/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-white/8 transition-all"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Strength meter */}
          {password.length > 0 && (
            <div className="space-y-1.5 pt-1">
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
                <p className={`text-xs font-medium ${strengthMeta[pwStrength].textColor}`}>
                  {strengthMeta[pwStrength].label}
                </p>
                <p className="text-xs text-slate-600">{pwHint}</p>
              </div>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Confirm new password
          </label>
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              {/* Match indicator icon */}
              {passwordsMatch === true ? (
                <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : passwordsMatch === false ? (
                <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              className={`w-full rounded-xl border bg-white/5 pl-11 pr-16 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:ring-2 ${
                passwordsMatch === false
                  ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/15"
                  : passwordsMatch === true
                  ? "border-emerald-500/40 focus:border-emerald-500/60 focus:ring-emerald-500/15"
                  : "border-white/8 focus:border-emerald-500/60 focus:bg-white/8 focus:ring-emerald-500/15"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-white/8 transition-all"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
          {passwordsMatch === false && (
            <p className="text-xs text-red-400">Passwords do not match</p>
          )}
          {passwordsMatch === true && (
            <p className="text-xs text-emerald-400">Passwords match ✓</p>
          )}
        </div>

        {/* Token error */}
        {!token && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3">
            <span className="text-amber-400 mt-0.5 shrink-0 text-sm">⚠️</span>
            <div>
              <p className="text-sm font-medium text-amber-300">Invalid reset link</p>
              <p className="text-xs text-slate-500 mt-0.5">
                This link is missing a token.{" "}
                <Link href="/forgot-password" className="text-emerald-400 hover:underline">
                  Request a new one →
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* General error */}
        {error && token && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/15">
              <svg className="h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
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
          className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              Resetting password...
            </>
          ) : (
            <>
              Reset password
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-400 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Request a new reset link
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col">

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[10%] h-[500px] w-[500px] rounded-full bg-emerald-600/8 blur-[130px]" />
        <div className="absolute bottom-0 left-[10%] h-[350px] w-[350px] rounded-full bg-violet-600/6 blur-[100px]" />
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

          {/* Steps indicator — step 3 active */}
          <div className="mb-10 flex items-center justify-center gap-0">
            {STEPS.map((step, i) => {
              const isCompleted = step.num < 3;
              const isActive    = step.num === 3;
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
                    <span className={`text-xs font-medium whitespace-nowrap ${
                      isActive ? "text-emerald-400" : isCompleted ? "text-emerald-500" : "text-slate-600"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`mb-5 mx-3 h-px w-16 ${
                      step.num < 3 ? "bg-emerald-500" : "bg-white/8"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-xl p-8 shadow-2xl shadow-black/60">
            <Suspense fallback={
              <div className="flex justify-center py-10">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              </div>
            }>
              <ResetPasswordForm />
            </Suspense>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-700">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Token expires in 1 hour · Secure connection
          </div>
        </div>
      </div>
    </div>
  );
}
