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

const COINS = [
  {
    symbol: "BTCUSDT",
    name: "Bitcoin",
    short: "BTC",
    icon: "₿",
    color: "text-amber-400",
    price_range: "$20,000 — $73,000",
    market_cap: "$1.3 Trillion",
    launched: "2009",
    founder: "Satoshi Nakamoto",
    description:
      "Bitcoin is the world's first and largest cryptocurrency. Created in 2009 by an anonymous person known as Satoshi Nakamoto, it introduced blockchain technology — a decentralized, transparent public ledger. Bitcoin is often called 'digital gold' because it has a fixed supply of 21 million coins, making it scarce like gold.",
    use_case: "Store of value, digital payments, inflation hedge",
    technology: "Proof of Work (SHA-256), 10 min block time",
    supply: "21 million (fixed)",
    pros: ["Most trusted & liquid", "Largest market cap", "Institutional adoption", "Fixed supply = scarcity"],
    cons: ["High energy consumption", "Slow transactions (7 TPS)", "High fees during congestion"],
    trading_tip: "Bitcoin often leads the entire crypto market. When BTC moves up, most altcoins follow. RSI below 35 on weekly chart has historically been a strong buy signal.",
  },
  {
    symbol: "ETHUSDT",
    name: "Ethereum",
    short: "ETH",
    icon: "Ξ",
    color: "text-blue-400",
    price_range: "$1,000 — $4,800",
    market_cap: "$400 Billion",
    launched: "2015",
    founder: "Vitalik Buterin",
    description:
      "Ethereum is the world's programmable blockchain. Unlike Bitcoin, Ethereum allows developers to build applications (dApps) and smart contracts on top of it. It is the foundation of DeFi (Decentralized Finance), NFTs, and most blockchain projects. In 2022, Ethereum switched from Proof of Work to Proof of Stake, reducing energy use by 99.9%.",
    use_case: "Smart contracts, DeFi, NFTs, Web3 applications",
    technology: "Proof of Stake, 12 sec block time, EVM compatible",
    supply: "No fixed cap (~120M circulating)",
    pros: ["Largest developer ecosystem", "Smart contracts", "DeFi foundation", "Proof of Stake (eco-friendly)"],
    cons: ["Gas fees can be high", "Competition from faster chains", "Complex for beginners"],
    trading_tip: "ETH/BTC ratio (ETH dominance) tells you whether Ethereum is outperforming Bitcoin. ETH often lags BTC in bull markets then catches up fast.",
  },
  {
    symbol: "SOLUSDT",
    name: "Solana",
    short: "SOL",
    icon: "◎",
    color: "text-violet-400",
    price_range: "$10 — $260",
    market_cap: "$80 Billion",
    launched: "2020",
    founder: "Anatoly Yakovenko",
    description:
      "Solana is one of the fastest blockchains in crypto, capable of processing 65,000 transactions per second (vs Bitcoin's 7 TPS). It achieves this with a unique 'Proof of History' mechanism. Solana is known for near-zero fees and is popular for NFTs, DeFi, and mobile crypto applications.",
    use_case: "High-speed DeFi, NFTs, gaming, mobile payments",
    technology: "Proof of History + Proof of Stake, 65,000 TPS",
    supply: "~580M circulating (inflationary)",
    pros: ["Extremely fast", "Very low fees", "Strong ecosystem", "Growing developer base"],
    cons: ["Network outages history", "More centralized than ETH/BTC", "Younger ecosystem"],
    trading_tip: "SOL is a high-beta asset — it moves more than BTC/ETH in both directions. In bull markets it can 10x but in bear markets it drops harder.",
  },
  {
    symbol: "BNBUSDT",
    name: "BNB",
    short: "BNB",
    icon: "🔶",
    color: "text-yellow-400",
    price_range: "$150 — $780",
    market_cap: "$90 Billion",
    launched: "2017",
    founder: "Changpeng Zhao (CZ)",
    description:
      "BNB is the native token of Binance — the world's largest cryptocurrency exchange. Originally launched to pay trading fees at a discount on Binance, BNB has grown into a full blockchain ecosystem (BNB Chain). It powers thousands of DeFi projects and has regular token burns that reduce supply over time.",
    use_case: "Binance trading fees, BNB Chain DeFi, payments",
    technology: "BNB Chain (PoSA), fast & cheap transactions",
    supply: "~145M (deflationary via burns)",
    pros: ["Binance backing = stability", "Regular supply burns", "Cheap transactions", "Large DeFi ecosystem"],
    cons: ["Centralized (controlled by Binance)", "Regulatory risk", "Dependent on Binance health"],
    trading_tip: "BNB often stays strong during crypto downturns because Binance supports it. Good during bear market for relative safety among large caps.",
  },
  {
    symbol: "XRPUSDT",
    name: "XRP",
    short: "XRP",
    icon: "✕",
    color: "text-sky-400",
    price_range: "$0.20 — $3.80",
    market_cap: "$55 Billion",
    launched: "2012",
    founder: "Ripple Labs (Chris Larsen, Jed McCaleb)",
    description:
      "XRP is designed for fast, cheap international money transfers. Ripple Labs built it to compete with the SWIFT banking system. XRP transactions settle in 3-5 seconds and cost fractions of a cent. Over 300 financial institutions worldwide use Ripple technology. XRP won a major legal battle against the SEC in 2023.",
    use_case: "Cross-border payments, bank transfers, remittances",
    technology: "XRP Ledger (XRPL), 1,500 TPS, 3-5 sec settlement",
    supply: "100 billion total (55B circulating)",
    pros: ["Extremely fast & cheap", "Bank partnerships", "Won SEC lawsuit", "Established since 2012"],
    cons: ["Centralized (Ripple holds 60B XRP)", "Dependent on bank adoption", "Less DeFi ecosystem"],
    trading_tip: "XRP is news-driven. Legal victories and new bank partnership announcements cause sharp price spikes. Watch regulatory news closely.",
  },
  {
    symbol: "ADAUSDT",
    name: "Cardano",
    short: "ADA",
    icon: "₳",
    color: "text-blue-300",
    price_range: "$0.20 — $3.10",
    market_cap: "$15 Billion",
    launched: "2017",
    founder: "Charles Hoskinson (co-founder of Ethereum)",
    description:
      "Cardano is a blockchain built on peer-reviewed academic research. Every upgrade goes through rigorous scientific review before implementation. It is known for its methodical, slow-but-steady approach. Cardano uses Ouroboros — the first provably secure Proof of Stake protocol.",
    use_case: "Smart contracts, identity verification, DeFi, Africa focus",
    technology: "Ouroboros PoS, Haskell programming language",
    supply: "45 billion (capped)",
    pros: ["Peer-reviewed research", "Energy efficient", "Strong community", "Growing DeFi ecosystem"],
    cons: ["Slow development pace", "Less dApps than Ethereum", "Smaller ecosystem"],
    trading_tip: "ADA tends to be range-bound for long periods then breaks out sharply. Accumulation at support during bear markets has been a profitable long-term strategy.",
  },
  {
    symbol: "DOGEUSDT",
    name: "Dogecoin",
    short: "DOGE",
    icon: "🐕",
    color: "text-amber-300",
    price_range: "$0.05 — $0.74",
    market_cap: "$25 Billion",
    launched: "2013",
    founder: "Billy Markus & Jackson Palmer",
    description:
      "Dogecoin started as a joke cryptocurrency based on the Shiba Inu 'Doge' meme in 2013. However, it gained massive popularity through Elon Musk's tweets and Reddit communities. It has unlimited supply and fast transactions. Despite its meme origins, it is now accepted by major companies including Tesla merchandise.",
    use_case: "Tipping, small payments, community donations, speculation",
    technology: "Proof of Work (Scrypt), 1 min block time, unlimited supply",
    supply: "Unlimited (10 billion new DOGE per year)",
    pros: ["Large community", "Elon Musk support", "Fast & cheap transactions", "Fun culture"],
    cons: ["No supply cap (inflation)", "Highly speculative", "No major tech developments", "Meme-driven price"],
    trading_tip: "DOGE is purely sentiment and social media driven. Elon Musk tweets move the price more than any technical indicator. Very high risk.",
  },
];

export default function CryptoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Nav */}
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
      <section className="border-b border-amber-500/20 bg-amber-500/5 px-6 py-14 text-center">
        <span className="text-5xl">₿</span>
        <h1 className="mt-4 text-4xl font-bold text-amber-400 sm:text-5xl">Cryptocurrency</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Digital currencies powered by blockchain technology. 24/7 global trading, 
          decentralized, and highly liquid. The future of money.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="text-center"><p className="text-xl font-bold text-amber-400">7</p><p className="text-slate-400">Coins covered</p></div>
          <div className="text-center"><p className="text-xl font-bold text-amber-400">24/7</p><p className="text-slate-400">Market hours</p></div>
          <div className="text-center"><p className="text-xl font-bold text-amber-400">$2T+</p><p className="text-slate-400">Total market cap</p></div>
          <div className="text-center"><p className="text-xl font-bold text-amber-400">High</p><p className="text-slate-400">Volatility</p></div>
        </div>
      </section>

      {/* Coins */}
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">
        {COINS.map((coin) => (
          <div key={coin.symbol} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-2xl font-bold">
                  {coin.icon}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${coin.color}`}>{coin.name}</h2>
                  <p className="text-sm text-slate-400">{coin.short} · Launched {coin.launched}</p>
                </div>
              </div>
              <Link
                href={`/dashboard?tab=chart`}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
              >
                Trade {coin.short} →
              </Link>
            </div>

            {/* Description */}
            <p className="mt-4 leading-relaxed text-slate-300">{coin.description}</p>

            {/* Stats grid */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Founder", coin.founder],
                ["Price Range (1Y)", coin.price_range],
                ["Market Cap", coin.market_cap],
                ["Supply", coin.supply],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-200">{value}</p>
                </div>
              ))}
            </div>

            {/* Use case + tech */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs font-semibold text-slate-400">Use Case</p>
                <p className="mt-1 text-sm text-slate-300">{coin.use_case}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs font-semibold text-slate-400">Technology</p>
                <p className="mt-1 text-sm text-slate-300">{coin.technology}</p>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <p className="text-xs font-semibold text-emerald-400">✓ Advantages</p>
                <ul className="mt-2 space-y-1">
                  {coin.pros.map((p) => (
                    <li key={p} className="text-xs text-slate-300">• {p}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                <p className="text-xs font-semibold text-red-400">✗ Risks</p>
                <ul className="mt-2 space-y-1">
                  {coin.cons.map((c) => (
                    <li key={c} className="text-xs text-slate-300">• {c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Trading tip */}
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <p className="text-xs font-semibold text-amber-400">💡 AI Trading Tip</p>
              <p className="mt-1 text-sm text-slate-300">{coin.trading_tip}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className="border-t border-slate-800 px-6 py-14 text-center">
        <h2 className="text-2xl font-bold">Get AI signals for all crypto assets</h2>
        <p className="mt-3 text-slate-400">BUY/SELL/HOLD with plain-English reasoning. Free.</p>
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
