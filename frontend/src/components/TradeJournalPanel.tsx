"use client";

import { useEffect, useState } from "react";
import { fetchJournal } from "@/lib/journal";
import type { JournalEntry, TradeRating } from "@/types/journal";

interface TradeJournalPanelProps {
  accessToken?: string;
}

function ratingConfig(rating: TradeRating) {
  switch (rating) {
    case "excellent":
      return { label: "Excellent", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };
    case "good":
      return { label: "Good", cls: "bg-blue-500/15 text-blue-300 border-blue-500/30" };
    case "poor":
      return { label: "Poor", cls: "bg-red-500/15 text-red-300 border-red-500/30" };
  }
}

function EntryCard({ entry }: { entry: JournalEntry }) {
  const [expanded, setExpanded] = useState(false);
  const isProfit = entry.pnl >= 0;
  const rating = ratingConfig(entry.rating);
  const hours = Math.floor(entry.duration_minutes / 60);
  const mins = entry.duration_minutes % 60;
  const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      {/* Top row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-100">{entry.symbol}</span>
          <span
            className={`rounded px-1.5 py-0.5 text-xs font-medium ${
              entry.type === "BUY"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {entry.type}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${rating.cls}`}>
            {rating.label}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className={`font-mono font-semibold ${isProfit ? "text-emerald-400" : "text-red-400"}`}>
            {isProfit ? "+" : ""}${entry.pnl.toFixed(2)}
          </span>
          <span className={`text-xs ${isProfit ? "text-emerald-500" : "text-red-500"}`}>
            ({isProfit ? "+" : ""}{entry.pnl_percent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Price info */}
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
        <span>Entry: <span className="font-mono text-slate-300">{entry.entry_price.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span></span>
        <span>Exit: <span className="font-mono text-slate-300">{entry.exit_price.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span></span>
        <span>Size: <span className="font-mono text-slate-300">{entry.size}</span></span>
        <span>Duration: <span className="text-slate-300">{durationStr}</span></span>
        <span>{new Date(entry.created_at).toLocaleDateString()}</span>
      </div>

      {/* AI Analysis (collapsible) */}
      <div className="mt-3">
        <button
          onClick={() => setExpanded((p) => !p)}
          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition"
        >
          <span>{expanded ? "▼" : "▶"}</span>
          <span>AI Analysis</span>
        </button>
        {expanded && (
          <div className="mt-2 space-y-2">
            <p className="text-sm leading-relaxed text-slate-300">{entry.ai_analysis}</p>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
              <p className="text-xs font-semibold text-amber-400">Key lesson</p>
              <p className="mt-0.5 text-xs text-slate-300">{entry.lesson}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TradeJournalPanel({ accessToken }: TradeJournalPanelProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TradeRating | "all">("all");

  useEffect(() => {
    fetchJournal(accessToken)
      .then((data) => setEntries(data.entries))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load journal"))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const filtered =
    filter === "all" ? entries : entries.filter((e) => e.rating === filter);

  const counts = {
    excellent: entries.filter((e) => e.rating === "excellent").length,
    good: entries.filter((e) => e.rating === "good").length,
    poor: entries.filter((e) => e.rating === "poor").length,
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">AI Trade Journal</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            Auto-generated analysis and lessons for every closed trade.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-emerald-400 font-semibold">{counts.excellent} excellent</span>
          <span className="text-slate-500">·</span>
          <span className="text-blue-400 font-semibold">{counts.good} good</span>
          <span className="text-slate-500">·</span>
          <span className="text-red-400 font-semibold">{counts.poor} poor</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mt-4 flex gap-2">
        {(["all", "excellent", "good", "poor"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
              filter === f
                ? "bg-emerald-500 text-slate-950"
                : "border border-slate-700 text-slate-400 hover:bg-slate-800"
            }`}
          >
            {f === "all" ? `All (${entries.length})` : `${f} (${counts[f]})`}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {loading ? (
          <p className="text-sm text-slate-500">Loading journal...</p>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-8 text-center">
            <p className="text-sm text-slate-500">
              {entries.length === 0
                ? "No closed trades yet. Open and close a paper trade to see your journal."
                : "No trades match this filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filtered.map((entry) => (
              <EntryCard key={entry.trade_id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
