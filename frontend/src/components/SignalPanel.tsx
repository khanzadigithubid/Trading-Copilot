"use client";

import { useEffect, useState } from "react";

import { fetchSignal } from "@/lib/signals";
import type { TradingSignal } from "@/types/signal";

function signalBadgeClass(signal: string): string {
  switch (signal) {
    case "BUY":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    case "SELL":
      return "bg-red-500/15 text-red-300 border-red-500/30";
    default:
      return "bg-slate-500/15 text-slate-300 border-slate-500/30";
  }
}

function riskBadgeClass(risk: string): string {
  switch (risk) {
    case "high":
      return "text-red-400";
    case "medium":
      return "text-amber-400";
    default:
      return "text-emerald-400";
  }
}

interface SignalPanelProps {
  symbol: string | null;
  accessToken?: string;
}

export default function SignalPanel({ symbol, accessToken }: SignalPanelProps) {
  const [signal, setSignal] = useState<TradingSignal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSignal(null);
    setError(null);
  }, [symbol]);

  async function loadSignal(refresh = false) {
    if (!symbol) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchSignal(symbol, refresh, accessToken);
      setSignal(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load signal");
      setSignal(null);
    } finally {
      setLoading(false);
    }
  }

  if (!symbol) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
        <h2 className="text-lg font-semibold">AI Signal</h2>
        <p className="mt-4 text-sm text-slate-400">Select an asset from the table to generate an AI trading signal.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">AI Signal — {symbol}</h2>
          <p className="mt-1 text-sm text-slate-400">RSI, MACD, and moving averages analyzed with AI reasoning.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => loadSignal(false)}
            disabled={loading}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition"
          >
            {loading ? "Analyzing..." : "Get Signal"}
          </button>
          <button
            onClick={() => loadSignal(true)}
            disabled={loading}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-50 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {signal && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full border px-4 py-1.5 text-sm font-bold ${signalBadgeClass(signal.signal)}`}>
              {signal.signal}
            </span>
            <span className="text-sm text-slate-300">Confidence: {signal.confidence.toFixed(0)}%</span>
            <span className={`text-sm capitalize ${riskBadgeClass(signal.risk_level)}`}>
              {signal.risk_level} risk
            </span>
            {signal.source && (
              <span className="text-xs uppercase text-slate-500">via {signal.source}</span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-slate-300">{signal.reasoning}</p>

          {signal.indicators && (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {[
                ["RSI", signal.indicators.rsi],
                ["MACD", signal.indicators.macd],
                ["MACD Signal", signal.indicators.macd_signal],
                ["MA50", signal.indicators.ma50],
                ["MA200", signal.indicators.ma200],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 font-mono text-sm text-slate-200">
                    {value != null ? Number(value).toFixed(2) : "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
