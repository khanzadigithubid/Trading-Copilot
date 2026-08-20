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

const INDICES = [
  {
    symbol: "SPY",
    name: "S&P 500 ETF",
    short: "SPY",
    icon: "🏛️",
    color: "text-emerald-400",
    tracks: "S&P 500 Index",
    companies: 500,
    price_range: "$400 — $560",
    description: "SPY tracks the S&P 500 — 500 largest publicly traded US companies. It is the most popular ETF in the world with over $500 billion in assets. When people say 'the stock market is up today', they usually mean the S&P 500. It includes companies like Apple, Microsoft, Amazon, Google, and NVIDIA.",
    top_holdings: ["Apple (AAPL) 7%", "Microsoft (MSFT) 7%", "NVIDIA (NVDA) 5%", "Amazon (AMZN) 4%", "Google (GOOGL) 4%"],
    sectors: ["Technology 29%", "Healthcare 13%", "Financials 13%", "Consumer Disc. 10%", "Industrials 9%"],
    key_drivers: ["US GDP & economic data", "Federal Reserve policy", "Corporate earnings", "Inflation (CPI)", "Employment data (NFP)"],
    trading_tip: "SPY is the safest way to invest in the US stock market. Warren Buffett recommends buying S&P 500 index funds. In bear markets, SPY drops 20-50% but has always recovered to new highs historically.",
    fun_fact: "If you invested $10,000 in the S&P 500 in 1993 when SPY launched, it would be worth over $200,000 today.",
  },
  {
    symbol: "QQQ",
    name: "NASDAQ 100 ETF",
    short: "QQQ",
    icon: "💻",
    color: "text-blue-400",
    tracks: "NASDAQ-100 Index",
    companies: 100,
    price_range: "$330 — $500",
    description: "QQQ tracks the NASDAQ-100 — the 100 largest non-financial companies on the NASDAQ exchange. It is heavily weighted towards technology (60%+), making it the go-to ETF for tech investors. QQQ moves more than SPY in both directions — higher upside in bull markets, deeper drops in bear markets.",
    top_holdings: ["Microsoft (MSFT) 9%", "Apple (AAPL) 9%", "NVIDIA (NVDA) 8%", "Amazon (AMZN) 5%", "Meta (META) 5%"],
    sectors: ["Technology 60%+", "Consumer Discretionary 18%", "Healthcare 6%", "Industrials 5%", "Other 11%"],
    key_drivers: ["Big Tech earnings (FAANG)", "Interest rates (high rates hurt tech)", "AI & innovation news", "Federal Reserve policy", "Risk appetite"],
    trading_tip: "QQQ and interest rates have an inverse relationship. When Fed raises rates, QQQ drops (high-growth tech valuations fall). When rates fall, QQQ surges. The best QQQ buying opportunities came during rate hike peaks.",
    fun_fact: "QQQ gained over 100% during COVID recovery (2020-2021) then lost 33% in 2022. Volatility is its nature.",
  },
  {
    symbol: "DIA",
    name: "Dow Jones ETF",
    short: "DIA",
    icon: "🏭",
    color: "text-violet-400",
    tracks: "Dow Jones Industrial Average",
    companies: 30,
    price_range: "$330 — $450",
    description: "DIA tracks the Dow Jones Industrial Average (DJIA) — the oldest and most famous US stock index, created in 1896. It contains only 30 large 'blue chip' US companies. Unlike SPY/QQQ, the Dow is price-weighted (higher-priced stocks have more influence). It is seen as a measure of the overall US economy's health.",
    top_holdings: ["UnitedHealth (UNH) 10%", "Goldman Sachs (GS) 7%", "Microsoft (MSFT) 6%", "Home Depot (HD) 6%", "McDonald's (MCD) 5%"],
    sectors: ["Industrials 21%", "Technology 19%", "Healthcare 18%", "Financials 16%", "Consumer 13%"],
    key_drivers: ["Major US corporate earnings", "Industrial production data", "Consumer spending", "Interest rates", "Trade policy"],
    trading_tip: "The Dow is less volatile than QQQ. It represents 'old economy' companies — banks, industrials, healthcare. It tends to outperform in rising interest rate environments when tech stocks struggle.",
    fun_fact: "The Dow Jones was created in 1896 with just 12 industrial companies. General Electric was the only original member still in the index until it was removed in 2018.",
  },
];

export default function IndicesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <nav className="border-b border-slate-800 bg-slate-900 sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">AI</div>
            <span className="font-semibold">Trading Copilot</span>
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
            <Link href="/markets" className="hover:text-slate-100 transition">Markets</Link>
            <Link href="/learn" className="hover:text-slate-100 transition">Learn</Link>
            <Link href="/news" className="hover:text-slate-100 transition">News</Link>
            <Link href="/about" className="hover:text-slate-100 transition">About</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/register" className="hidden md:block rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">Get started</Link>
            <MobileNav links={NAV_LINKS} showAuth={true} />
          </div>
        </div>
      </nav>

      <section className="border-b border-emerald-500/20 bg-emerald-500/5 px-4 sm:px-6 py-8 sm:py-14 text-center">
        <span className="text-5xl">🏦</span>
        <h1 className="mt-4 text-4xl font-bold text-emerald-400 sm:text-5xl">Market Indices</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          S&P 500, NASDAQ, and Dow Jones — track the entire US stock market
          with a single instrument. The foundation of long-term investing.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
          {[["3", "Index ETFs"], ["630+", "Companies covered"], ["9:30-16:00", "EST hours"], ["Low", "Volatility"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-xl font-bold text-emerald-400">{v}</p>
              <p className="text-slate-400">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-12 space-y-8">
        {INDICES.map((idx) => (
          <div key={idx.symbol} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{idx.icon}</span>
                <div>
                  <h2 className={`text-2xl font-bold ${idx.color}`}>{idx.name}</h2>
                  <p className="text-sm text-slate-400">{idx.tracks} · {idx.companies} companies</p>
                </div>
              </div>
              <Link href="/register" className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">Trade →</Link>
            </div>

            <p className="mt-4 leading-relaxed text-slate-300">{idx.description}</p>

            <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3">
              {[["Symbol", idx.symbol], ["Price Range (1Y)", idx.price_range], ["Companies", String(idx.companies)]].map(([l, v]) => (
                <div key={l} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs text-slate-500">{l}</p>
                  <p className="mt-1 text-sm font-medium text-slate-200">{v}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs font-semibold text-slate-400">Top Holdings</p>
                <ul className="mt-2 space-y-1">
                  {idx.top_holdings.map((h) => <li key={h} className="text-xs text-slate-300">• {h}</li>)}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs font-semibold text-slate-400">Sector Breakdown</p>
                <ul className="mt-2 space-y-1">
                  {idx.sectors.map((s) => <li key={s} className="text-xs text-slate-300">• {s}</li>)}
                </ul>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
              <p className="text-xs font-semibold text-blue-400">🤓 Fun Fact</p>
              <p className="mt-1 text-sm text-slate-300">{idx.fun_fact}</p>
            </div>
            <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <p className="text-xs font-semibold text-amber-400">💡 Trading Tip</p>
              <p className="mt-1 text-sm text-slate-300">{idx.trading_tip}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="border-t border-slate-800 px-4 sm:px-6 py-8 sm:py-14 text-center">
        <h2 className="text-2xl font-bold">Trade Indices with AI Signals</h2>
        <p className="mt-3 text-slate-400">Get AI analysis for S&P 500, NASDAQ & Dow Jones. Free.</p>
        <Link href="/register" className="mt-6 inline-block rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">Start free →</Link>
      </section>
      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-600">
        <p>For educational purposes only · Not financial advice · <Link href="/markets" className="hover:text-slate-400">← Back to Markets</Link></p>
      </footer>
    </div>
  );
}
