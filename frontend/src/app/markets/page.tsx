"use client";

import Link from "next/link";
import { useState } from "react";

const MARKET_CATEGORIES = [
  {
    id: "crypto",
    label: "Cryptocurrency",
    icon: "₿",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    href: "/markets/crypto",
    description: "Digital currencies built on blockchain technology. Highly volatile, 24/7 trading, global access.",
    assets: 7,
    highlight: "Bitcoin, Ethereum, Solana",
    stats: [
      { label: "Market Hours", value: "24/7" },
      { label: "Assets", value: "7 coins" },
      { label: "Volatility", value: "High" },
    ],
  },
  {
    id: "forex",
    label: "Forex",
    icon: "💱",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    href: "/markets/forex",
    description: "Foreign exchange market — largest financial market in the world. $7.5 trillion daily volume.",
    assets: 7,
    highlight: "EUR/USD, GBP/USD, USD/JPY",
    stats: [
      { label: "Market Hours", value: "Mon-Fri 24h" },
      { label: "Assets", value: "7 pairs" },
      { label: "Volatility", value: "Medium" },
    ],
  },
  {
    id: "stocks",
    label: "Stocks",
    icon: "📈",
    color: "text-violet-400",
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
    href: "/markets/stocks",
    description: "Shares of the world's largest public companies. Regulated exchanges with defined trading hours.",
    assets: 7,
    highlight: "AAPL, NVDA, TSLA",
    stats: [
      { label: "Market Hours", value: "9:30-16:00 EST" },
      { label: "Assets", value: "7 stocks" },
      { label: "Volatility", value: "Medium" },
    ],
  },
  {
    id: "commodities",
    label: "Commodities",
    icon: "🪙",
    color: "text-yellow-400",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10",
    href: "/markets/commodities",
    description: "Physical goods like Gold, Silver, and Oil. Traditional safe-haven assets used as inflation hedge.",
    assets: 3,
    highlight: "Gold, Silver, Oil (WTI)",
    stats: [
      { label: "Market Hours", value: "Near 24/7" },
      { label: "Assets", value: "3 commodities" },
      { label: "Volatility", value: "Medium" },
    ],
  },
  {
    id: "indices",
    label: "Indices",
    icon: "🏦",
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    href: "/markets/indices",
    description: "Baskets of top stocks representing entire markets. SPY tracks S&P 500 — 500 largest US companies.",
    assets: 3,
    highlight: "S&P 500, NASDAQ, Dow Jones",
    stats: [
      { label: "Market Hours", value: "9:30-16:00 EST" },
      { label: "Assets", value: "3 indices" },
      { label: "Volatility", value: "Low-Medium" },
    ],
  },
];

const TOTAL_STATS = [
  { value: "27", label: "Total assets" },
  { value: "5", label: "Market types" },
  { value: "24/7", label: "Crypto trading" },
  { value: "100%", label: "Free access" },
];

export default function MarketsPage() {
  const [active, setActive] = useState("all");

  const filtered = active === "all"
    ? MARKET_CATEGORIES
    : MARKET_CATEGORIES.filter((m) => m.id === active);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Nav */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">AI</div>
            <span className="font-semibold">Trading Copilot</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/markets" className="text-sm text-emerald-400 font-medium">Markets</Link>
            <Link href="/about" className="text-sm text-slate-400 hover:text-slate-100">About</Link>
            <Link href="/login" className="text-sm text-slate-400 hover:text-slate-100">Sign in</Link>
            <Link href="/register" className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-slate-800 bg-slate-900/30 px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Markets</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">27 Markets. One Platform.</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Trade Forex, Crypto, Stocks, Commodities, and Indices — all with AI-powered signals,
          live prices, and professional analytics. Completely free.
        </p>
        <Link href="/register" className="mt-8 inline-block rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
          Start trading free
        </Link>
      </section>

      {/* Stats */}
      <div className="border-b border-slate-800 bg-slate-900/20">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-slate-800 sm:grid-cols-4">
          {TOTAL_STATS.map((s) => (
            <div key={s.label} className="px-6 py-5 text-center">
              <p className="text-2xl font-bold text-emerald-400">{s.value}</p>
              <p className="mt-1 text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActive("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${active === "all" ? "bg-emerald-500 text-slate-950" : "border border-slate-700 text-slate-400 hover:bg-slate-800"}`}
          >
            All Markets
          </button>
          {MARKET_CATEGORIES.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${active === m.id ? "bg-emerald-500 text-slate-950" : "border border-slate-700 text-slate-400 hover:bg-slate-800"}`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {/* Market cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((market) => (
            <Link
              key={market.id}
              href={market.href}
              className={`group rounded-2xl border ${market.border} ${market.bg} p-6 transition hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-3xl">{market.icon}</span>
                  <h2 className={`mt-3 text-xl font-bold ${market.color}`}>{market.label}</h2>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900/60 px-2 py-1 text-xs text-slate-400">
                  {market.assets} assets
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{market.description}</p>
              <p className="mt-3 text-xs text-slate-400">
                Popular: <span className="text-slate-200">{market.highlight}</span>
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-700/50 pt-4">
                {market.stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-xs text-slate-500">{s.label}</p>
                    <p className="mt-0.5 text-xs font-medium text-slate-200">{s.value}</p>
                  </div>
                ))}
              </div>
              <p className={`mt-4 text-xs font-medium ${market.color} group-hover:underline`}>
                Explore {market.label} →
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="border-t border-slate-800 px-6 py-16 text-center">
        <h2 className="text-2xl font-bold">Ready to trade with AI?</h2>
        <p className="mt-3 text-slate-400">Get AI signals, live prices, and professional analytics — free.</p>
        <Link href="/register" className="mt-6 inline-block rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
          Create free account
        </Link>
      </section>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-600">
        <p>AI Trading Copilot · For educational purposes only · Not financial advice</p>
      </footer>
    </div>
  );
}
