"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchPortfolioStats } from "@/lib/portfolio";
import type { PortfolioStats } from "@/types/portfolio";

interface PortfolioPanelProps {
  accessToken?: string;
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-semibold font-mono ${color ?? "text-slate-100"}`}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export default function PortfolioPanel({ accessToken }: PortfolioPanelProps) {
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchPortfolioStats(accessToken)
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load portfolio"))
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold">Portfolio Tracker</h2>
        <p className="mt-4 text-sm text-slate-400">Loading portfolio...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold">Portfolio Tracker</h2>
        <p className="mt-4 text-sm text-red-400">{error}</p>
      </section>
    );
  }

  if (!stats) return null;

  const pnlPositive = stats.total_pnl >= 0;
  const equityColor = pnlPositive ? "#10b981" : "#ef4444";
  const hasHistory = stats.equity_curve.length > 1;

  // Custom tooltip for the chart
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl">
          <p className="text-slate-400">{label}</p>
          <p className="font-mono text-slate-100">
            Equity: ${payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Portfolio Tracker</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            Equity curve · Sharpe ratio · Win/loss analytics
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold font-mono text-slate-100">
            ${stats.current_equity.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className={`text-sm font-medium ${pnlPositive ? "text-emerald-400" : "text-red-400"}`}>
            {pnlPositive ? "▲" : "▼"} ${Math.abs(stats.total_pnl).toLocaleString()} (
            {Math.abs(stats.total_pnl_pct).toFixed(2)}%)
          </p>
        </div>
      </div>

      {/* Equity curve */}
      <div className="mt-5">
        {hasHistory ? (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={stats.equity_curve} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={equityColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={equityColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickFormatter={(v: string) => v.slice(5, 10)}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
                width={52}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="equity"
                stroke={equityColor}
                strokeWidth={2}
                fill="url(#equityGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/40">
            <p className="text-sm text-slate-500">
              Close some trades to see your equity curve
            </p>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Win Rate"
          value={`${stats.win_rate}%`}
          sub={`${stats.winning_trades}W · ${stats.losing_trades}L`}
          color={stats.win_rate >= 50 ? "text-emerald-400" : "text-red-400"}
        />
        <StatCard
          label="Sharpe Ratio"
          value={stats.sharpe_ratio.toFixed(2)}
          sub="Annualised"
          color={stats.sharpe_ratio >= 1 ? "text-emerald-400" : "text-amber-400"}
        />
        <StatCard
          label="Profit Factor"
          value={stats.profit_factor >= 999 ? "∞" : stats.profit_factor.toFixed(2)}
          sub="Gross profit / loss"
          color={stats.profit_factor >= 1.5 ? "text-emerald-400" : "text-slate-100"}
        />
        <StatCard
          label="Max Drawdown"
          value={`${stats.max_drawdown_pct.toFixed(1)}%`}
          sub="Peak to trough"
          color={stats.max_drawdown_pct >= 20 ? "text-red-400" : "text-slate-100"}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Avg Win"
          value={`$${stats.avg_win.toFixed(2)}`}
          color="text-emerald-400"
        />
        <StatCard
          label="Avg Loss"
          value={`$${Math.abs(stats.avg_loss).toFixed(2)}`}
          color="text-red-400"
        />
        <StatCard
          label="Best Trade"
          value={`$${stats.best_trade.toFixed(2)}`}
          color="text-emerald-400"
        />
        <StatCard
          label="Worst Trade"
          value={`$${stats.worst_trade.toFixed(2)}`}
          color="text-red-400"
        />
      </div>

      {/* Streak badges */}
      <div className="mt-4 flex flex-wrap gap-3">
        {[
          {
            label: "Current win streak",
            value: stats.streaks.current_win_streak,
            color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
          },
          {
            label: "Best win streak",
            value: stats.streaks.best_win_streak,
            color: "text-emerald-300 border-emerald-500/20 bg-emerald-500/5",
          },
          {
            label: "Current loss streak",
            value: stats.streaks.current_loss_streak,
            color: "text-red-400 border-red-500/30 bg-red-500/10",
          },
          {
            label: "Worst loss streak",
            value: stats.streaks.worst_loss_streak,
            color: "text-red-300 border-red-500/20 bg-red-500/5",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${color}`}
          >
            {label}: <span className="font-mono">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
