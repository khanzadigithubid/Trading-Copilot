"use client";

import { useEffect, useState } from "react";

import { fetchPositionSize, fetchRiskSummary } from "@/lib/risk";
import type { PositionSizeResult, UserRiskSummary } from "@/types/risk";

function alertClass(severity: string): string {
  switch (severity) {
    case "high":
      return "border-red-500/30 bg-red-500/10 text-red-300";
    case "medium":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    default:
      return "border-slate-600 bg-slate-800/50 text-slate-300";
  }
}

interface RiskPanelProps {
  accessToken?: string;
  selectedSymbol?: string | null;
}

export default function RiskPanel({ accessToken, selectedSymbol }: RiskPanelProps) {
  const [summary, setSummary] = useState<UserRiskSummary | null>(null);
  const [position, setPosition] = useState<PositionSizeResult | null>(null);
  const [entry, setEntry] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [loading, setLoading] = useState(true);
  const [calcLoading, setCalcLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchRiskSummary(accessToken);
        if (!cancelled) setSummary(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load risk summary");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  async function handleCalculate() {
    if (!selectedSymbol || !entry || !stopLoss) return;

    setCalcLoading(true);
    setError(null);
    try {
      const result = await fetchPositionSize(
        selectedSymbol,
        parseFloat(entry),
        parseFloat(stopLoss),
        accessToken
      );
      setPosition(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed");
      setPosition(null);
    } finally {
      setCalcLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Risk Manager</h2>
      <p className="mt-1 text-sm text-slate-400">Position sizing, overtrading alerts, and drawdown monitoring.</p>

      {loading ? (
        <p className="mt-6 text-sm text-slate-400">Loading risk profile...</p>
      ) : summary ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs text-slate-500">Trades today</p>
            <p className="mt-1 text-xl font-semibold">
              {summary.trades_today}/{summary.max_daily_trades}
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs text-slate-500">Drawdown</p>
            <p className={`mt-1 text-xl font-semibold ${summary.drawdown_pct >= 10 ? "text-red-400" : "text-slate-100"}`}>
              {summary.drawdown_pct.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs text-slate-500">Open trades</p>
            <p className="mt-1 text-xl font-semibold">{summary.open_trades}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs text-slate-500">Total P&L</p>
            <p className={`mt-1 text-xl font-semibold ${summary.total_pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              ${summary.total_pnl.toLocaleString()}
            </p>
          </div>
        </div>
      ) : null}

      {summary && summary.alerts.length > 0 && (
        <div className="mt-4 space-y-2">
          {summary.alerts.map((alert, index) => (
            <div key={index} className={`rounded-lg border px-4 py-3 text-sm ${alertClass(alert.severity)}`}>
              {alert.message}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <h3 className="text-sm font-semibold">Position Size Calculator</h3>
        <p className="mt-1 text-xs text-slate-500">
          {selectedSymbol
            ? `Using ${selectedSymbol} — fixed ${summary?.risk_tolerance_pct ?? 2}% risk per trade`
            : "Select an asset from the table first"}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            type="number"
            step="any"
            placeholder="Entry price"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
          <input
            type="number"
            step="any"
            placeholder="Stop loss"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleCalculate}
            disabled={!selectedSymbol || calcLoading}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            {calcLoading ? "Calculating..." : "Calculate"}
          </button>
        </div>

        {position && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-xs text-slate-500">Suggested size</p>
              <p className="mt-1 font-mono text-lg font-semibold text-emerald-400">
                {position.suggested_size.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 p-3">
              <p className="text-xs text-slate-500">Risk amount</p>
              <p className="mt-1 font-mono text-lg">${position.risk_amount.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border border-slate-800 p-3">
              <p className="text-xs text-slate-500">Max loss</p>
              <p className="mt-1 font-mono text-lg">${position.max_loss.toFixed(2)}</p>
            </div>
          </div>
        )}

        {position && <p className="mt-3 text-xs text-slate-500">{position.note}</p>}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </section>
  );
}
