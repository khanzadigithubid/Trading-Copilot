"use client";
import Link from "next/link";
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
  { icon: "🤖", title: "AI Explains WHY", desc: "Every signal comes with plain-English reasoning — not just BUY/SELL numbers." },
  { icon: "📚", title: "AI Trade Journal", desc: "Every closed trade gets automatic coaching. What you did right, what to improve." },
  { icon: "🕐", title: "Multi-Timeframe", desc: "1D + 1W + 1M signals combined into one weighted verdict." },
  { icon: "🌡️", title: "Sentiment Heatmap", desc: "Market mood across 27 assets from news + price action." },
  { icon: "👥", title: "Community", desc: "Share signals, vote on ideas, see collective market consensus." },
  { icon: "📊", title: "Portfolio Analytics", desc: "Sharpe ratio, equity curve, drawdown — professional metrics for free." },
];

const TECH = [
  { name: "Next.js 14", desc: "React framework", color: "text-slate-100" },
  { name: "FastAPI", desc: "Python backend", color: "text-emerald-400" },
  { name: "PostgreSQL", desc: "Neon cloud DB", color: "text-blue-400" },
  { name: "OpenRouter AI", desc: "Free AI models", color: "text-violet-400" },
  { name: "TradingView Charts", desc: "Professional charts", color: "text-amber-400" },
  { name: "Vercel + Render", desc: "Free deployment", color: "text-rose-400" },
];

export default function AboutPage() {
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
      <section className="px-4 sm:px-4 sm:px-4 sm:px-6 py-6 sm:py-8 sm:py-12 sm:py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 font-black text-2xl">AI</div>
        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">About AI Trading Copilot</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
          We built the trading platform we wished existed when we started trading.
          One that doesn&apos;t just show numbers — but explains them.
        </p>
      </section>

      {/* Mission */}
      <section className="border-y border-slate-800 bg-slate-900/30 px-4 sm:px-4 sm:px-4 sm:px-6 py-6 sm:py-8 sm:py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-400">Our Mission</p>
              <h2 className="mt-3 text-3xl font-bold">Democratize professional trading intelligence</h2>
              <p className="mt-4 leading-relaxed text-slate-400">
                Bloomberg Terminal costs $24,000 per year. Professional traders have access to
                AI analysis, real-time data, and portfolio tools that retail traders cannot afford.
                We believe every trader — whether in New York, Karachi, Lagos, or Jakarta —
                deserves the same quality of market intelligence. For free.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-400">Why We Built This</p>
              <h2 className="mt-3 text-3xl font-bold">Trading is hard. Understanding is harder.</h2>
              <p className="mt-4 leading-relaxed text-slate-400">
                Most traders lose money not because they lack discipline — but because they lack
                explanation. When an app says &quot;BUY&quot;, you deserve to know why.
                When you close a losing trade, you deserve to understand what went wrong.
                AI Trading Copilot is built around one principle: explain everything.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section className="px-4 sm:px-4 sm:px-4 sm:px-6 py-6 sm:py-8 sm:py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs uppercase tracking-widest text-emerald-400">What Makes Us Different</p>
          <h2 className="mt-3 text-center text-3xl font-bold">Features that exist nowhere else</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="border-y border-slate-800 bg-slate-900/30 px-4 sm:px-4 sm:px-4 sm:px-6 py-6 sm:py-8 sm:py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs uppercase tracking-widest text-emerald-400">Built With</p>
          <h2 className="mt-3 text-center text-3xl font-bold">Modern open-source tech stack</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TECH.map((t) => (
              <div key={t.name} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
                <div>
                  <p className={`font-semibold ${t.color}`}>{t.name}</p>
                  <p className="text-xs text-slate-500">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="px-4 sm:px-4 sm:px-4 sm:px-6 py-6 sm:py-8 sm:py-12 sm:py-16 text-center">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Coverage</p>
        <h2 className="mt-3 text-3xl font-bold">27 Markets. 5 Asset Classes.</h2>
        <p className="mt-4 text-slate-400">Forex · Crypto · Stocks · Commodities · Indices</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/markets/crypto" className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-400 hover:bg-amber-500/20 transition">₿ Crypto</Link>
          <Link href="/markets/forex" className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-2.5 text-sm font-medium text-blue-400 hover:bg-blue-500/20 transition">💱 Forex</Link>
          <Link href="/markets/stocks" className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-sm font-medium text-violet-400 hover:bg-violet-500/20 transition">📈 Stocks</Link>
          <Link href="/markets/commodities" className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-2.5 text-sm font-medium text-yellow-400 hover:bg-yellow-500/20 transition">🪙 Commodities</Link>
          <Link href="/markets/indices" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition">🏦 Indices</Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-slate-800 bg-slate-900/20 px-4 sm:px-4 sm:px-6 py-6 sm:py-8 sm:py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-slate-300">⚠️ Important Disclaimer</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            AI Trading Copilot is for educational purposes only. All signals, analysis, and content
            provided are not financial advice. Paper trading uses virtual money — no real funds are
            at risk. Always do your own research before making investment decisions.
            Past performance does not guarantee future results.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-4 sm:px-6 py-6 sm:py-8 text-center text-xs text-slate-600">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="hover:text-slate-400">Home</Link>
          <Link href="/markets" className="hover:text-slate-400">Markets</Link>
          <Link href="/privacy" className="hover:text-slate-400">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-400">Terms</Link>
          <Link href="/contact" className="hover:text-slate-400">Contact</Link>
        </div>
        <p className="mt-4">© {new Date().getFullYear()} AI Trading Copilot · For educational purposes only</p>
      </footer>
    </div>
  );
}
