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
  {
    icon: "🤖",
    title: "Explainable AI Signals",
    desc: "BUY/SELL/HOLD with plain-English reasoning. Know exactly why — not just what.",
    tag: "Core",
  },
  {
    icon: "📈",
    title: "Professional Charts",
    desc: "TradingView-style candlestick charts with volume, signal markers and 4 timeframes.",
    tag: "Charts",
  },
  {
    icon: "🕐",
    title: "Multi-Timeframe Analysis",
    desc: "1D + 1W + 1M signals merged into one weighted verdict for higher accuracy.",
    tag: "Analysis",
  },
  {
    icon: "⚡",
    title: "5 Backtest Strategies",
    desc: "RSI+MACD, Bollinger Bands, EMA Crossover, SuperTrend, Mean Reversion — test before you trade.",
    tag: "Backtest",
  },
  {
    icon: "📚",
    title: "AI Trade Journal",
    desc: "Every closed trade gets automatic AI coaching — strengths, mistakes, and key lessons.",
    tag: "Journal",
  },
  {
    icon: "📊",
    title: "Portfolio Analytics",
    desc: "Equity curve, Sharpe ratio, max drawdown, win streaks — institutional-grade metrics.",
    tag: "Portfolio",
  },
  {
    icon: "👥",
    title: "Community Signals",
    desc: "Share trade ideas, vote on analysis, see what the crowd thinks about any market.",
    tag: "Social",
  },
  {
    icon: "🔔",
    title: "Price Alerts",
    desc: "Set price-above or price-below alerts on any of the 27 assets. Never miss a move.",
    tag: "Alerts",
  },
  {
    icon: "📐",
    title: "Risk Manager",
    desc: "Position sizing calculator based on your capital and risk tolerance. Trade smart.",
    tag: "Risk",
  },
  {
    icon: "💬",
    title: "AI Market Chat",
    desc: "Ask anything in plain language. AI answers with live prices and real context.",
    tag: "AI",
  },
  {
    icon: "🌡️",
    title: "Sentiment Heatmap",
    desc: "See the market mood across all 27 assets at one glance.",
    tag: "Sentiment",
  },
  {
    icon: "📱",
    title: "PWA — Works Offline",
    desc: "Install on your phone from the browser. No app store. Works even without internet.",
    tag: "Mobile",
  },
];

const MARKETS = [
  { label: "Crypto", items: ["BTC", "ETH", "SOL", "BNB", "XRP"], color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  { label: "Forex", items: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"], color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  { label: "Stocks", items: ["AAPL", "NVDA", "TSLA", "GOOGL"], color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/20" },
  { label: "Commodities", items: ["Gold", "Silver", "Oil (WTI)"], color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  { label: "Indices", items: ["S&P 500", "NASDAQ", "Dow Jones"], color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
];

const STEPS = [
  { n: "01", icon: "📝", title: "Create free account", desc: "Sign up in 30 seconds. No credit card, no broker connection needed.", color: "emerald" },
  { n: "02", icon: "🤖", title: "Get AI signals", desc: "Pick any asset. AI explains the signal in plain English with full reasoning.", color: "blue" },
  { n: "03", icon: "📚", title: "Practice & improve", desc: "Paper trade with virtual money. AI coaches you after every trade.", color: "violet" },
];

const STATS = [
  { value: "27", label: "Live Markets", icon: "🌍" },
  { value: "5", label: "AI Strategies", icon: "⚡" },
  { value: "100%", label: "Free Forever", icon: "✅" },
  { value: "24/7", label: "Live Data", icon: "📡" },
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

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900">
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
            <Link href="/login" className="hidden md:block text-sm text-slate-400 hover:text-slate-100 transition">Sign in</Link>
            <Link href="/register" className="hidden md:block rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
              Get started
            </Link>
            <MobileNav links={NAV_LINKS} showAuth={true} />
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex min-h-[calc(100vh-57px)] flex-col items-center justify-center px-4 sm:px-6 pb-12 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-[100px]" />
          <div className="absolute left-1/4 top-2/3 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[80px]" />
        </div>

        <div className="relative w-full max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5 text-xs font-medium text-emerald-400 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            27 markets · Live prices · AI-powered · 100% free
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Trade smarter with<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              AI that explains itself
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-xl leading-relaxed text-slate-400 mb-8">
            Not just signals — full reasoning. Know exactly why the AI says BUY or SELL.
            Professional risk tools, backtesting, and trade journaling. All free.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-8 py-3.5 text-sm font-bold text-slate-950 transition shadow-xl shadow-emerald-500/25">
              Start free — no credit card
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/markets"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 px-8 py-3.5 text-sm font-semibold text-slate-300 transition">
              Browse markets
            </Link>
          </div>

          {/* Trust line */}
          <p className="text-xs text-slate-600">
            Forex · Crypto · Stocks · Commodities · Indices · Paper trading only · Not financial advice
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-700">
          <span className="text-xs">scroll</span>
          <svg className="h-4 w-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>


      {/* ── STATS ── */}
      <section className="border-y border-slate-800/60 bg-slate-900/30 py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center gap-1">
              <span className="text-2xl mb-1">{s.icon}</span>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">{s.value}</p>
              <p className="text-xs sm:text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE SIGNAL PREVIEW ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-3">Live preview</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">See what an AI signal looks like</h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Every signal comes with reasoning you can actually understand and act on.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Signal card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-emerald-500/30 transition">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">AI Signal</p>
                  <p className="text-xl font-bold">BTCUSDT</p>
                </div>
                <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-1.5 text-sm font-black text-emerald-400">
                  BUY
                </span>
              </div>
              <div className="flex gap-6 text-sm mb-4">
                <div>
                  <p className="text-slate-600 text-xs mb-0.5">Confidence</p>
                  <p className="font-bold text-slate-200">78%</p>
                </div>
                <div>
                  <p className="text-slate-600 text-xs mb-0.5">Risk Level</p>
                  <p className="font-bold text-amber-400">Medium</p>
                </div>
                <div>
                  <p className="text-slate-600 text-xs mb-0.5">Timeframe</p>
                  <p className="font-bold text-slate-200">1D</p>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 mb-4">
                <div className="h-1.5 w-[78%] rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400" />
              </div>
              <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-4">
                <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wide font-semibold">AI Reasoning</p>
                <p className="text-sm leading-relaxed text-slate-300">
                  &ldquo;RSI at 34.2 suggests oversold conditions. MACD crossing above signal line — bullish momentum building. Price action down 2.1% over 20 candles. Reversal setup forming.&rdquo;
                </p>
              </div>
            </div>

            {/* Journal card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-violet-500/30 transition">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">AI Trade Journal</p>
                  <p className="text-xl font-bold">BTCUSDT LONG</p>
                </div>
                <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-black text-emerald-400">
                  EXCELLENT
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm mb-4">
                <div>
                  <p className="text-slate-600 text-xs mb-0.5">Entry</p>
                  <p className="font-mono font-bold text-slate-200">$67,200</p>
                </div>
                <div>
                  <p className="text-slate-600 text-xs mb-0.5">Exit</p>
                  <p className="font-mono font-bold text-slate-200">$68,750</p>
                </div>
                <div>
                  <p className="text-slate-600 text-xs mb-0.5">P&amp;L</p>
                  <p className="font-mono font-bold text-emerald-400">+$155 (+2.3%)</p>
                </div>
              </div>
              <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-4 mb-3">
                <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wide font-semibold">AI Feedback</p>
                <p className="text-sm leading-relaxed text-slate-300">
                  &ldquo;Entry timing was strong — RSI oversold at 32. You held through the dip. Exit was near-optimal, capturing 87% of the move.&rdquo;
                </p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                <p className="text-xs font-bold text-amber-400 mb-0.5">💡 Key lesson</p>
                <p className="text-xs text-slate-400">Consider a trailing stop next time to capture the remaining 13% upside.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── MARKETS ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-y border-slate-800/60 bg-slate-900/20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-3">Markets</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">27 markets, all live data</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {MARKETS.map((m) => (
              <div key={m.label} className={`rounded-2xl border ${m.bg} p-4`}>
                <p className={`text-xs font-black uppercase tracking-wider mb-3 ${m.color}`}>{m.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.items.map((item) => (
                    <span key={item} className="rounded-lg bg-slate-900/80 px-2 py-1 text-xs text-slate-300 font-medium">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Up and running in 3 steps</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}
                className={`relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition`}>
                <span className="absolute top-4 right-4 text-5xl font-black opacity-[0.07] text-white select-none">{s.n}</span>
                <span className="text-3xl mb-4 block">{s.icon}</span>
                <h3 className="font-bold text-slate-100 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-8 py-3.5 text-sm font-bold text-slate-950 transition shadow-lg shadow-emerald-500/20">
              Get started free
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-slate-800/60">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Everything a serious trader needs</h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Most of these features exist nowhere else for free. We built what professionals use — for everyone.
            </p>
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title}
                className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 hover:border-slate-700 hover:bg-slate-900/80 transition">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 border border-slate-800 rounded-full px-2 py-0.5">
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-bold text-slate-100 mb-1.5 group-hover:text-emerald-400 transition text-sm sm:text-base">{f.title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── COMPARISON CALLOUT ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-slate-800/60 bg-slate-900/20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-3">Why us</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">We explain. Others just signal.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <p className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2">
                <span>❌</span> Other platforms
              </p>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2"><span className="text-slate-700">•</span> RSI: 34.2 — Signal: BUY</li>
                <li className="flex items-center gap-2"><span className="text-slate-700">•</span> No reasoning given</li>
                <li className="flex items-center gap-2"><span className="text-slate-700">•</span> Expensive subscriptions</li>
                <li className="flex items-center gap-2"><span className="text-slate-700">•</span> No trade coaching</li>
                <li className="flex items-center gap-2"><span className="text-slate-700">•</span> No backtesting on free tier</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6">
              <p className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <span>✅</span> AI Trading Copilot
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> Full plain-English reasoning</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> AI explains every signal</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> 100% free forever</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> AI coaching after every trade</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> 5 backtest strategies free</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="relative rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/8 to-transparent p-10 sm:p-16">
            <div className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 h-40 w-80 bg-emerald-500/10 blur-3xl" />
            </div>
            <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-4">Get started today</p>
            <h2 className="relative text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Start trading smarter.<br />
              <span className="text-emerald-400">For free. Right now.</span>
            </h2>
            <p className="relative text-slate-400 text-sm sm:text-base max-w-md mx-auto mb-8">
              No credit card. No broker. No risk. Just AI-powered trading education at your fingertips.
            </p>
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-10 py-4 text-sm font-bold text-slate-950 transition shadow-2xl shadow-emerald-500/30">
                Create free account
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/login"
                className="text-sm text-slate-500 hover:text-slate-300 transition">
                Already have an account →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800/60 px-4 sm:px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-black text-xs">AI</div>
              <span className="font-bold text-slate-300">Trading Copilot</span>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
              <Link href="/markets" className="hover:text-slate-300 transition">Markets</Link>
              <Link href="/learn" className="hover:text-slate-300 transition">Learn</Link>
              <Link href="/news" className="hover:text-slate-300 transition">News</Link>
              <Link href="/leaderboard" className="hover:text-slate-300 transition">Leaderboard</Link>
              <Link href="/about" className="hover:text-slate-300 transition">About</Link>
              <Link href="/contact" className="hover:text-slate-300 transition">Contact</Link>
              <Link href="/privacy" className="hover:text-slate-300 transition">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-300 transition">Terms</Link>
            </div>
          </div>
          <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} AI Trading Copilot. Built by Khanzadi.</p>
            <p>For educational purposes only · Not financial advice</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
