"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-6 px-4 sm:px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-xl sm:text-3xl">
        📡
      </div>
      <div>
        <h1 className="text-2xl font-semibold">You&apos;re offline</h1>
        <p className="mt-2 text-slate-400">
          No internet connection detected. Check your network and try again.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="rounded-full bg-emerald-500 px-4 sm:px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
      >
        Try again
      </button>
    </div>
  );
}
