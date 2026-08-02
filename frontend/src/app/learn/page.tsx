"use client";

import Link from "next/link";
import { useState } from "react";
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

const ARTICLES = [
  {
    id: "candlesticks",
    category: "Charts",
    icon: "🕯️",
    title: "How to Read Candlestick Charts",
    duration: "5 min read",
    level: "Beginner",
    summary: "Candlestick charts show price movement in a visual way. Each candle represents a time period.",
    content: [
      {
        heading: "What is a Candlestick?",
        text: "Each candlestick shows 4 prices for a time period: Open (where price started), High (highest point), Low (lowest point), Close (where price ended). A green/white candle means price went UP. A red/black candle means price went DOWN.",
      },
      {
        heading: "The Body and Wicks",
        text: "The thick part (body) shows the distance between Open and Close. The thin lines above/below (wicks or shadows) show the High and Low. A long upper wick means buyers tried to push price up but sellers pushed it back down. A long lower wick means sellers tried to push price down but buyers pushed it back up.",
      },
      {
        heading: "Important Candlestick Patterns",
        text: "Doji: Open and Close are almost the same — indecision in the market. Hammer: Small body at top, long lower wick — potential reversal from downtrend. Shooting Star: Small body at bottom, long upper wick — potential reversal from uptrend. Engulfing: One candle completely covers the previous — strong reversal signal.",
      },
      {
        heading: "How to Use Them",
        text: "Never use candlestick patterns alone. Combine them with indicators like RSI and MACD. A hammer at a support level with low RSI is a much stronger signal than a hammer alone. The AI Trading Copilot shows candlestick charts with AI signal markers directly on the chart.",
      },
    ],
  },
  {
    id: "rsi",
    category: "Indicators",
    icon: "📊",
    title: "RSI — Relative Strength Index Explained",
    duration: "6 min read",
    level: "Beginner",
    summary: "RSI measures if an asset is overbought (too expensive) or oversold (too cheap). Scale: 0 to 100.",
    content: [
      {
        heading: "What is RSI?",
        text: "RSI (Relative Strength Index) is a momentum indicator that measures the speed and magnitude of price changes. It was created by J. Welles Wilder in 1978. RSI moves between 0 and 100. The default period is 14 candles.",
      },
      {
        heading: "Overbought and Oversold",
        text: "RSI above 70 = Overbought. The asset may have risen too fast. A pullback (price drop) might be coming. RSI below 30 = Oversold. The asset may have fallen too fast. A bounce (price rise) might be coming. RSI between 30-70 = Neutral zone.",
      },
      {
        heading: "RSI Divergence",
        text: "This is the most powerful RSI signal. Bullish Divergence: Price makes a lower low, but RSI makes a higher low — momentum is weakening in the downtrend, reversal likely. Bearish Divergence: Price makes a higher high, but RSI makes a lower high — momentum is weakening in the uptrend, reversal likely.",
      },
      {
        heading: "RSI in This App",
        text: "Our AI uses RSI as one of its key inputs. When RSI is below 35 AND MACD shows bullish momentum, the AI tends to generate BUY signals. The signal card shows the exact RSI value with explanation. You can also see RSI on every backtest result.",
      },
    ],
  },
  {
    id: "macd",
    category: "Indicators",
    icon: "📈",
    title: "MACD — Moving Average Convergence Divergence",
    duration: "7 min read",
    level: "Intermediate",
    summary: "MACD shows the relationship between two moving averages. It identifies trend changes and momentum.",
    content: [
      {
        heading: "What is MACD?",
        text: "MACD consists of three components: MACD Line (12-period EMA minus 26-period EMA), Signal Line (9-period EMA of the MACD line), and Histogram (difference between MACD and Signal line). When MACD crosses above Signal — bullish. When MACD crosses below Signal — bearish.",
      },
      {
        heading: "MACD Crossover Signals",
        text: "Bullish Crossover: MACD line crosses ABOVE the signal line. This suggests upward momentum is building — potential BUY. Bearish Crossover: MACD line crosses BELOW the signal line. This suggests downward momentum — potential SELL. The further below zero the crossover happens, the stronger the signal.",
      },
      {
        heading: "MACD Histogram",
        text: "The histogram shows the distance between MACD and Signal lines. Growing histogram = momentum increasing. Shrinking histogram = momentum decreasing. When histogram shrinks toward zero, a crossover may be coming. Watch for histogram divergence from price — powerful early warning signal.",
      },
      {
        heading: "MACD + RSI Combination",
        text: "This is what our AI uses: RSI below 35 (oversold) AND MACD crossing above signal line = strong BUY signal. RSI above 65 (overbought) AND MACD crossing below signal line = strong SELL signal. Using both together reduces false signals significantly.",
      },
    ],
  },
  {
    id: "support-resistance",
    category: "Price Action",
    icon: "🔲",
    title: "Support and Resistance Levels",
    duration: "6 min read",
    level: "Beginner",
    summary: "Support is a price floor where buyers are strong. Resistance is a price ceiling where sellers are strong.",
    content: [
      {
        heading: "What is Support?",
        text: "Support is a price level where buying interest is strong enough to prevent the price from falling further. Think of it as a floor. When price falls to support, buyers step in and push price back up. The more times price bounces from a support level, the stronger it becomes.",
      },
      {
        heading: "What is Resistance?",
        text: "Resistance is a price level where selling interest is strong enough to prevent price from rising further. Think of it as a ceiling. When price rises to resistance, sellers step in and push price back down. Old resistance, once broken, often becomes new support (role reversal).",
      },
      {
        heading: "How to Identify Levels",
        text: "Look for price levels where price reversed multiple times in the past. Round numbers (BTC at $60,000, $70,000) often act as psychological support/resistance. Previous all-time highs and lows are strong levels. Volume at a price level makes it stronger.",
      },
      {
        heading: "Trading Strategy",
        text: "Buy near support, sell near resistance. Place stop loss below support (for longs). Buy breakouts above resistance with volume confirmation. In this app, the candlestick chart clearly shows historical price levels. Combine with RSI — buying at support with low RSI is a high-probability setup.",
      },
    ],
  },
  {
    id: "risk-management",
    category: "Risk",
    icon: "🛡️",
    title: "Risk Management — The Most Important Skill",
    duration: "8 min read",
    level: "Beginner",
    summary: "Most traders fail not because of bad signals — but because of bad risk management. This is the most important lesson.",
    content: [
      {
        heading: "The 2% Rule",
        text: "Never risk more than 2% of your trading capital on a single trade. If you have $10,000, maximum risk per trade = $200. This means even if you lose 10 trades in a row, you still have 82% of your capital. Without this rule, a losing streak can wipe out your entire account.",
      },
      {
        heading: "Position Sizing Formula",
        text: "Position Size = (Account Size × Risk %) ÷ (Entry Price - Stop Loss). Example: $10,000 account, 2% risk, Entry at $100, Stop Loss at $95 → Position Size = ($10,000 × 0.02) ÷ ($100 - $95) = $200 ÷ $5 = 40 shares. Our Risk Manager does this calculation automatically.",
      },
      {
        heading: "Stop Loss — Your Safety Net",
        text: "A stop loss is a predetermined price at which you exit a losing trade. Never trade without a stop loss. Place it at a logical level — below support (for longs) or above resistance (for shorts). Not too tight (random noise will trigger it) and not too wide (too much loss). Accept the stop loss as the cost of being wrong.",
      },
      {
        heading: "Risk/Reward Ratio",
        text: "Always aim for at least 1:2 risk/reward. If you risk $100, you should target $200 profit. With 1:2 ratio, you only need to be right 40% of the time to be profitable. With 1:3 ratio, you only need 30% win rate. Our AI shows confidence % to help gauge whether a trade is worth taking.",
      },
    ],
  },
  {
    id: "moving-averages",
    category: "Indicators",
    icon: "〰️",
    title: "Moving Averages — MA50 and MA200",
    duration: "5 min read",
    level: "Beginner",
    summary: "Moving averages smooth price data to identify trends. MA50 and MA200 are the most watched levels globally.",
    content: [
      {
        heading: "What is a Moving Average?",
        text: "A moving average calculates the average price over a specific number of periods. MA50 = average of last 50 candles. MA200 = average of last 200 candles. MA50 reacts faster to price changes. MA200 is slower — shows long-term trend. Price above MA = uptrend. Price below MA = downtrend.",
      },
      {
        heading: "Golden Cross and Death Cross",
        text: "Golden Cross: MA50 crosses ABOVE MA200 — very bullish signal. Major institutions use this as a buy signal. Death Cross: MA50 crosses BELOW MA200 — very bearish signal. These happen rarely but are considered major market signals. Bitcoin's Golden Cross in 2020 preceded a 10x rally.",
      },
      {
        heading: "MA as Dynamic Support/Resistance",
        text: "In a strong uptrend, MA50 often acts as support. Price pulls back to MA50 then bounces up. This is a buy opportunity in trending markets. In downtrends, MA50 acts as resistance — price rallies to MA50 then falls. Our AI checks if price is above or below both MA50 and MA200.",
      },
      {
        heading: "In This App",
        text: "Every AI signal card shows MA50 and MA200 values. Price above MA50 and MA200 = bullish bias. Price below both = bearish bias. The AI explains in plain English whether MAs support or contradict the signal.",
      },
    ],
  },
  {
    id: "bollinger-bands",
    category: "Indicators",
    icon: "📉",
    title: "Bollinger Bands — Volatility Indicator",
    duration: "6 min read",
    level: "Intermediate",
    summary: "Bollinger Bands show price volatility. Price touching the outer bands often signals a reversal or breakout.",
    content: [
      {
        heading: "What are Bollinger Bands?",
        text: "Bollinger Bands consist of 3 lines: Middle Band (20-period SMA), Upper Band (Middle + 2 standard deviations), Lower Band (Middle - 2 standard deviations). When bands are wide — high volatility. When bands are narrow (squeeze) — low volatility, breakout coming soon.",
      },
      {
        heading: "Trading the Bands",
        text: "Price touching lower band = potential buy (mean reversion). Price touching upper band = potential sell. But in strong trends, price can walk along the upper or lower band. The Bollinger Squeeze — when bands narrow to a tight range — often precedes explosive moves. Watch for the breakout direction.",
      },
      {
        heading: "Mean Reversion Strategy",
        text: "Most of the time (about 68%), price stays within the bands. When price goes outside the bands and comes back inside, it tends to revert to the middle band. This is the basis of our Mean Reversion backtest strategy: buy when price goes below lower band, exit when it returns to middle.",
      },
      {
        heading: "Bollinger Bands Backtest",
        text: "Our backtest engine includes a Bollinger Bands strategy. You can test it on any of the 27 assets across 1W, 1M, or 1Y timeframes. The results show exactly how this strategy performed historically — win rate, total return, maximum drawdown.",
      },
    ],
  },
  {
    id: "paper-trading",
    category: "Getting Started",
    icon: "📝",
    title: "Paper Trading — Practice Without Risk",
    duration: "4 min read",
    level: "Beginner",
    summary: "Paper trading lets you practice with virtual money. No real risk, real learning. The best way to start.",
    content: [
      {
        heading: "What is Paper Trading?",
        text: "Paper trading (also called simulated trading or virtual trading) means practicing with fake money. You get all the features of real trading — live prices, charts, signals — but no real money is involved. It is the safest way to learn how trading works before risking real capital.",
      },
      {
        heading: "Why Paper Trade First?",
        text: "Most beginner traders lose money in their first 6-12 months. Paper trading lets you experience wins and losses without real financial impact. You can test strategies, understand your psychology (greed, fear), and build confidence. Professional traders often paper trade new strategies before going live.",
      },
      {
        heading: "How to Use Paper Trading in This App",
        text: "1. Select any asset from the market prices table. 2. Check the AI signal for direction. 3. Use the Risk Manager to calculate position size. 4. Open a paper trade (BUY or SELL). 5. Watch it live with real market prices. 6. Close when your target or stop loss is hit. 7. Review in the AI Trade Journal.",
      },
      {
        heading: "When to Go Live",
        text: "Go live only when: You are consistently profitable in paper trading for 3+ months. You have a defined strategy with clear entry/exit rules. You fully understand position sizing and risk management. You can accept losses without emotional decisions. Start with very small real amounts ($100-$500) even then.",
      },
    ],
  },
];

const CATEGORIES = ["All", "Beginner", "Intermediate", "Charts", "Indicators", "Price Action", "Risk", "Getting Started"];

export default function LearnPage() {
  const [active, setActive] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = active === "All"
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === active || a.level === active);

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
            <Link href="/markets" className="hover:text-slate-100">Markets</Link>
            <Link href="/learn" className="hover:text-slate-100">Learn</Link>
            <Link href="/news" className="hover:text-slate-100">News</Link>
            <Link href="/about" className="hover:text-slate-100">About</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/register" className="hidden md:block rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400">Get started</Link>
            <MobileNav links={NAV_LINKS} showAuth={true} />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-slate-800 bg-slate-900/30 px-4 sm:px-4 sm:px-4 sm:px-6 py-6 sm:py-8 sm:py-10 sm:py-14 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Education</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Learn to Trade</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Free trading education — from complete beginner to advanced strategies.
          No jargon. No fluff. Just clear, practical knowledge.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
          {[["8", "Articles"], ["Free", "Always"], ["Beginner", "Friendly"], ["5 min", "Avg read"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-xl font-bold text-emerald-400">{v}</p>
              <p className="text-slate-400">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                active === cat ? "bg-emerald-500 text-slate-950" : "border border-slate-700 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="mx-auto max-w-5xl px-4 sm:px-4 sm:px-6 py-6 sm:py-8 space-y-4">
        {filtered.map((article) => (
          <div key={article.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            {/* Header */}
            <button
              onClick={() => setOpenId(openId === article.id ? null : article.id)}
              className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 hover:bg-slate-900/80 transition"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">{article.icon}</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      article.level === "Beginner" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                    }`}>
                      {article.level}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{article.category}</span>
                    <span className="text-xs text-slate-500">{article.duration}</span>
                  </div>
                  <h2 className="mt-1.5 text-lg font-semibold text-slate-100">{article.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{article.summary}</p>
                </div>
              </div>
              <span className="text-slate-500 shrink-0 text-lg">{openId === article.id ? "▲" : "▼"}</span>
            </button>

            {/* Content */}
            {openId === article.id && (
              <div className="border-t border-slate-800 px-6 py-6 space-y-5">
                {article.content.map((section) => (
                  <div key={section.heading}>
                    <h3 className="font-semibold text-emerald-400">{section.heading}</h3>
                    <p className="mt-2 leading-relaxed text-slate-300">{section.text}</p>
                  </div>
                ))}
                <div className="border-t border-slate-800 pt-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
                  >
                    Practice this in the app →
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className="border-t border-slate-800 px-4 sm:px-4 sm:px-4 sm:px-6 py-6 sm:py-8 sm:py-10 sm:py-14 text-center">
        <h2 className="text-2xl font-bold">Ready to apply what you learned?</h2>
        <p className="mt-3 text-slate-400">Use AI signals + paper trading to practice — zero risk.</p>
        <Link href="/register" className="mt-6 inline-block rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
          Start paper trading free →
        </Link>
      </section>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-600">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
          <Link href="/" className="hover:text-slate-400">Home</Link>
          <Link href="/markets" className="hover:text-slate-400">Markets</Link>
          <Link href="/about" className="hover:text-slate-400">About</Link>
          <Link href="/contact" className="hover:text-slate-400">Contact</Link>
        </div>
        <p>For educational purposes only · Not financial advice</p>
      </footer>
    </div>
  );
}
