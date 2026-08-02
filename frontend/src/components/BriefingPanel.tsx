"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { LoadingCard } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

interface AssetBrief {
  symbol: string;
  price: number;
  change_percent: number;
  signal: string;
  sentiment: string;
  key_insight: string;
}

interface DailyBriefing {
  date: string;
  greeting: string;
  market_overview: string;
  top_opportunity: string;
  risk_warning: string;
  assets: AssetBrief[];
  generated_at: string;
}

interface BriefingPanelProps {
  accessToken?: string;
}

export default function BriefingPanel({ accessToken }: BriefingPanelProps) {
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<DailyBriefing>("/briefing", {}, accessToken)
      .then(setBriefing)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"))
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) return <LoadingCard rows={5} />;

  if (error || !briefing) return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
      <h2 className="text-lg font-semibold mb-4">🌅 Daily Market Briefing</h2>
      <ErrorState message={error || "Failed to load briefing"} onRetry={() => window.location.reload()} />
    </section>
  );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-semibold">🌅 Daily Market Briefing</h2>
          <p className="text-xs text-slate-500 mt-0.5">{briefing.date}</p>
        </div>
        <span className="text-xs text-slate-600">{new Date(briefing.generated_at).toLocaleTimeString()}</span>
      </div>

      {/* Greeting */}
      <p className="text-sm text-slate-300 mb-4">{briefing.greeting}</p>

      {/* Overview */}
      <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4 mb-4">
        <p className="text-xs font-semibold text-emerald-400 mb-1">📊 Market Overview</p>
        <p className="text-sm text-slate-300 leading-relaxed">{briefing.market_overview}</p>
      </div>

      {/* Assets */}
      <div className="space-y-2 mb-4">
        {briefing.assets.map((asset) => {
          const isUp = asset.change_percent >= 0;
          const sentColor = asset.sentiment === "bullish" ? "text-emerald-400" : asset.sentiment === "bearish" ? "text-red-400" : "text-slate-400";
          return (
            <div key={asset.symbol} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-100 text-sm">{asset.symbol}</span>
                  <span className={`text-xs font-medium ${sentColor} capitalize`}>{asset.signal}</span>
                  <span className={`text-xs font-mono ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                    {isUp ? "+" : ""}{asset.change_percent.toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{asset.key_insight}</p>
              </div>
              <span className={`text-lg shrink-0 ${sentColor}`}>
                {asset.sentiment === "bullish" ? "▲" : asset.sentiment === "bearish" ? "▼" : "—"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Opportunity */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 mb-3">
        <p className="text-xs font-semibold text-emerald-400 mb-1">⚡ Top Opportunity</p>
        <p className="text-sm text-slate-300">{briefing.top_opportunity}</p>
      </div>

      {/* Risk */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
        <p className="text-xs font-semibold text-red-400 mb-1">⚠️ Risk Warning</p>
        <p className="text-sm text-slate-300">{briefing.risk_warning}</p>
      </div>
    </section>
  );
}
