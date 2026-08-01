"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
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

const FEATURES = [
  { icon: "🤖", title: "Explainable AI Signals", desc: "BUY/SELL/HOLD with plain-English reasoning — not just numbers.", href: "/dashboard?tab=signals" },
  { icon: "📈", title: "TradingView Charts", desc: "Professional candlestick charts with volume, signal markers, 4 timeframes.", href: "/dashboard?tab=chart" },
  { icon: "🕐", title: "Multi-Timeframe Analysis", desc: "1D + 1W + 1M signals combined into one weighted verdict.", href: "/dashboard?tab=signals" },
  { icon: "🌡️", title: "Sentiment Heatmap", desc: "Market mood across all 27 assets at a glance.", href: "/dashboard?tab=community" },
  { icon: "👥", title: "Community Signals", desc: "Share trade ideas, vote on others' analysis, see consensus.", href: "/dashboard?tab=community" },
  { icon: "📚", title: "AI Trade Journal", desc: "Every closed trade gets automatic AI coaching feedback.", href: "/dashboard?tab=trading" },
  { icon: "📊", title: "Portfolio Analytics", desc: "Equity curve, Sharpe ratio, max drawdown, win streaks.", href: "/dashboard?tab=portfolio" },
  { icon: "🔔", title: "Price Alerts", desc: "Set price-above or price-below alerts on any asset.", href: "/dashboard?tab=alerts" },
  { icon: "⚡", title: "5 Backtest Strategies", desc: "RSI+MACD, Bollinger Bands, EMA Crossover, SuperTrend, Mean Reversion.", href: "/dashboard?tab=signals" },
  { icon: "💬", title: "Market Chat (AI)", desc: "Ask anything in plain language — AI answers with live data.", href: "/dashboard?tab=alerts" },
  { icon: "📐", title: "Risk Manager", desc: "Position sizing calculator based on your capital and risk %.", href: "/dashboard?tab=trading" },
  { icon: "📱", title: "Install as App (PWA)", desc: "Add to phone home screen. Works offline. No app store needed.", href: "/register" },
];

const MARKETS = [
  { label: "Forex", items: ["EUR/USD", "GBP/USD", "USD/JPY", "+4 more"], color: "text-blue-400" },
  { label: "Crypto", items: ["BTC", "ETH", "SOL", "+4 more"], color: "text-amber-400" },
  { label: "Stocks", items: ["AAPL", "NVDA", "TSLA", "+4 more"], color: "text-violet-400" },
  { label: "Commodities", items: ["Gold", "Silver", "Oil"], color: "text-yellow-400" },
  { label: "Indices", items: ["S&P 500", "NASDAQ", "Dow"], color: "text-emerald-400" },
];

const HOW_STEPS = [
  { step: "01", icon: "📝", title: "Create free account", desc: "Register in 30 seconds. No credit card, no broker.", color: "border-emerald-500/30 bg-emerald-500/5", num: "text-emerald-400" },
  { step: "02", icon: "🤖", title: "Pick asset & AI signal", desc: "Select any market. AI explains the signal in plain English.", color: "border-blue-500/30 bg-blue-500/5", num: "text-blue-400" },
  { step: "03", icon: "📚", title: "Paper trade & learn", desc: "Practice with virtual money. AI coaches you after every trade.", color: "border-violet-500/30 bg-violet-500/5", num: "text-violet-400" },
];

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">AI</div>
            <span className="font-semibold text-slate-100 text-sm sm:text-base">Trading Copilot</span>
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
            <Link href="/markets" className="hover:text-slate-100 transition">Markets</Link>
            <Link href="/learn" className="hover:text-slate-100 transition">Learn</Link>
            <Link href="/news" className="hover:text-slate-100 transition">News</Link>
            <Link href="/leaderboard" className="hover:text-slate-100 transition">Leaderboard</Link>
            <Link href="/about" className="hover:text-slate-100 transition">About</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block text-sm text-slate-400 hover:text-slate-100 transition">Sign in</Link>
            <Link href="/register" className="hidden sm:block rounded-full bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">Get started</Link>
            <MobileNav links={NAV_LINKS} showAuth={true} />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 pt-16 pb-8 text-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="relative w-full max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            27 markets · Live prices · AI-powered
          </span>
          <h1 className="mt-5 text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
            The AI trading<br />
            <span className="text-emerald-400">copilot</span> you need
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-lg leading-relaxed text-slate-400">
            Explainable AI signals, real-time data, and professional risk management — all free.
            Paper trade first, profit later.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="w-full sm:w-auto rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20">
              Start free — no credit card
            </Link>
            <Link href="/login" className="w-full sm:w-auto rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition">
              Sign in
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-500">Forex · Crypto · Stocks · Commodities · Indices</p>
        </div>
        <div className="mt-8 animate-bounce text-slate-600 text-xl">↓</div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-800 bg-slate-900/30 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            { value: "27", label: "Markets", icon: "🌍" },
            { value: "5", label: "AI Strategies", icon: "⚡" },
            { value: "100%", label: "Free", icon: "✅" },
            { value: "24/7", label: "Live Data", icon: "📡" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl">{s.icon}</div>
              <p className="mt-1 text-2xl sm:text-3xl font-bold text-emerald-400">{s.value}</p>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MARKETS */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 border-b border-slate-800 bg-slate-900/20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-center text-xs uppercase tracking-[0.2em] text-slate-500">27 markets covered</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {MARKETS.map((m) => (
              <div key={m.label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${m.color}`}>{m.label}</p>
                <div className="flex flex-wrap gap-1">
                  {m.items.map((item) => (
                    <span key={item} className="rounded-md bg-slate-800 px-1.5 py-0.5 text-xs text-slate-300">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 border-b border-slate-800">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">How it works</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold">3 steps to smarter trading</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {HOW_STEPS.map((s) => (
              <div key={s.step} className={`rounded-2xl border p-5 sm:p-6 ${s.color}`}>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{s.icon}</span>
                  <span className={`text-4xl font-black opacity-20 ${s.num}`}>{s.step}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-slate-100">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/register" className="inline-block rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
              Get started in 30 seconds
            </Link>
          </div>
        </div>
      </section>

      {/* LIVE PREVIEW */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 border-b border-slate-800">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Live preview</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold">See what an AI signal looks like</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Signal card */}
            <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase">AI Signal</p>
                  <p className="text-lg font-bold text-slate-100">BTCUSDT</p>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-sm font-bold text-emerald-400">BUY</span>
              </div>
              <div className="flex gap-4 text-sm mb-3">
                <div><p className="text-slate-500 text-xs">Confidence</p><p className="font-semibold text-slate-200">78%</p></div>
                <div><p className="text-slate-500 text-xs">Risk</p><p className="font-semibold text-amber-400">Medium</p></div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 mb-3">
                <div className="h-1.5 w-[78%] rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                &ldquo;RSI at 34.2 suggests oversold. MACD crossing bullish. Potential reversal setup forming.&rdquo;
              </p>
            </div>
            {/* Journal card */}
            <div className="rounded-2xl border border-violet-500/20 bg-slate-900/60 p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase">AI Trade Journal</p>
                  <p className="text-lg font-bold text-slate-100">BTCUSDT LONG</p>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">EXCELLENT</span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm mb-3">
                <div><p className="text-slate-500 text-xs">Entry</p><p className="font-mono font-semibold text-slate-200">$67,200</p></div>
                <div><p className="text-slate-500 text-xs">Exit</p><p className="font-mono font-semibold text-slate-200">$68,750</p></div>
                <div><p className="text-slate-500 text-xs">P&amp;L</p><p className="font-mono font-semibold text-emerald-400">+$155</p></div>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300 mb-3">
                &ldquo;Entry timing was strong. RSI oversold at 32. Exit was near-optimal.&rdquo;
              </p>
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                <p className="text-xs font-semibold text-amber-400">Key lesson</p>
                <p className="text-xs text-slate-300 mt-0.5">Consider a trailing stop next time to capture more upside.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Features</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold">Everything a serious trader needs</h2>
            <p className="mt-3 text-slate-400 text-sm">Built different — most features here exist nowhere else.</p>
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Link key={f.title} href={f.href}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5 transition hover:border-emerald-500/40 hover:bg-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-slate-600 text-xs opacity-0 group-hover:opacity-100 transition">Explore →</span>
                </div>
                <h3 className="mt-3 font-semibold text-slate-100 group-hover:text-emerald-400 transition text-sm sm:text-base">{f.title}</h3>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CALLOUT */}
      <section className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">What makes us different</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold">
            We don&apos;t just show data —<br />
            <span className="text-emerald-400">we explain it</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
            Every signal has a plain-English reason. Every trade gets AI coaching.
            Previously only for institutions — now free for everyone.
          </p>
          <Link href="/register" className="mt-6 inline-block rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
            Try it free
          </Link>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="px-4 sm:px-6 pb-12 sm:pb-16 pt-2 text-center">
        <h2 className="text-xl sm:text-3xl font-bold">Ready to trade smarter?</h2>
        <p className="mt-2 text-slate-400 text-sm">Join traders who use AI to understand markets.</p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/register" className="w-full sm:w-auto rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
            Get started free
          </Link>
          <Link href="/login" className="text-sm text-slate-400 hover:text-slate-200 transition">
            Already have an account →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 px-4 sm:px-6 py-8 text-center text-xs text-slate-600">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-slate-500 text-xs sm:text-sm mb-4">
          <Link href="/markets" className="hover:text-slate-300">Markets</Link>
          <Link href="/markets/crypto" className="hover:text-slate-300">Crypto</Link>
          <Link href="/markets/forex" className="hover:text-slate-300">Forex</Link>
          <Link href="/markets/stocks" className="hover:text-slate-300">Stocks</Link>
          <Link href="/learn" className="hover:text-slate-300">Learn</Link>
          <Link href="/news" className="hover:text-slate-300">News</Link>
          <Link href="/leaderboard" className="hover:text-slate-300">Leaderboard</Link>
          <Link href="/about" className="hover:text-slate-300">About</Link>
          <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-300">Terms</Link>
        </div>
        <p>AI Trading Copilot · Educational purposes only · Not financial advice</p>
        <p className="mt-1">© {new Date().getFullYear()} AI Trading Copilot</p>
      </footer>
    </div>
  );
}
