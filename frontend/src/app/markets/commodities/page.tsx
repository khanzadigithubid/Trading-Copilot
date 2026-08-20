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

const COMMODITIES = [
  {
    symbol: "XAUUSD",
    name: "Gold",
    short: "XAU/USD",
    icon: "🥇",
    color: "text-yellow-400",
    price_range: "$1,800 — $2,450",
    daily_volume: "$180 Billion",
    description:
      "Gold is the world's oldest store of value — used as money for over 5,000 years. Today it is the ultimate safe-haven asset. When stock markets crash, economies weaken, or inflation rises, investors rush to buy gold. Central banks hold gold as part of their reserves. The US Dollar and gold have an inverse relationship — when USD weakens, gold rises.",
    history: "Gold was used as currency since 600 BC. The gold standard (where currencies were backed by gold) was abandoned in 1971 by President Nixon. Since then, gold has been a free-floating commodity.",
    use_cases: ["Investment & wealth preservation", "Inflation hedge", "Safe haven during crises", "Central bank reserves", "Jewelry & industrial use"],
    key_drivers: ["US Dollar strength (inverse)", "Interest rates (Fed)", "Inflation (CPI data)", "Geopolitical tensions", "Central bank buying"],
    fun_fact: "All the gold ever mined would fit in about 3.5 Olympic swimming pools.",
    trading_tip: "Gold rises when real interest rates (rates minus inflation) are negative or falling. Watch the US 10-year Treasury yield — when it falls, gold typically rises. Gold is the best hedge during banking crises.",
  },
  {
    symbol: "XAGUSD",
    name: "Silver",
    short: "XAG/USD",
    icon: "🥈",
    color: "text-slate-300",
    price_range: "$18 — $35",
    daily_volume: "$15 Billion",
    description:
      "Silver is both a precious metal and an industrial commodity. Unlike gold which is mostly an investment, 50% of silver demand comes from industry — solar panels, electronics, medical equipment, and electric vehicles all use silver. This dual nature makes silver more volatile than gold but gives it additional fundamental support from growing green energy demand.",
    history: "Silver has been used as currency for thousands of years. Ancient Rome used silver coins (denarius). The historic gold-to-silver ratio was 15:1 — today it is often 70-90:1, suggesting silver may be undervalued relative to gold.",
    use_cases: ["Investment & speculation", "Solar panels (highest silver conductor)", "Electronics & semiconductors", "Medical devices", "Photography"],
    key_drivers: ["Gold price direction", "Industrial demand (EV, solar)", "US Dollar", "Mining production", "Gold/silver ratio"],
    fun_fact: "Silver is the best electrical and thermal conductor of all metals. Every smartphone contains about 0.3 grams of silver.",
    trading_tip: "Silver is called 'poor man's gold' — it follows gold's direction but moves more aggressively. Gold-to-silver ratio above 80 historically signals silver is cheap relative to gold.",
  },
  {
    symbol: "USOIL",
    name: "Crude Oil (WTI)",
    short: "WTI Crude",
    icon: "🛢️",
    color: "text-orange-400",
    price_range: "$65 — $130",
    daily_volume: "$900 Billion",
    description:
      "WTI (West Texas Intermediate) Crude Oil is the benchmark for US oil prices and one of the most traded commodities in the world. Oil powers the global economy — transportation, manufacturing, heating, and petrochemicals all depend on it. Oil prices affect inflation in every country, which is why central banks closely monitor oil.",
    history: "Modern oil industry started in Pennsylvania in 1859. OPEC (Organization of Petroleum Exporting Countries) was formed in 1960 to control supply. The 1973 oil crisis showed how powerful oil is as a geopolitical weapon.",
    use_cases: ["Fuel (cars, planes, ships)", "Electricity generation", "Plastics & chemicals", "Heating", "Asphalt & lubricants"],
    key_drivers: ["OPEC+ production decisions", "US Strategic Petroleum Reserve", "Global demand (China, US)", "Geopolitical conflicts", "USD strength", "EV adoption (long-term negative)"],
    fun_fact: "One barrel of oil (42 gallons) can produce 19.4 gallons of gasoline, 10 gallons of diesel, and many other products.",
    trading_tip: "OPEC meetings (usually held twice yearly) are the biggest oil market events. Middle East conflicts cause immediate price spikes. US weekly inventory report (EIA, every Wednesday) causes short-term volatility.",
  },
];

export default function CommoditiesPage() {
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

      <section className="border-b border-yellow-500/20 bg-yellow-500/5 px-4 sm:px-6 py-8 sm:py-14 text-center">
        <span className="text-5xl">🪙</span>
        <h1 className="mt-4 text-4xl font-bold text-yellow-400 sm:text-5xl">Commodities</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Gold, Silver, and Oil — the world&apos;s most important physical assets.
          Trade commodities that have shaped human civilization for thousands of years.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="text-center"><p className="text-xl font-bold text-yellow-400">3</p><p className="text-slate-400">Commodities</p></div>
          <div className="text-center"><p className="text-xl font-bold text-yellow-400">5,000+</p><p className="text-slate-400">Years of gold trading</p></div>
          <div className="text-center"><p className="text-xl font-bold text-yellow-400">Near 24/7</p><p className="text-slate-400">Market hours</p></div>
          <div className="text-center"><p className="text-xl font-bold text-yellow-400">Inflation</p><p className="text-slate-400">Best hedge</p></div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-12 space-y-8">
        {COMMODITIES.map((c) => (
          <div key={c.symbol} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{c.icon}</span>
                <div>
                  <h2 className={`text-2xl font-bold ${c.color}`}>{c.name}</h2>
                  <p className="text-sm text-slate-400">{c.short}</p>
                </div>
              </div>
              <Link href="/register" className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">Trade →</Link>
            </div>

            <p className="mt-4 leading-relaxed text-slate-300">{c.description}</p>

            <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3">
              {[["Price Range (1Y)", c.price_range], ["Daily Volume", c.daily_volume], ["Symbol", c.symbol]].map(([l, v]) => (
                <div key={l} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs text-slate-500">{l}</p>
                  <p className="mt-1 text-sm font-medium text-slate-200">{v}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <p className="text-xs font-semibold text-slate-400">📜 History</p>
              <p className="mt-1 text-sm text-slate-300">{c.history}</p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs font-semibold text-slate-400">Real-World Uses</p>
                <ul className="mt-2 space-y-1">
                  {c.use_cases.map((u) => <li key={u} className="text-xs text-slate-300">• {u}</li>)}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs font-semibold text-slate-400">Key Price Drivers</p>
                <ul className="mt-2 space-y-1">
                  {c.key_drivers.map((d) => <li key={d} className="text-xs text-slate-300">• {d}</li>)}
                </ul>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
              <p className="text-xs font-semibold text-blue-400">🤓 Fun Fact</p>
              <p className="mt-1 text-sm text-slate-300">{c.fun_fact}</p>
            </div>

            <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <p className="text-xs font-semibold text-amber-400">💡 Trading Tip</p>
              <p className="mt-1 text-sm text-slate-300">{c.trading_tip}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="border-t border-slate-800 px-4 sm:px-6 py-8 sm:py-14 text-center">
        <h2 className="text-2xl font-bold">Trade Gold, Silver & Oil with AI</h2>
        <p className="mt-3 text-slate-400">Live prices + AI signals for all commodities. Free.</p>
        <Link href="/register" className="mt-6 inline-block rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">Start free →</Link>
      </section>
      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-600">
        <p>For educational purposes only · Not financial advice · <Link href="/markets" className="hover:text-slate-400">← Back to Markets</Link></p>
      </footer>
    </div>
  );
}
