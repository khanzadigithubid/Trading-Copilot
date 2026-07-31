"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const FEATURES = [
  {
    icon: "🤖",
    title: "Explainable AI Signals",
    desc: "BUY / SELL / HOLD with plain-English reasoning — not just numbers. Powered by Claude AI with rule-based fallback.",
    href: "/dashboard?tab=signals",
  },
  {
    icon: "📈",
    title: "TradingView Charts",
    desc: "Professional candlestick charts with volume, signal markers, and 4 timeframe tabs for 27 assets.",
    href: "/dashboard?tab=chart",
  },
  {
    icon: "🕐",
    title: "Multi-Timeframe Analysis",
    desc: "1D + 1W + 1M signals combined into one weighted verdict with agreement detection.",
    href: "/dashboard?tab=signals",
  },
  {
    icon: "🌡️",
    title: "Sentiment Heatmap",
    desc: "News + price-action sentiment scores across all markets — see the mood at a glance.",
    href: "/dashboard?tab=community",
  },
  {
    icon: "👥",
    title: "Community Signals",
    desc: "Share trade ideas, vote on others' analysis, see the collective BUY/SELL/HOLD consensus.",
    href: "/dashboard?tab=community",
  },
  {
    icon: "📚",
    title: "AI Trade Journal",
    desc: "Every closed trade gets automatic AI analysis — what you did right, what to improve.",
    href: "/dashboard?tab=trading",
  },
  {
    icon: "📊",
    title: "Portfolio Analytics",
    desc: "Equity curve, Sharpe ratio, profit factor, max drawdown, win/loss streaks — all in one view.",
    href: "/dashboard?tab=portfolio",
  },
  {
    icon: "🔔",
    title: "Price Alerts",
    desc: "Set price-above or price-below alerts for any asset. Auto-checked against live prices.",
    href: "/dashboard?tab=alerts",
  },
  {
    icon: "⚡",
    title: "5 Backtest Strategies",
    desc: "RSI+MACD, Bollinger Bands, EMA Crossover, SuperTrend, Mean Reversion — test before you trade.",
    href: "/dashboard?tab=signals",
  },
  {
    icon: "💬",
    title: "Market Chat (AI)",
    desc: "Ask anything in plain language. Live prices + signals answer your questions instantly.",
    href: "/dashboard?tab=alerts",
  },
  {
    icon: "📐",
    title: "Risk Manager",
    desc: "Position sizing calculator, overtrading alerts, and drawdown monitoring per user account.",
    href: "/dashboard?tab=trading",
  },
  {
    icon: "📱",
    title: "Install as App (PWA)",
    desc: "Add to your phone home screen. Works offline. No app store needed.",
    href: "/register",
  },
];

const MARKETS = [
  { label: "Forex", items: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "+3 more"], color: "text-blue-400" },
  { label: "Crypto", items: ["BTC", "ETH", "SOL", "BNB", "+3 more"], color: "text-amber-400" },
  { label: "Stocks", items: ["AAPL", "MSFT", "NVDA", "TSLA", "+3 more"], color: "text-violet-400" },
  { label: "Commodities", items: ["Gold (XAU)", "Silver (XAG)", "Oil (WTI)"], color: "text-yellow-400" },
  { label: "Indices", items: ["S&P 500", "NASDAQ", "Dow Jones"], color: "text-emerald-400" },
];


export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();

  // Logged-in user → straight to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  // Show nothing while checking auth
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* ── Nav ── */}
      <nav className="fixed top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">
              AI
            </div>
            <span className="font-semibold text-slate-100">Trading Copilot</span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-sm text-slate-400">
            <Link href="/markets" className="hover:text-slate-100 transition">Markets</Link>
            <Link href="/learn" className="hover:text-slate-100 transition">Learn</Link>
            <Link href="/news" className="hover:text-slate-100 transition">News</Link>
            <Link href="/leaderboard" className="hover:text-slate-100 transition">Leaderboard</Link>
            <Link href="/about" className="hover:text-slate-100 transition">About</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-slate-100 transition">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            27 markets · Live prices · AI-powered
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-100 sm:text-7xl">
            The AI trading
            <br />
            <span className="text-emerald-400">copilot</span> you need
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Explainable AI signals, multi-timeframe analysis, community trading ideas, and professional
            risk management — all in one platform. Paper trade first, profit later.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
            >
              Start free — no credit card
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-slate-700 px-8 py-3.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Sign in
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-xs text-slate-500">
            Forex · Crypto · Stocks · Commodities · Indices · All in one dashboard
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce text-slate-600 text-xl">↓</div>
      </section>

      {/* ── App Preview (Mock Dashboard) ── */}
      <section className="border-b border-slate-800 bg-slate-900/20 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-emerald-400 mb-4">
            See it in action
          </p>
          <h2 className="text-center text-2xl font-bold mb-10">
            Everything you need in one dashboard
          </h2>

          {/* Mock browser window */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl shadow-black/40">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-1 text-xs text-slate-400">
                <span className="text-emerald-400">🔒</span>
                kw-trading-copilot.vercel.app/dashboard
              </div>
            </div>

            {/* Mock dashboard content */}
            <div className="p-4 sm:p-6">
              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
                {[
                  { label: "Capital", value: "$10,000", color: "text-emerald-400" },
                  { label: "Risk/trade", value: "2%", color: "text-slate-100" },
                  { label: "Open trades", value: "3", color: "text-blue-400" },
                  { label: "Total P&L", value: "+$842", color: "text-emerald-400" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-xs text-slate-500">{s.label}</p>
                    <p className={`mt-1 text-lg font-bold font-mono ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Main grid */}
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Asset table mock */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Live Market Prices</p>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { sym: "BTCUSDT", type: "crypto", price: "$64,034", chg: "+2.1%", up: true },
                      { sym: "XAUUSD",  type: "forex",  price: "$4,065",  chg: "+0.8%", up: true },
                      { sym: "EURUSD",  type: "forex",  price: "1.1450",  chg: "-0.2%", up: false },
                      { sym: "AAPL",    type: "stock",  price: "$338.19", chg: "+1.4%", up: true },
                      { sym: "NVDA",    type: "stock",  price: "$190.01", chg: "+3.2%", up: true },
                    ].map((row) => (
                      <div key={row.sym} className="flex items-center justify-between rounded-lg bg-slate-900/60 px-3 py-2 text-xs">
                        <span className="font-semibold text-slate-100 w-20">{row.sym}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${
                          row.type === "crypto" ? "bg-amber-500/15 text-amber-400" :
                          row.type === "forex"  ? "bg-blue-500/15 text-blue-400" :
                          "bg-violet-500/15 text-violet-400"
                        }`}>{row.type}</span>
                        <span className="font-mono text-slate-100">{row.price}</span>
                        <span className={`font-mono ${row.up ? "text-emerald-400" : "text-red-400"}`}>{row.chg}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Signal mock */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="text-sm font-semibold mb-3">AI Signal — BTCUSDT</p>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-4 py-1.5 text-sm font-bold text-emerald-400">
                      BUY
                    </span>
                    <span className="text-sm text-slate-300">78% confidence</span>
                    <span className="text-sm text-amber-400">medium risk</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 mb-3">
                    <div className="h-1.5 w-[78%] rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300 mb-3">
                    &ldquo;RSI at 34.2 suggests oversold conditions. MACD is crossing above its signal line indicating bullish momentum. Price action shows a potential reversal setup forming.&rdquo;
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[["RSI", "34.2"], ["MACD", "+0.42"], ["MA50", "63,120"]].map(([l, v]) => (
                      <div key={l} className="rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-center">
                        <p className="text-xs text-slate-500">{l}</p>
                        <p className="font-mono text-xs text-slate-200">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom row */}
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <p className="text-xs font-semibold text-slate-400 mb-2">📚 AI Trade Journal</p>
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-emerald-400">BTCUSDT LONG</span>
                      <span className="text-xs text-emerald-400">EXCELLENT</span>
                    </div>
                    <p className="text-xs text-slate-400">&ldquo;Entry timing was strong. RSI oversold at 32. Consider trailing stop next time.&rdquo;</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <p className="text-xs font-semibold text-slate-400 mb-2">🕐 Multi-Timeframe</p>
                  <div className="space-y-1.5">
                    {[["1D", "BUY", "72%", "text-emerald-400"], ["1W", "BUY", "68%", "text-emerald-400"], ["1M", "HOLD", "51%", "text-slate-400"]].map(([tf, sig, conf, col]) => (
                      <div key={tf} className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">{tf}</span>
                        <span className={`font-semibold ${col}`}>{sig}</span>
                        <span className="text-slate-400">{conf}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <p className="text-xs font-semibold text-slate-400 mb-2">🌡️ Sentiment</p>
                  <div className="space-y-1.5">
                    {[["BTCUSDT", "+0.72", "text-emerald-400"], ["XAUUSD", "+0.58", "text-emerald-400"], ["EURUSD", "-0.12", "text-red-400"]].map(([sym, score, col]) => (
                      <div key={sym} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{sym}</span>
                        <span className={`font-mono ${col}`}>{score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-600">
            Live dashboard at{" "}
            <Link href="/register" className="text-emerald-500 hover:underline">
              kw-trading-copilot.vercel.app
            </Link>
          </p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-b border-slate-800 bg-slate-900/30 py-8 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "27",    label: "Markets covered",      icon: "🌍" },
              { value: "5",     label: "AI backtest strategies", icon: "⚡" },
              { value: "100%",  label: "Free to use",           icon: "✅" },
              { value: "24/7",  label: "Live price updates",    icon: "📡" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl">{s.icon}</div>
                <p className="mt-2 text-3xl font-bold text-emerald-400">{s.value}</p>
                <p className="mt-1 text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Markets ticker ── */}
      <section className="border-y border-slate-800 bg-slate-900/50 py-10 px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-slate-500">
            27 markets covered
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {MARKETS.map((m) => (
              <div key={m.label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className={`text-xs font-semibold uppercase tracking-widest ${m.color}`}>
                  {m.label}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.items.map((item) => (
                    <span key={item} className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-6 py-20 border-b border-slate-800">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">How it works</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Start trading smarter in 3 steps
            </h2>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                icon: "📝",
                title: "Create free account",
                desc: "Register in 30 seconds — no credit card, no broker needed. Just email and password.",
                color: "border-emerald-500/30 bg-emerald-500/5",
                numColor: "text-emerald-400",
              },
              {
                step: "02",
                icon: "🤖",
                title: "Pick asset & get AI signal",
                desc: "Select any of 27 markets. AI analyses RSI, MACD, moving averages and explains the signal in plain English.",
                color: "border-blue-500/30 bg-blue-500/5",
                numColor: "text-blue-400",
              },
              {
                step: "03",
                icon: "📚",
                title: "Paper trade & learn",
                desc: "Open virtual trades with no real money. Every closed trade gets AI coaching feedback automatically.",
                color: "border-violet-500/30 bg-violet-500/5",
                numColor: "text-violet-400",
              },
            ].map((s) => (
              <div key={s.step} className={`rounded-2xl border p-6 ${s.color}`}>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{s.icon}</span>
                  <span className={`text-5xl font-black opacity-20 ${s.numColor}`}>{s.step}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-100">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Connector line (desktop only) */}
          <div className="mt-10 hidden sm:flex items-center justify-center gap-2 text-slate-600 text-sm">
            <span>Register</span>
            <span className="flex-1 border-t border-dashed border-slate-700 mx-4" />
            <span>Get signal</span>
            <span className="flex-1 border-t border-dashed border-slate-700 mx-4" />
            <span>Learn & improve</span>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/register"
              className="rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
            >
              Get started in 30 seconds
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live Signal Preview ── */}
      <section className="px-6 py-20 border-b border-slate-800">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Live preview</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              See what an AI signal looks like
            </h2>
            <p className="mt-4 text-slate-400">
              This is a real example of what you get — not just a number, but a full explanation.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* Signal card */}
            <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">AI Signal</p>
                  <p className="mt-1 text-xl font-bold text-slate-100">BTCUSDT</p>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-4 py-1.5 text-sm font-bold text-emerald-400">
                  BUY
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Confidence</p>
                  <p className="font-semibold text-slate-200">78%</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Risk</p>
                  <p className="font-semibold text-amber-400">Medium</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Source</p>
                  <p className="font-semibold text-slate-200">Claude AI</p>
                </div>
              </div>

              {/* Confidence bar */}
              <div className="mt-4 h-1.5 w-full rounded-full bg-slate-800">
                <div className="h-1.5 w-[78%] rounded-full bg-emerald-500" />
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                &ldquo;RSI at 34.2 suggests oversold conditions. MACD is crossing above its signal line indicating
                bullish momentum. Price action over the last 20 candles moved down 2.1% — a potential
                reversal setup. Overall bias is bullish with medium risk.&rdquo;
              </p>

              {/* Indicators */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  ["RSI",  "34.2"],
                  ["MACD", "+0.42"],
                  ["MA50", "67,120"],
                ].map(([label, val]) => (
                  <div key={label} className="rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-center">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-0.5 font-mono text-xs text-slate-200">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Journal card */}
            <div className="rounded-2xl border border-violet-500/20 bg-slate-900/60 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">AI Trade Journal</p>
                  <p className="mt-1 text-xl font-bold text-slate-100">BTCUSDT — LONG</p>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
                  EXCELLENT
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Entry</p>
                  <p className="font-mono font-semibold text-slate-200">$67,200</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Exit</p>
                  <p className="font-mono font-semibold text-slate-200">$68,750</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">P&amp;L</p>
                  <p className="font-mono font-semibold text-emerald-400">+$155.00</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                &ldquo;You opened a LONG on BTCUSDT at $67,200 and closed at $68,750.
                RSI was at 32 at entry — strong oversold signal. Your exit was near-optimal.
                Price moved +2.3% in your favour.&rdquo;
              </p>

              <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                <p className="text-xs font-semibold text-amber-400">Key lesson</p>
                <p className="mt-0.5 text-xs text-slate-300">
                  Entry timing was excellent. Consider a trailing stop next time to capture more upside.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            * Sample data for illustration. Real signals are generated from live market data.
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Features</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Everything a serious trader needs
            </h2>
            <p className="mt-4 text-slate-400">
              Built different — most features here exist nowhere else in retail trading platforms.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-emerald-500/40 hover:bg-slate-900 hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-slate-600 text-xs opacity-0 group-hover:opacity-100 transition">
                    Explore →
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-slate-100 group-hover:text-emerald-400 transition">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Unique callout ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">What makes us different</p>
          <h2 className="mt-4 text-3xl font-bold">
            We don&apos;t just show data —<br />
            <span className="text-emerald-400">we explain it</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Every signal comes with a plain-English explanation of why. Every closed trade gets AI
            coaching feedback. This level of insight was previously only available to
            institutional traders — now it is available to everyone.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
          >
            Try it free
          </Link>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="px-6 pb-20 pt-4 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Ready to trade smarter?
        </h2>
        <p className="mt-3 text-slate-400">
          Join traders who use AI to understand markets — not just guess.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
          >
            Get started free
          </Link>
          <Link href="/login" className="text-sm text-slate-400 hover:text-slate-200 transition">
            Already have an account →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 px-6 py-10 text-center text-xs text-slate-600">
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm mb-6">
          <Link href="/markets" className="hover:text-slate-300 transition">Markets</Link>
          <Link href="/markets/crypto" className="hover:text-slate-300 transition">Crypto</Link>
          <Link href="/markets/forex" className="hover:text-slate-300 transition">Forex</Link>
          <Link href="/markets/stocks" className="hover:text-slate-300 transition">Stocks</Link>
          <Link href="/markets/commodities" className="hover:text-slate-300 transition">Commodities</Link>
          <Link href="/markets/indices" className="hover:text-slate-300 transition">Indices</Link>
          <Link href="/learn" className="hover:text-slate-300 transition">Learn</Link>
          <Link href="/news" className="hover:text-slate-300 transition">News</Link>
          <Link href="/leaderboard" className="hover:text-slate-300 transition">Leaderboard</Link>
          <Link href="/about" className="hover:text-slate-300 transition">About</Link>
          <Link href="/contact" className="hover:text-slate-300 transition">Contact</Link>
          <Link href="/privacy" className="hover:text-slate-300 transition">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-300 transition">Terms</Link>
        </div>
        <p>AI Trading Copilot · For educational purposes only · Not financial advice</p>
        <p className="mt-1">© {new Date().getFullYear()} AI Trading Copilot. All rights reserved.</p>
      </footer>
    </div>
  );
}
