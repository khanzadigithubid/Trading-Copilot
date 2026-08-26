"use client";

import { useCallback, useEffect, useState } from "react";

import { closePaperTrade, fetchMyTrades, openPaperTrade } from "@/lib/trades";
import type { Trade, TradeType } from "@/types/trade";

interface PaperTradingPanelProps {
  accessToken?: string;
  selectedSymbol?: string | null;
}

export default function PaperTradingPanel({ accessToken, selectedSymbol }: PaperTradingPanelProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [totalPnl, setTotalPnl] = useState(0);
  const [tradeType, setTradeType] = useState<TradeType>("BUY");
  const [size, setSize] = useState("1");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTrades = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMyTrades(accessToken);
      setTrades(data.trades);
      setTotalPnl(data.total_realized_pnl);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trades");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  async function handleOpen() {
    if (!selectedSymbol) return;
    setActionLoading(true);
    setError(null);
    try {
      await openPaperTrade(
        {
          symbol: selectedSymbol,
          type: tradeType,
          size: parseFloat(size),
          stop_loss: stopLoss ? parseFloat(stopLoss) : undefined,
          take_profit: takeProfit ? parseFloat(takeProfit) : undefined,
        },
        accessToken
      );
      await loadTrades();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open trade");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleClose(tradeId: string) {
    setActionLoading(true);
    setError(null);
    try {
      await closePaperTrade(tradeId, accessToken);
      await loadTrades();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close trade");
    } finally {
      setActionLoading(false);
    }
  }

  const openTrades = trades.filter((t) => t.status === "open");

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Paper Trading</h2>
          <p className="mt-1 text-sm text-slate-400">Practice with virtual trades — no real money.</p>
        </div>
        <div className="text-sm">
          <span className="text-slate-500">Realized P&L: </span>
          <span className={totalPnl >= 0 ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
            ${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <select
          value={tradeType}
          onChange={(e) => setTradeType(e.target.value as TradeType)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
        <input
          type="number"
          min="0.0001"
          step="any"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="Size"
          className="w-28 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="0"
          step="any"
          value={stopLoss}
          onChange={(e) => setStopLoss(e.target.value)}
          placeholder="Stop Loss"
          className="w-28 rounded-lg border border-red-500/30 bg-slate-950 px-3 py-2 text-sm placeholder-red-500/40"
        />
        <input
          type="number"
          min="0"
          step="any"
          value={takeProfit}
          onChange={(e) => setTakeProfit(e.target.value)}
          placeholder="Take Profit"
          className="w-28 rounded-lg border border-emerald-500/30 bg-slate-950 px-3 py-2 text-sm placeholder-emerald-500/40"
        />
        <button
          onClick={handleOpen}
          disabled={!selectedSymbol || actionLoading}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          {actionLoading ? "..." : selectedSymbol ? `Open ${tradeType}` : "Select asset"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-300">Open positions ({openTrades.length})</h3>
        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Loading trades...</p>
        ) : openTrades.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No open paper trades.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {openTrades.map((trade) => (
              <div
                key={trade.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm"
              >
                <div>
                  <span className="font-semibold">{trade.symbol}</span>
                  <span className={`ml-2 ${trade.type === "BUY" ? "text-emerald-400" : "text-red-400"}`}>
                    {trade.type}
                  </span>
                  <span className="ml-2 text-slate-500">
                    {trade.size} @ {trade.entry_price}
                  </span>
                  {trade.stop_loss && (
                    <span className="ml-2 text-xs text-red-400">SL: {trade.stop_loss}</span>
                  )}
                  {trade.take_profit && (
                    <span className="ml-2 text-xs text-emerald-400">TP: {trade.take_profit}</span>
                  )}
                </div>
                <button
                  onClick={() => handleClose(trade.id)}
                  disabled={actionLoading}
                  className="rounded-lg border border-slate-700 px-3 py-1 text-xs hover:bg-slate-800 disabled:opacity-50"
                >
                  Close at market
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {trades.filter((t) => t.status === "closed").length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-300">Recent closed</h3>
          <div className="mt-3 max-h-40 space-y-2 overflow-y-auto">
            {trades
              .filter((t) => t.status === "closed")
              .slice(0, 5)
              .map((trade) => (
                <div key={trade.id} className="flex justify-between rounded-lg border border-slate-800/60 px-3 py-2 text-xs">
                  <span>
                    {trade.symbol} {trade.type} · {trade.size} units
                  </span>
                  <span className={(trade.pnl ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}>
                    {trade.pnl != null ? `$${trade.pnl.toFixed(2)}` : "—"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
