"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

interface TradePlan {
  symbol: string;
  direction: string;
  current_price: number;
  entry_zone_low: number;
  entry_zone_high: number;
  stop_loss: number;
  take_profit_1: number;
  take_profit_2: number;
  take_profit_3: number;
  position_size: number;
  risk_amount: number;
  potential_profit_1: number;
  risk_reward: number;
  reasoning: string;
  entry_timing: string;
  key_levels: string;
  warning: string;
  confidence: number;
}

interface TradePlannerPanelProps {
  accessToken?: string;
  selectedSymbol?: string | null;
}

export default function TradePlannerPanel({ accessToken, selectedSymbol }: TradePlannerPanelProps) {
  const [symbol, setSymbol] = useState(selectedSymbol || "BTCUSDT");
  const [direction, setDirection] = useState("auto");
  const [capital, setCapital] = useState("1000");
  const [risk, setRisk] = useState("2");
  const [plan, setPlan] = useState<TradePlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const data = await apiFetch<TradePlan>(
        "/trade-planner",
        {
          method: "POST",
          body: JSON.stringify({
            symbol: symbol.toUpperCase(),
            direction,
            capital: parseFloat(capital),
            risk_percent: parseFloat(risk),
          }),
        },
        accessToken
      );
      setPlan(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  }

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 6 });

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
      <h2 className="text-lg font-semibold">📋 AI Trade Planner</h2>
      <p className="mt-0.5 text-sm text-slate-400">Get a complete trade plan — entry zone, stop loss, targets, position size.</p>

      {/* Form */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Asset</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="e.g. BTCUSDT"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 uppercase"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Direction</label>
          <select value={direction} onChange={(e) => setDirection(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
            <option value="auto">Auto (AI decides)</option>
            <option value="BUY">BUY (Long)</option>
            <option value="SELL">SELL (Short)</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Capital ($)</label>
          <input type="number" value={capital} onChange={(e) => setCapital(e.target.value)} min="10"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none transition focus:border-emerald-500" />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Risk per trade (%)</label>
          <input type="number" value={risk} onChange={(e) => setRisk(e.target.value)} min="0.5" max="10" step="0.5"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none transition focus:border-emerald-500" />
        </div>
      </div>

      <button onClick={generate} disabled={!symbol || loading}
        className="mt-4 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
            Generating Plan...
          </span>
        ) : "Generate Trade Plan"}
      </button>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {/* Plan */}
      {plan && (
        <div className="mt-5 space-y-4">
          {/* Header */}
          <div className={`rounded-xl border p-4 ${plan.direction === "BUY" ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-100">{plan.symbol}</span>
                <span className={`rounded-full border px-3 py-1 text-sm font-bold ${plan.direction === "BUY" ? "border-emerald-500/30 text-emerald-400" : "border-red-500/30 text-red-400"}`}>
                  {plan.direction}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Confidence</p>
                <p className={`font-bold ${plan.confidence >= 70 ? "text-emerald-400" : "text-amber-400"}`}>{plan.confidence}%</p>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800">
              <div className="h-1.5 rounded-full bg-emerald-500 transition-all" style={{ width: `${plan.confidence}%` }} />
            </div>
          </div>

          {/* Price levels */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              { label: "Current Price", value: fmt(plan.current_price), color: "text-slate-100" },
              { label: "Entry Zone", value: `${fmt(plan.entry_zone_low)} — ${fmt(plan.entry_zone_high)}`, color: "text-blue-400" },
              { label: "Stop Loss", value: fmt(plan.stop_loss), color: "text-red-400" },
              { label: "TP 1", value: fmt(plan.take_profit_1), color: "text-emerald-400" },
              { label: "TP 2", value: fmt(plan.take_profit_2), color: "text-emerald-300" },
              { label: "TP 3", value: fmt(plan.take_profit_3), color: "text-emerald-200" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs text-slate-500">{label}</p>
                <p className={`mt-1 font-mono text-sm font-semibold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Risk/Reward */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Position Size", value: fmt(plan.position_size), sub: "units" },
              { label: "Risk Amount", value: `$${plan.risk_amount.toFixed(2)}`, sub: `${risk}% of capital` },
              { label: "Risk/Reward", value: `1:${plan.risk_reward}`, sub: `Profit: $${plan.potential_profit_1.toFixed(2)}` },
            ].map(({ label, value, sub }) => (
              <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 font-semibold text-slate-100 text-sm">{value}</p>
                <p className="text-xs text-slate-600 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* AI Analysis */}
          <div className="space-y-2">
            {[
              { icon: "🧠", label: "Reasoning", value: plan.reasoning, color: "border-slate-700" },
              { icon: "⏰", label: "Entry Timing", value: plan.entry_timing, color: "border-blue-500/20" },
              { icon: "📍", label: "Key Levels", value: plan.key_levels, color: "border-slate-700" },
              { icon: "⚠️", label: "Warning", value: plan.warning, color: "border-amber-500/20" },
            ].map(({ icon, label, value, color }) => (
              <div key={label} className={`rounded-xl border ${color} bg-slate-950/40 px-4 py-3`}>
                <p className="text-xs font-semibold text-slate-400">{icon} {label}</p>
                <p className="text-sm text-slate-300 mt-1">{value}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-center text-slate-600">For educational purposes only. Not financial advice.</p>
        </div>
      )}
    </section>
  );
}
