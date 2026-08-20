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

const PAIRS = [
  {
    symbol: "EURUSD",
    name: "Euro / US Dollar",
    short: "EUR/USD",
    icon: "€",
    color: "text-blue-400",
    category: "Major",
    daily_volume: "$1.5 Trillion",
    spread: "0.1 — 1.2 pips",
    description:
      "EUR/USD is the most traded currency pair in the world, representing over 20% of all forex transactions. It measures how many US Dollars you need to buy 1 Euro. The pair is heavily influenced by ECB (European Central Bank) and Federal Reserve monetary policy decisions.",
    base_country: "Eurozone (19 countries)",
    quote_country: "United States",
    best_time: "London + New York overlap (13:00-17:00 GMT)",
    key_drivers: ["ECB interest rate decisions", "US Federal Reserve policy", "Eurozone GDP data", "US Non-Farm Payrolls", "Inflation data (CPI)"],
    trading_tip: "EUR/USD is the most liquid pair — tight spreads and predictable movements. Best traded during London/NY overlap. ECB Thursday meetings and US Friday NFP are the biggest weekly events.",
  },
  {
    symbol: "GBPUSD",
    name: "British Pound / US Dollar",
    short: "GBP/USD",
    icon: "£",
    color: "text-emerald-400",
    category: "Major",
    daily_volume: "$700 Billion",
    spread: "0.5 — 2.0 pips",
    description:
      "GBP/USD (also called 'Cable') is one of the oldest currency pairs. The British Pound is one of the world's oldest currencies still in use. The pair reflects the economic relationship between the UK and USA. Brexit significantly impacted this pair from 2016 onwards, creating major volatility.",
    base_country: "United Kingdom",
    quote_country: "United States",
    best_time: "London session (08:00-17:00 GMT)",
    key_drivers: ["Bank of England decisions", "UK GDP and inflation data", "Brexit/UK political news", "US economic data"],
    trading_tip: "GBP/USD is more volatile than EUR/USD. UK political news (elections, budget announcements) can cause sharp moves. Wider spreads during news events.",
  },
  {
    symbol: "USDJPY",
    name: "US Dollar / Japanese Yen",
    short: "USD/JPY",
    icon: "¥",
    color: "text-red-400",
    category: "Major",
    daily_volume: "$900 Billion",
    spread: "0.1 — 1.0 pips",
    description:
      "USD/JPY is a 'safe haven' pair. When global markets are fearful, investors buy Japanese Yen, causing USD/JPY to drop. Japan has kept near-zero interest rates for decades, making the Yen popular for 'carry trades' — borrowing in Yen to invest in higher-yielding currencies.",
    base_country: "United States",
    quote_country: "Japan",
    best_time: "Tokyo session (00:00-09:00 GMT) and NY session",
    key_drivers: ["Bank of Japan (BOJ) policy", "US Fed decisions", "Global risk sentiment", "Japan trade data", "US-Japan interest rate differential"],
    trading_tip: "USD/JPY moves opposite to risk sentiment. Stock market crashes → USD/JPY falls. BOJ rarely changes policy, making Fed decisions the dominant driver.",
  },
  {
    symbol: "AUDUSD",
    name: "Australian Dollar / US Dollar",
    short: "AUD/USD",
    icon: "A$",
    color: "text-amber-400",
    category: "Major",
    daily_volume: "$350 Billion",
    spread: "0.5 — 2.0 pips",
    description:
      "AUD/USD (called 'Aussie') is a commodity currency — it moves with commodity prices, especially iron ore and coal (Australia's main exports). China is Australia's biggest trading partner, so Chinese economic data heavily impacts AUD.",
    base_country: "Australia",
    quote_country: "United States",
    best_time: "Sydney + Tokyo sessions (22:00-09:00 GMT)",
    key_drivers: ["Reserve Bank of Australia (RBA)", "China economic data", "Commodity prices (iron ore, gold)", "Risk appetite globally"],
    trading_tip: "AUD/USD correlates with commodity prices and Chinese growth. When China slows down, AUD weakens. Good proxy for global risk appetite.",
  },
  {
    symbol: "USDCAD",
    name: "US Dollar / Canadian Dollar",
    short: "USD/CAD",
    icon: "C$",
    color: "text-rose-400",
    category: "Major",
    daily_volume: "$300 Billion",
    spread: "0.5 — 2.0 pips",
    description:
      "USD/CAD (called 'Loonie') is directly linked to oil prices because Canada is a major oil exporter. When crude oil prices rise, Canadian Dollar strengthens and USD/CAD falls. The pair is also influenced by the close economic relationship between USA and Canada.",
    base_country: "United States",
    quote_country: "Canada",
    best_time: "New York session (13:00-22:00 GMT)",
    key_drivers: ["Oil prices (WTI Crude)", "Bank of Canada decisions", "US-Canada trade relations", "Canadian employment data"],
    trading_tip: "USD/CAD has an inverse relationship with oil. Oil up → USD/CAD down. Track WTI crude oil to predict CAD direction.",
  },
  {
    symbol: "USDCHF",
    name: "US Dollar / Swiss Franc",
    short: "USD/CHF",
    icon: "₣",
    color: "text-slate-300",
    category: "Major",
    daily_volume: "$250 Billion",
    spread: "0.5 — 2.0 pips",
    description:
      "USD/CHF involves the Swiss Franc — the world's ultimate safe haven currency. Switzerland's political neutrality, strong banking sector, and stable economy make CHF a refuge during global crises. When world markets panic, investors flee to CHF, causing USD/CHF to drop.",
    base_country: "United States",
    quote_country: "Switzerland",
    best_time: "London session (08:00-17:00 GMT)",
    key_drivers: ["Global risk events (crises, wars)", "Swiss National Bank (SNB)", "European stability", "Gold prices (CHF correlates with gold)"],
    trading_tip: "CHF is the ultimate crisis currency. When geopolitical tensions rise or markets crash, CHF strengthens sharply. SNB sometimes intervenes to weaken CHF.",
  },
  {
    symbol: "NZDUSD",
    name: "New Zealand Dollar / US Dollar",
    short: "NZD/USD",
    icon: "NZ$",
    color: "text-teal-400",
    category: "Minor",
    daily_volume: "$180 Billion",
    spread: "1.0 — 3.0 pips",
    description:
      "NZD/USD (called 'Kiwi') moves similarly to AUD/USD because Australia and New Zealand have close economic ties. New Zealand's main exports are dairy products and agriculture. The Reserve Bank of New Zealand (RBNZ) was one of the first central banks to raise rates after COVID.",
    base_country: "New Zealand",
    quote_country: "United States",
    best_time: "Sydney + Wellington sessions (21:00-08:00 GMT)",
    key_drivers: ["RBNZ interest rate decisions", "Dairy prices (NZ top export)", "China economic data", "Global risk sentiment"],
    trading_tip: "NZD/USD has lower liquidity than major pairs — spreads widen quickly. Best to trade during Asian or early London sessions.",
  },
];

export default function ForexPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Nav */}
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

      {/* Hero */}
      <section className="border-b border-blue-500/20 bg-blue-500/5 px-4 sm:px-6 py-8 sm:py-14 text-center">
        <span className="text-5xl">💱</span>
        <h1 className="mt-4 text-4xl font-bold text-blue-400 sm:text-5xl">Forex Market</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          The world&apos;s largest financial market with $7.5 trillion daily volume.
          Trade currency pairs 24 hours a day, 5 days a week.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="text-center"><p className="text-xl font-bold text-blue-400">$7.5T</p><p className="text-slate-400">Daily volume</p></div>
          <div className="text-center"><p className="text-xl font-bold text-blue-400">7</p><p className="text-slate-400">Currency pairs</p></div>
          <div className="text-center"><p className="text-xl font-bold text-blue-400">24/5</p><p className="text-slate-400">Market hours</p></div>
          <div className="text-center"><p className="text-xl font-bold text-blue-400">Low</p><p className="text-slate-400">Entry barrier</p></div>
        </div>
      </section>

      {/* What is Forex */}
      <div className="mx-auto max-w-5xl px-4 sm:px-4 sm:px-6 py-6 sm:py-8 sm:py-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-xl font-bold text-slate-100">What is Forex Trading?</h2>
          <p className="mt-3 leading-relaxed text-slate-300">
            Forex (Foreign Exchange) is the buying and selling of currencies. When you travel abroad and exchange money,
            you are participating in the forex market. Traders profit by predicting whether one currency will strengthen
            or weaken against another. For example, if you buy EUR/USD and the Euro strengthens, you profit.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Major Pairs", desc: "USD paired with EUR, GBP, JPY, AUD, CAD, CHF, NZD — most liquid" },
              { label: "Market Sessions", desc: "Tokyo → London → New York. Best liquidity during London/NY overlap" },
              { label: "Pips & Spreads", desc: "Profit measured in pips (0.0001). Spread is broker's fee — lower is better" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <p className="text-xs font-semibold text-blue-400">{item.label}</p>
                <p className="mt-1 text-xs text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Currency pairs */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 space-y-6">
        <h2 className="text-2xl font-bold">Currency Pairs Covered</h2>
        {PAIRS.map((pair) => (
          <div key={pair.symbol} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-xl font-bold text-blue-400">
                  {pair.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xl font-bold ${pair.color}`}>{pair.short}</h3>
                    <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-400">{pair.category}</span>
                  </div>
                  <p className="text-sm text-slate-400">{pair.name}</p>
                </div>
              </div>
              <Link href="/register" className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
                Trade →
              </Link>
            </div>

            <p className="mt-4 leading-relaxed text-slate-300">{pair.description}</p>

            <div className="mt-4 grid gap-3 grid-cols-2 lg:grid-cols-4">
              {[
                ["Daily Volume", pair.daily_volume],
                ["Typical Spread", pair.spread],
                ["Base Country", pair.base_country],
                ["Best Trading Time", pair.best_time],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 text-xs font-medium text-slate-200">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs font-semibold text-slate-400">Key Price Drivers</p>
                <ul className="mt-2 space-y-1">
                  {pair.key_drivers.map((d) => <li key={d} className="text-xs text-slate-300">• {d}</li>)}
                </ul>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                <p className="text-xs font-semibold text-amber-400">💡 Trading Tip</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{pair.trading_tip}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="border-t border-slate-800 px-4 sm:px-6 py-8 sm:py-14 text-center">
        <h2 className="text-2xl font-bold">Trade Forex with AI Signals</h2>
        <p className="mt-3 text-slate-400">Get BUY/SELL signals with reasoning for all 7 pairs. Free.</p>
        <Link href="/register" className="mt-6 inline-block rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
          Start free →
        </Link>
      </section>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-600">
        <p>For educational purposes only · Not financial advice · <Link href="/markets" className="hover:text-slate-400">← Back to Markets</Link></p>
      </footer>
    </div>
  );
}
