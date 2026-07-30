"use client";

export function SkeletonLine({ width = "100%", height = "h-4" }: { width?: string; height?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-800 ${height}`}
      style={{ width }}
    />
  );
}

export function SkeletonCard({ rows = 3, className = "" }: { rows?: number; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3 ${className}`}>
      <SkeletonLine height="h-5" width="40%" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine key={i} height="h-3" width={i % 2 === 0 ? "100%" : "75%"} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-800/50 px-4 py-3 animate-pulse">
          <div className="h-4 w-20 rounded bg-slate-700" />
          <div className="h-4 w-14 rounded-full bg-slate-700" />
          <div className="ml-auto h-4 w-20 rounded bg-slate-700" />
          <div className="h-4 w-12 rounded bg-slate-700" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-slate-800" />
          <div className="h-3 w-24 rounded bg-slate-800" />
        </div>
        <div className="h-8 w-28 rounded bg-slate-800" />
      </div>
      <div className="flex gap-2 mb-4">
        {["1D","1W","1M","1Y"].map((t) => (
          <div key={t} className="h-7 w-10 rounded-lg bg-slate-800" />
        ))}
      </div>
      {/* Chart bars */}
      <div className="flex items-end gap-1 h-48">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-slate-800"
            style={{ height: `${20 + Math.random() * 60}%` }}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3 border-t border-slate-800 pt-4">
        {["Open","High","Low","Volume"].map((l) => (
          <div key={l} className="text-center space-y-1">
            <div className="h-3 w-10 mx-auto rounded bg-slate-800" />
            <div className="h-4 w-16 mx-auto rounded bg-slate-700" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonSignal() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 animate-pulse">
      <div className="flex justify-between mb-5">
        <div className="space-y-2">
          <div className="h-5 w-48 rounded bg-slate-800" />
          <div className="h-3 w-32 rounded bg-slate-800" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 rounded-lg bg-slate-800" />
          <div className="h-9 w-20 rounded-lg bg-slate-800" />
        </div>
      </div>
      <div className="flex gap-3 mb-4">
        <div className="h-8 w-16 rounded-full bg-slate-800" />
        <div className="h-8 w-28 rounded bg-slate-800" />
        <div className="h-8 w-20 rounded bg-slate-800" />
      </div>
      <div className="h-16 rounded-lg bg-slate-800 mb-4" />
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-slate-800" />
        ))}
      </div>
    </div>
  );
}
