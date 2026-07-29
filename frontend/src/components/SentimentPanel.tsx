"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface SentimentAsset {
  symbol: string;
  market_type: string;
  name: string;
  score: number;        // -1.0 to +1.0
  label: string;
  color: string;
  headline: string;
  source: string;
}

interface SentimentData {
  assets: SentimentAsset[];
  generated_at: string;
}

type MarketFilter = "all" | "forex" | "crypto" | "stock";

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(((score + 1) / 2) * 100); // map -1..1 → 0..100
  const barColor =
    score >= 0.5  ? "bg-emerald-500" :
    score >= 0.2  ? "bg-emerald-400" :
    score >= -0.2 ? "bg-slate-500"   :
    score >= -0.5 ? "bg-red-400"     : "bg-red-600";

  return (
    <div className="relative h-1.5 w-full rounded-full bg-slate-800">
      <div
        className={`absolute left-1/2 h-1.5 rounded-full transition-all ${barColor}`}
        style={
          score >= 0
            ? { left: "50%", width: `${pct - 50}%` }
            : { left: `${pct}%`, width: `${50 - pct}%` }
        }
      />
      {/* Centre line */}
      <div className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-px bg-slate-600" />
    </div>
  );
}

function HeatCell({
  asset,
  selected,
  onClick,
}: {
  asset: SentimentAsset;
  selected: boolean;
  onClick: () => void;
}) {
  const opacity =
    asset.score >= 0.5  ? "bg-emerald-500/80" :
    asset.score >= 0.2  ? "bg-emerald-500/40" :
    asset.score >= -0.2 ? "bg-slate-700/60"   :
    asset.score >= -0.5 ? "bg-red-500/40"     : "bg-red-600/80";

  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-3 text-left transition hover:scale-[1.02] active:scale-100 ${opacity} ${
        selected ? "ring-2 ring-white ring-offset-1 ring-offset-slate-950" : "border-transparent"
      }`}
    >
      <p className="font-semibold text-sm text-slate-100">{asset.symbol}</p>
      <p className="mt-0.5 text-xs text-slate-300 truncate">{asset.name}</p>
      <p className="mt-1.5 text-xs font-medium text-slate-200">{asset.label}</p>
      <p className="mt-1 text-xs font-mono text-slate-300">
        {asset.score >= 0 ? "+" : ""}{asset.score.toFixed(2)}
      </p>
    </button>
  );
}

export default function SentimentPanel() {
  const [data, setData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<MarketFilter>("all");
  const [selected, setSelected] = useState<SentimentAsset | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch<SentimentData>("/sentiment");
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sentiment");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = data?.assets.filter(
    (a) => filter === "all" || a.market_type === filter
  ) ?? [];

  const bullish  = filtered.filter((a) => a.score >= 0.2).length;
  const bearish  = filtered.filter((a) => a.score <= -0.2).length;
  const neutral  = filtered.length - bullish - bearish;
  const avgScore = filtered.length
    ? filtered.reduce((s, a) => s + a.score, 0) / filtered.length
    : 0;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Sentiment Heatmap</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            Price-action + news sentiment across all 27 markets
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Market summary bar */}
      {data && (
        <div className="mt-4 flex flex-wrap gap-4 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm">
          <div>
            <span className="text-slate-500">Market mood: </span>
            <span className={`font-semibold ${avgScore >= 0.2 ? "text-emerald-400" : avgScore <= -0.2 ? "text-red-400" : "text-slate-300"}`}>
              {avgScore >= 0.5 ? "Very Bullish" : avgScore >= 0.2 ? "Bullish" : avgScore >= -0.2 ? "Neutral" : avgScore >= -0.5 ? "Bearish" : "Very Bearish"}
            </span>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="text-emerald-400">▲ {bullish} bullish</span>
            <span className="text-slate-400">— {neutral} neutral</span>
            <span className="text-red-400">▼ {bearish} bearish</span>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="mt-4 flex gap-2">
        {(["all", "forex", "crypto", "stock"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
              filter === f
                ? "bg-emerald-500 text-slate-950"
                : "border border-slate-700 text-slate-400 hover:bg-slate-800"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {loading ? (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-800" />
          ))}
        </div>
      ) : (
        <>
          {/* Heatmap grid */}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {filtered.map((asset) => (
              <HeatCell
                key={asset.symbol}
                asset={asset}
                selected={selected?.symbol === asset.symbol}
                onClick={() => setSelected(selected?.symbol === asset.symbol ? null : asset)}
              />
            ))}
          </div>

          {/* Detail card */}
          {selected && (
            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-100">
                    {selected.symbol}
                    <span className="ml-2 text-sm font-normal text-slate-400">{selected.name}</span>
                  </p>
                  <p className={`mt-0.5 text-sm font-medium ${
                    selected.score >= 0.2 ? "text-emerald-400" : selected.score <= -0.2 ? "text-red-400" : "text-slate-400"
                  }`}>
                    {selected.label} · Score: {selected.score >= 0 ? "+" : ""}{selected.score.toFixed(3)}
                  </p>
                </div>
                <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-500 uppercase">
                  via {selected.source}
                </span>
              </div>
              <ScoreBar score={selected.score} />
              {selected.headline && (
                <p className="mt-3 text-xs leading-relaxed text-slate-400 italic">
                  &ldquo;{selected.headline}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* Score bar list */}
          <div className="mt-6 space-y-2">
            {filtered.slice(0, 8).map((asset) => (
              <div key={asset.symbol} className="flex items-center gap-3 text-xs">
                <span className="w-20 shrink-0 font-mono text-slate-300">{asset.symbol}</span>
                <div className="flex-1">
                  <ScoreBar score={asset.score} />
                </div>
                <span className={`w-24 text-right font-medium ${
                  asset.score >= 0.2 ? "text-emerald-400" : asset.score <= -0.2 ? "text-red-400" : "text-slate-400"
                }`}>
                  {asset.label}
                </span>
              </div>
            ))}
          </div>

          {data && (
            <p className="mt-4 text-right text-xs text-slate-600">
              Updated: {new Date(data.generated_at).toLocaleTimeString()}
            </p>
          )}
        </>
      )}
    </section>
  );
}
