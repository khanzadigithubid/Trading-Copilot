"use client";

import { useEffect, useMemo, useState } from "react";

import { SkeletonTable } from "@/components/Skeleton";
import { usePriceWebSocket } from "@/hooks/usePriceWebSocket";
import { fetchAssets } from "@/lib/market";
import type { Asset, MarketType, PriceUpdate } from "@/types/market";

const MARKET_TABS: { id: MarketType | "all"; label: string }[] = [
  { id: "all", label: "All Markets" },
  { id: "forex", label: "Forex" },
  { id: "crypto", label: "Crypto" },
  { id: "stock", label: "Stocks" },
];

function formatPrice(price: number, marketType: MarketType): string {
  if (marketType === "forex") {
    return price.toFixed(5);
  }
  if (marketType === "crypto" && price >= 1000) {
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function marketBadgeClass(marketType: MarketType): string {
  switch (marketType) {
    case "forex":
      return "bg-blue-500/10 text-blue-300 border-blue-500/20";
    case "crypto":
      return "bg-amber-500/10 text-amber-300 border-amber-500/20";
    case "stock":
      return "bg-violet-500/10 text-violet-300 border-violet-500/20";
  }
}

interface AssetDashboardProps {
  accessToken?: string;
  selectedSymbol?: string | null;
  onSelectSymbol?: (symbol: string) => void;
}

export default function AssetDashboard({ accessToken, selectedSymbol, onSelectSymbol }: AssetDashboardProps) {
  const [activeMarket, setActiveMarket] = useState<MarketType | "all">("all");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredAssets = useMemo(() => {
    let list = activeMarket === "all" ? assets : assets.filter((a) => a.market_type === activeMarket);
    if (search.trim()) {
      const q = search.trim().toUpperCase();
      list = list.filter((a) => a.symbol.includes(q) || (a.name ?? "").toUpperCase().includes(q));
    }
    return list;
  }, [activeMarket, assets, search]);

  const symbols = useMemo(() => filteredAssets.map((asset) => asset.symbol), [filteredAssets]);
  const { prices, connected } = usePriceWebSocket(symbols);

  useEffect(() => {
    let cancelled = false;

    async function loadAssets() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAssets(undefined, accessToken);
        if (!cancelled) {
          setAssets(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load assets");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAssets();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Live Market Prices</h2>
          <p className="mt-1 text-sm text-slate-400">
            Unified Forex, Crypto, and Stock feed with real-time WebSocket updates. Click a row for AI signals.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${
              connected
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-slate-700 bg-slate-950/60 text-slate-400"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
            {connected ? "Live" : "Connecting..."}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {MARKET_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMarket(tab.id)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              activeMarket === tab.id
                ? "bg-emerald-500 text-slate-950 font-semibold"
                : "border border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="ml-auto">
          <input
            type="text"
            placeholder="Search asset..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm outline-none focus:border-emerald-500 w-40"
          />
        </div>
      </div>

      {loading ? (
        <div className="mt-6">
          <SkeletonTable rows={6} />
        </div>
      ) : error ? (
        <p className="mt-8 text-center text-sm text-red-400">{error}</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="px-4 py-3 font-medium">Symbol</th>
                <th className="px-4 py-3 font-medium">Market</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium text-right">Price</th>
                <th className="px-4 py-3 font-medium text-right">Change</th>
                <th className="px-4 py-3 font-medium text-right">Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => {
                const live = prices[asset.symbol] as PriceUpdate | undefined;
                const changePercent = live?.change_percent ?? 0;
                const isUp = (changePercent ?? 0) >= 0;

                return (
                  <tr
                    key={asset.symbol}
                    onClick={() => onSelectSymbol?.(asset.symbol)}
                    className={`cursor-pointer border-b border-slate-800/80 transition hover:bg-slate-950/40 ${
                      selectedSymbol === asset.symbol ? "bg-emerald-500/5 ring-1 ring-inset ring-emerald-500/30" : ""
                    }`}
                  >
                    <td className="px-4 py-4 font-semibold text-slate-100">{asset.symbol}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs capitalize ${marketBadgeClass(asset.market_type)}`}
                      >
                        {asset.market_type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-300">{asset.name || "—"}</td>
                    <td className="px-4 py-4 text-right font-mono text-slate-100">
                      {live
                        ? asset.market_type === "forex"
                          ? formatPrice(live.price, asset.market_type)
                          : `$${formatPrice(live.price, asset.market_type)}`
                        : "—"}
                    </td>
                    <td className={`px-4 py-4 text-right font-mono ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                      {live?.change_percent != null
                        ? `${isUp ? "+" : ""}${live.change_percent.toFixed(2)}%`
                        : "—"}
                    </td>
                    <td className="px-4 py-4 text-right text-xs uppercase text-slate-500">
                      {live ? "live" : "pending"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
