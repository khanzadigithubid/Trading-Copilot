"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import MobileNav from "@/components/MobileNav";

const NAV_LINKS = [
  { href: "/markets", label: "Markets", icon: "🌍" },
  { href: "/markets/crypto", label: "Crypto", icon: "₿" },
  { href: "/markets/forex", label: "Forex", icon: "💱" },
  { href: "/markets/stocks", label: "Stocks", icon: "📈" },
  { href: "/markets/commodities", label: "Commodities", icon: "🪙" },
  { href: "/markets/indices", label: "Indices", icon: "🏦" },
  { href: "/learn", label: "Learn", icon: "📖" },
  { href: "/news", label: "News", icon: "📰" },
  { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  { href: "/about", label: "About", icon: "ℹ️" },
  { href: "/contact", label: "Contact", icon: "📬" },
];

interface LeaderEntry {
  rank: number;
  email: string;
  total_signals: number;
  total_upvotes: number;
  win_rate: number;
  total_pnl: number;
  best_trade: number;
  joined: string;
}

interface LeaderboardResponse {
  leaders: LeaderEntry[];
  total_users: number;
  total_signals: number;
  total_trades: number;
}

const MEDAL = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"signals" | "pnl" | "votes">("signals");

  useEffect(() => {
    apiFetch<LeaderboardResponse>("/leaderboard")
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const sorted = data?.leaders ? [...data.leaders].sort((a, b) => {
    if (tab === "pnl") return b.total_pnl - a.total_pnl;
    if (tab === "votes") return b.total_upvotes - a.total_upvotes;
    return b.total_signals - a.total_signals;
  }) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">AI</div>
            <span className="font-semibold">Trading Copilot</span>
          </Link>
          <div className="hidden sm:flex items-center gap-4 text-sm text-slate-400">
            <Link href="/markets" className="hover:text-slate-100">Markets</Link>
            <Link href="/learn" className="hover:text-slate-100">Learn</Link>
            <Link href="/news" className="hover:text-slate-100">News</Link>
            <Link href="/about" className="hover:text-slate-100">About</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/register" className="hidden sm:block rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400">Get started</Link>
            <MobileNav links={NAV_LINKS} showAuth={true} />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-slate-800 bg-slate-900/30 px-4 sm:px-4 sm:px-4 sm:px-6 py-6 sm:py-8 sm:py-10 sm:py-14 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Community</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">🏆 Leaderboard</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Top traders ranked by signals shared, community votes, and paper trading performance.
        </p>
        {data && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 text-sm">
            {[
              ["👥", data.total_users, "Traders"],
              ["📊", data.total_signals, "Signals shared"],
              ["💼", data.total_trades, "Paper trades"],
            ].map(([icon, val, label]) => (
              <div key={String(label)} className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{String(icon)} {String(val)}</p>
                <p className="text-slate-500">{String(label)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-4 sm:px-4 sm:px-6 py-6 sm:py-8 sm:py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([["signals", "📊 Most Signals"], ["pnl", "💰 Best P&L"], ["votes", "▲ Most Votes"]] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === id ? "bg-emerald-500 text-slate-950" : "border border-slate-700 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-800" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-16 text-center">
            <p className="text-4xl">🏆</p>
            <p className="mt-4 text-lg font-semibold text-slate-300">No traders yet!</p>
            <p className="mt-2 text-sm text-slate-500">Be the first to share signals and claim the top spot.</p>
            <Link href="/register" className="mt-6 inline-block rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
              Join now →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((entry, idx) => (
              <div
                key={entry.email}
                className={`flex items-center gap-4 rounded-xl border px-5 py-4 transition ${
                  idx === 0 ? "border-yellow-500/40 bg-yellow-500/5" :
                  idx === 1 ? "border-slate-400/30 bg-slate-400/5" :
                  idx === 2 ? "border-amber-600/30 bg-amber-600/5" :
                  "border-slate-800 bg-slate-900/40"
                }`}
              >
                {/* Rank */}
                <div className="w-10 text-center">
                  {idx < 3 ? (
                    <span className="text-2xl">{MEDAL[idx]}</span>
                  ) : (
                    <span className="text-lg font-bold text-slate-500">#{idx + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm">
                  {entry.email.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-100 truncate">{entry.email}</p>
                  <p className="text-xs text-slate-500">Joined {new Date(entry.joined).toLocaleDateString()}</p>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 text-sm text-right">
                  <div>
                    <p className="text-xs text-slate-500">Signals</p>
                    <p className="font-semibold text-slate-200">{entry.total_signals}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Votes</p>
                    <p className="font-semibold text-emerald-400">▲ {entry.total_upvotes}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Paper P&L</p>
                    <p className={`font-semibold font-mono ${entry.total_pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {entry.total_pnl >= 0 ? "+" : ""}${entry.total_pnl.toFixed(0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Win Rate</p>
                    <p className={`font-semibold ${entry.win_rate >= 50 ? "text-emerald-400" : "text-slate-300"}`}>
                      {entry.win_rate.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
          <p className="font-semibold text-slate-100">Want to appear on the leaderboard?</p>
          <p className="mt-2 text-sm text-slate-400">Share signals in the Community tab. Close paper trades to build your P&L.</p>
          <Link href="/register" className="mt-4 inline-block rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
            Create free account →
          </Link>
        </div>
      </div>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-600">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
          <Link href="/" className="hover:text-slate-400">Home</Link>
          <Link href="/markets" className="hover:text-slate-400">Markets</Link>
          <Link href="/learn" className="hover:text-slate-400">Learn</Link>
          <Link href="/about" className="hover:text-slate-400">About</Link>
        </div>
        <p>For educational purposes only · Not financial advice</p>
      </footer>
    </div>
  );
}
