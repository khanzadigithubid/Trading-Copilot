"use client";

import { useState } from "react";
import { fetchMTFSignal } from "@/lib/mtf";
import type { MTFSignalResponse, TimeframeSignal } from "@/types/mtf";
import type { SignalAction } from "@/types/signal";

interface MTFSignalPanelProps {
  symbol: string | null;
  accessToken?: string;
}

function signalColor(signal: SignalAction) {
  if (signal === "BUY") return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  if (signal === "SELL") return "text-red-400 border-red-500/30 bg-red-500/10";
  return "text-slate-400 border-slate-500/30 bg-slate-500/10";
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 70 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800">
      <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function TFCard({ tf }: { tf: TimeframeSignal }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">{tf.label}</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-200">{tf.timeframe.toUpperCase()} chart</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${signalColor(tf.signal)}`}>
          {tf.signal}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <span>Confidence: {tf.confidence.toFixed(0)}%</span>
      </div>
      <ConfidenceBar value={tf.confidence} />

      {tf.indicators && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          {[
            ["RSI", tf.indicators.rsi],
            ["MACD", tf.indicators.macd],
            ["MA50", tf.indicators.ma50],
          ].map(([label, val]) => (
            <div key={String(label)} className="rounded bg-slate-900 px-2 py-1.5">
              <p className="text-slate-600">{label}</p>
              <p className="font-mono text-slate-300">
                {val != null ? Number(val).toFixed(2) : "—"}
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((p) => !p)}
        className="mt-2 text-xs text-emerald-500 hover:text-emerald-400 transition"
      >
        {open ? "▼ Hide reasoning" : "▶ Show reasoning"}
      </button>
      {open && (
        <p className="mt-2 text-xs leading-relaxed text-slate-400">{tf.reasoning}</p>
      )}
    </div>
  );
}

export default function MTFSignalPanel({ symbol, accessToken }: MTFSignalPanelProps) {
  const [data, setData] = useState<MTFSignalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyse() {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchMTFSignal(symbol, accessToken);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  if (!symbol) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold">Multi-Timeframe Analysis</h2>
        <p className="mt-3 text-sm text-slate-400">
          Select an asset to run 1D · 1W · 1M signal analysis.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Multi-Timeframe — {symbol}</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            1D · 1W · 1M signals combined into one verdict.
          </p>
        </div>
        <button
          onClick={handleAnalyse}
          disabled={loading}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              Analysing...
            </span>
          ) : (
            "Run MTF Analysis"
          )}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {data && (
        <div className="mt-5 space-y-4">
          {/* Combined verdict */}
          <div className={`rounded-xl border p-4 ${
            data.combined_signal === "BUY"
              ? "border-emerald-500/30 bg-emerald-500/8"
              : data.combined_signal === "SELL"
              ? "border-red-500/30 bg-red-500/8"
              : "border-slate-700 bg-slate-950/40"
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`rounded-full border px-4 py-1.5 text-sm font-bold ${signalColor(data.combined_signal)}`}>
                  {data.combined_signal}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    Combined Signal · {data.combined_confidence.toFixed(0)}% confidence
                  </p>
                  <p className="text-xs text-slate-400">
                    {data.agreement
                      ? "✓ All timeframes agree — strong conviction"
                      : "⚠ Timeframes diverge — trade with caution"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize border ${
                  data.risk_level === "low"
                    ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                    : data.risk_level === "medium"
                    ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                    : "text-red-400 border-red-500/30 bg-red-500/10"
                }`}>
                  {data.risk_level} risk
                </span>
                {data.agreement && (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                    ✓ Aligned
                  </span>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {data.combined_reasoning}
            </p>
            <ConfidenceBar value={data.combined_confidence} />
          </div>

          {/* Per-timeframe breakdown */}
          <div className="grid gap-3 sm:grid-cols-3">
            {data.timeframes.map((tf) => (
              <TFCard key={tf.timeframe} tf={tf} />
            ))}
          </div>
        </div>
      )}

      {!data && !loading && !error && (
        <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-8 text-center">
          <p className="text-sm text-slate-500">
            Click &quot;Run MTF Analysis&quot; to analyse {symbol} across three timeframes simultaneously.
          </p>
        </div>
      )}
    </section>
  );
}
