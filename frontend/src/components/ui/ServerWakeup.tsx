"use client";

import { useEffect, useState } from "react";

interface ServerWakeupProps {
  onRetry: () => void;
  retryAfterSeconds?: number;
}

/**
 * Shows a progress bar + countdown when the backend is waking up (Render free tier).
 * Automatically retries after `retryAfterSeconds` (default 35s).
 */
export default function ServerWakeup({ onRetry, retryAfterSeconds = 35 }: ServerWakeupProps) {
  const [seconds, setSeconds] = useState(retryAfterSeconds);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      setRetrying(true);
      onRetry();
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, onRetry]);

  const progress = Math.round(((retryAfterSeconds - seconds) / retryAfterSeconds) * 100);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
      {/* Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
        <span className="text-2xl animate-pulse">⚡</span>
      </div>

      <div>
        <p className="font-semibold text-amber-300">Server is waking up...</p>
        <p className="mt-1 text-sm text-slate-400">
          The free server sleeps after 15 minutes of inactivity.
          <br />
          Auto-retrying in <span className="font-mono text-amber-300">{seconds}s</span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-1.5 rounded-full bg-amber-500 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-slate-600">{progress}%</p>
      </div>

      {/* Manual retry */}
      <button
        onClick={() => { setRetrying(true); onRetry(); }}
        disabled={retrying}
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50 transition"
      >
        {retrying ? "Retrying..." : "Retry now"}
      </button>
    </div>
  );
}
