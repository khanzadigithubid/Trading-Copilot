"use client";

import { useCallback, useEffect, useState } from "react";
import { checkAlerts, createAlert, deleteAlert, fetchAlerts } from "@/lib/alerts";
import type { AlertCondition, PriceAlert } from "@/types/alert";

interface AlertsPanelProps {
  accessToken?: string;
  selectedSymbol?: string | null;
}

export default function AlertsPanel({ accessToken, selectedSymbol }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState("");
  const [condition, setCondition] = useState<AlertCondition>("above");
  const [targetPrice, setTargetPrice] = useState("");

  // Prefill symbol from dashboard selection
  useEffect(() => {
    if (selectedSymbol) setSymbol(selectedSymbol);
  }, [selectedSymbol]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAlerts(accessToken);
      setAlerts(data.alerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    if (!symbol || !targetPrice) return;
    setError(null);
    try {
      await createAlert(symbol.toUpperCase(), condition, parseFloat(targetPrice), accessToken);
      setTargetPrice("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create alert");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAlert(id, accessToken);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete alert");
    }
  }

  async function handleCheck() {
    setChecking(true);
    setError(null);
    try {
      const data = await checkAlerts(accessToken);
      setAlerts(data.alerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check failed");
    } finally {
      setChecking(false);
    }
  }

  const active = alerts.filter((a) => a.is_active && !a.is_triggered);
  const triggered = alerts.filter((a) => a.is_triggered);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Price Alerts</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            Get notified when an asset crosses your target price.
          </p>
        </div>
        <button
          onClick={handleCheck}
          disabled={checking}
          className="rounded-lg border border-slate-700 px-3 py-2 text-xs hover:bg-slate-800 disabled:opacity-50"
        >
          {checking ? "Checking..." : "Check Now"}
        </button>
      </div>

      {/* Create alert form */}
      <div className="mt-5 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Symbol (e.g. BTCUSDT)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="w-36 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm uppercase outline-none focus:border-emerald-500"
        />
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value as AlertCondition)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        >
          <option value="above">Price above</option>
          <option value="below">Price below</option>
        </select>
        <input
          type="number"
          step="any"
          placeholder="Target price"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          className="w-36 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
        />
        <button
          onClick={handleCreate}
          disabled={!symbol || !targetPrice}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          + Add Alert
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Loading alerts...</p>
      ) : (
        <>
          {/* Active alerts */}
          {active.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Active ({active.length})
              </p>
              <div className="space-y-2">
                {active.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-100">{alert.symbol}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        alert.condition === "above"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-red-500/15 text-red-400"
                      }`}>
                        {alert.condition === "above" ? "▲ Above" : "▼ Below"}
                      </span>
                      <span className="font-mono text-slate-200">
                        {alert.target_price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="ml-4 text-slate-500 hover:text-red-400 transition"
                      title="Delete alert"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Triggered alerts */}
          {triggered.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
                Triggered ({triggered.length})
              </p>
              <div className="space-y-2">
                {triggered.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-amber-400">🔔</span>
                      <span className="font-semibold text-slate-100">{alert.symbol}</span>
                      <span className="text-slate-400">
                        {alert.condition === "above" ? "crossed above" : "dropped below"}{" "}
                        <span className="font-mono text-slate-200">
                          {alert.target_price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                        </span>
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {alert.triggered_at
                        ? new Date(alert.triggered_at).toLocaleTimeString()
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active.length === 0 && triggered.length === 0 && (
            <p className="mt-6 text-center text-sm text-slate-500">
              No alerts yet. Add one above to get started.
            </p>
          )}
        </>
      )}
    </section>
  );
}
