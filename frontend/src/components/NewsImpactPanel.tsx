"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

interface AssetImpact {
  symbol: string;
  name: string;
  impact: string;
  reason: string;
  magnitude: string;
}

interface NewsImpactResponse {
  headline: string;
  summary: string;
  immediate_impact: string;
  timeframe: string;
  assets: AssetImpact[];
  trading_tip: string;
}

interface NewsImpactPanelProps {
  accessToken?: string;
}

const SAMPLE_HEADLINES = [
  "Federal Reserve raises interest rates by 0.25%",
  "Bitcoin ETF approved by SEC",
  "Oil prices surge as OPEC cuts production",
  "US inflation data beats expectations",
  "China GDP growth disappoints analysts",
];

export default function NewsImpactPanel({ accessToken }: NewsImpactPanelProps) {
  const [headline, setHeadline] = useState("");
  const [result, setResult] = useState<NewsImpactResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!headline.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiFetch<NewsImpactResponse>(
        "/news-impact",
        { method: "POST", body: JSON.stringify({ headline: headline.trim() }) },
        accessToken
      );
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  function impactColor(impact: string) {
    if (impact === "bullish") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (impact === "bearish") return "text-red-400 bg-red-500/10 border-red-500/30";
    return "text-slate-400 bg-slate-700/30 border-slate-600";
  }

  function magnitudeBadge(m: string) {
    if (m === "high") return "bg-red-500/20 text-red-400";
    if (m === "medium") return "bg-amber-500/20 text-amber-400";
    return "bg-slate-700 text-slate-400";
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <h2 className="text-lg font-semibold">📰 AI News Impact Analyzer</h2>
      <p className="mt-0.5 text-sm text-slate-400">Paste any news headline — AI tells you how it affects each market.</p>

      {/* Input */}
      <div className="mt-4 space-y-3">
        <textarea
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Paste a news headline here..."
          rows={2}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-500 resize-none"
        />
        <button
          onClick={analyze}
          disabled={!headline.trim() || loading}
          className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              Analyzing...
            </span>
          ) : "Analyze Impact"}
        </button>
      </div>

      {/* Sample headlines */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {SAMPLE_HEADLINES.map((h) => (
          <button key={h} onClick={() => setHeadline(h)}
            className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition">
            {h.slice(0, 35)}...
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {/* Results */}
      {result && (
        <div className="mt-5 space-y-4">
          {/* Summary */}
          <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
            <p className="text-xs font-semibold text-slate-400 mb-1">📋 Analysis</p>
            <p className="text-sm text-slate-300 mb-2">{result.summary}</p>
            <p className="text-xs text-slate-400">⏱ {result.timeframe} — {result.immediate_impact}</p>
          </div>

          {/* Asset impacts */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">Market Impact</p>
            <div className="space-y-2">
              {result.assets.map((asset) => (
                <div key={asset.symbol} className={`rounded-xl border px-4 py-3 ${impactColor(asset.impact)}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{asset.symbol}</span>
                      <span className="text-xs opacity-70">{asset.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${magnitudeBadge(asset.magnitude)}`}>
                        {asset.magnitude}
                      </span>
                      <span className="text-sm font-bold capitalize">
                        {asset.impact === "bullish" ? "▲" : asset.impact === "bearish" ? "▼" : "—"}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs opacity-80">{asset.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trading tip */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <p className="text-xs font-semibold text-amber-400 mb-1">💡 Trading Tip</p>
            <p className="text-sm text-slate-300">{result.trading_tip}</p>
          </div>
        </div>
      )}
    </section>
  );
}
