export function LoadingSpinner({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "h-8 w-8" : size === "md" ? "h-6 w-6" : "h-4 w-4";
  return (
    <div className={`${s} animate-spin rounded-full border-2 border-emerald-500 border-t-transparent`} />
  );
}

export function LoadingCard({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-5 w-40 rounded-lg bg-slate-800" />
        <div className="h-4 w-24 rounded-lg bg-slate-800 ml-auto" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-4 rounded-lg bg-slate-800" style={{ width: `${60 + (i % 3) * 15}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function InlineLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-slate-400 text-sm">
      <LoadingSpinner size="sm" />
      <span>{text}</span>
    </div>
  );
}
