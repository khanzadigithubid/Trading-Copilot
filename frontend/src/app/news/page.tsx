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

interface NewsArticle {
  title: string;
  symbol: string;
  sentiment: string;
  source: string;
  url: string;
  published_at: string;
  description?: string;
}

interface NewsResponse {
  articles: NewsArticle[];
  source: string;
}

const SYMBOLS = [
  { value: "", label: "All Markets" },
  { value: "BTCUSDT", label: "Bitcoin" },
  { value: "ETHUSDT", label: "Ethereum" },
  { value: "EURUSD", label: "EUR/USD" },
  { value: "XAUUSD", label: "Gold" },
  { value: "USOIL", label: "Oil" },
  { value: "AAPL", label: "Apple" },
  { value: "NVDA", label: "NVIDIA" },
  { value: "TSLA", label: "Tesla" },
  { value: "SPY", label: "S&P 500" },
];

function sentimentColor(s: string) {
  if (s === "bullish") return "text-emerald-400 bg-emerald-500/15 border-emerald-500/30";
  if (s === "bearish") return "text-red-400 bg-red-500/15 border-red-500/30";
  return "text-slate-400 bg-slate-500/15 border-slate-500/30";
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NewsPage() {
  const [data, setData] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState("");

  useEffect(() => {
    setLoading(true);
    const qs = symbol ? `?symbol=${symbol}` : "";
    apiFetch<NewsResponse>(`/news${qs}`)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [symbol]);

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

      <section className="border-b border-slate-800 bg-slate-900/30 px-4 sm:px-4 sm:px-6 py-6 sm:py-8 sm:py-12 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Market Intelligence</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">📰 Market News</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Latest news and headlines for all 27 markets — filtered by asset.
        </p>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-4 sm:px-6 py-6 sm:py-8">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SYMBOLS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSymbol(s.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                symbol === s.value
                  ? "bg-emerald-500 text-slate-950"
                  : "border border-slate-700 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {data?.source === "mock" && (
          <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-400">
            📌 Showing sample headlines. Add NEWS_API_KEY to get real live news.
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-800" />
            ))}
          </div>
        ) : !data?.articles.length ? (
          <p className="text-center text-slate-500">No news found.</p>
        ) : (
          <div className="space-y-4">
            {data.articles.map((article, i) => (
              <a
                key={i}
                href={article.url !== "#" ? article.url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-slate-700 hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${sentimentColor(article.sentiment)}`}>
                        {article.sentiment === "bullish" ? "▲ Bullish" : article.sentiment === "bearish" ? "▼ Bearish" : "— Neutral"}
                      </span>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{article.symbol}</span>
                      <span className="text-xs text-slate-500">{article.source}</span>
                      <span className="text-xs text-slate-600">{timeAgo(article.published_at)}</span>
                    </div>
                    <p className="font-medium text-slate-100 leading-snug">{article.title}</p>
                    {article.description && (
                      <p className="mt-1 text-sm text-slate-400 line-clamp-2">{article.description}</p>
                    )}
                  </div>
                  {article.url !== "#" && (
                    <span className="shrink-0 text-xs text-emerald-500 mt-1">Read →</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center">
          <p className="font-semibold">Get AI signal for any asset</p>
          <p className="mt-2 text-sm text-slate-400">Combine news analysis with AI technical signals.</p>
          <Link href="/register" className="mt-4 inline-block rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
            Open dashboard →
          </Link>
        </div>
      </div>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-600">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
          <Link href="/" className="hover:text-slate-400">Home</Link>
          <Link href="/markets" className="hover:text-slate-400">Markets</Link>
          <Link href="/learn" className="hover:text-slate-400">Learn</Link>
          <Link href="/leaderboard" className="hover:text-slate-400">Leaderboard</Link>
        </div>
        <p>For educational purposes only · Not financial advice</p>
      </footer>
    </div>
  );
}
