"use client";

import { useState } from "react";

import { runBacktest } from "@/lib/backtest";
import type { BacktestResult } from "@/types/backtest";

interface BacktestPanelProps {
  accessToken?: string;
  selectedSymbol?: string | null;
}

export default function BacktestPanel({ accessToken, selectedSymbol }: BacktestPanelProps) {
  const [range, setRange] = useState("1m");
  const [strategy, setStrategy] = useState("rsi_macd");
  const [capital, setCapital] = useState("10000");
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    if (!selectedSymbol) return;
    setLoading(true);
    setError(null);
    try {
      const data = await runBacktest(
        {
          symbol: selectedSymbol,
          strategy,
          range,
          initial_capital: parseFloat(capital),
        },
        accessToken
      );
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Backtest failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Strategy Backtest</h2>
      <p className="mt-1 text-sm text-slate-400">
        Test RSI + MACD strategy on historical data
        {selectedSymbol ? ` for ${selectedSymbol}` : ""}.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        >
          <option value="1w">1 week</option>
          <option value="1m">1 month</option>
          <option value="1y">1 year</option>
        </select>
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        >
          <option value="rsi_macd">RSI + MACD</option>
          <option value="bollinger_bands">Bollinger Bands</option>
          <option value="ema_crossover">EMA Crossover (9/21)</option>
          <option value="supertrend">SuperTrend</option>
          <option value="mean_reversion">Mean Reversion (Z-score)</option>
        </select>
        <input
          type="number"
          value={capital}
          onChange={(e) => setCapital(e.target.value)}
          placeholder="Initial capital"
          className="w-36 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        />        <button
          onClick={handleRun}
          disabled={!selectedSymbol || loading}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          {loading ? "Running..." : "Run Backtest"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total return" value={`${result.total_return_pct >= 0 ? "+" : ""}${result.total_return_pct}%`} positive={result.total_return_pct >= 0} />
            <Stat label="Win rate" value={`${result.win_rate}%`} />
            <Stat label="Trades" value={String(result.total_trades)} />
            <Stat label="Max drawdown" value={`${result.max_drawdown_pct}%`} positive={false} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800 p-3 text-sm">
              <p className="text-slate-500">Initial → Final</p>
              <p className="mt-1 font-mono">
                ${result.initial_capital.toLocaleString()} → ${result.final_capital.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 p-3 text-sm">
              <p className="text-slate-500">W / L</p>
              <p className="mt-1">
                <span className="text-emerald-400">{result.winning_trades} wins</span>
                {" · "}
                <span className="text-red-400">{result.losing_trades} losses</span>
              </p>
            </div>
          </div>
          {result.trades.length > 0 && (
            <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-800">
              <table className="min-w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Entry</th>
                    <th className="px-3 py-2">Exit</th>
                    <th className="px-3 py-2 text-right">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {result.trades.map((t, i) => (
                    <tr key={i} className="border-b border-slate-800/50">
                      <td className="px-3 py-2">{t.type}</td>
                      <td className="px-3 py-2 font-mono">{t.entry_price}</td>
                      <td className="px-3 py-2 font-mono">{t.exit_price}</td>
                      <td className={`px-3 py-2 text-right font-mono ${t.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        ${t.pnl.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  const color =
    positive === undefined ? "text-slate-100" : positive ? "text-emerald-400" : "text-red-400";
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
}
