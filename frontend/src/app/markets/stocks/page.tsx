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

const STOCKS = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    icon: "🍎",
    color: "text-slate-100",
    sector: "Technology",
    founded: "1976",
    ceo: "Tim Cook",
    market_cap: "$3 Trillion",
    price_range: "$165 — $240",
    description: "Apple is the world's most valuable company. It makes the iPhone, Mac, iPad, Apple Watch, and services like App Store, iCloud, and Apple Pay. Over 2.2 billion Apple devices are in active use worldwide. Services (App Store, subscriptions) are now Apple's fastest-growing and highest-margin business.",
    revenue_breakdown: ["iPhone 52%", "Services 22%", "Mac 9%", "iPad 7%", "Wearables 10%"],
    key_drivers: ["iPhone sales cycles", "Services growth (App Store)", "China market (20% revenue)", "New product launches", "Fed interest rates"],
    trading_tip: "Apple reports earnings 4 times per year. The stock often drops BEFORE earnings (buy the rumor, sell the news). Strong iPhone upgrade cycles in Sep-Nov. Services growth is the key long-term metric to watch.",
    fun_fact: "Apple made more money in 2023 ($97 billion profit) than most countries' entire GDP.",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    icon: "🪟",
    color: "text-blue-400",
    sector: "Technology",
    founded: "1975",
    ceo: "Satya Nadella",
    market_cap: "$3.1 Trillion",
    price_range: "$360 — $470",
    description: "Microsoft dominates enterprise software (Windows, Office), cloud computing (Azure — #2 behind AWS), and gaming (Xbox, Activision). Under CEO Satya Nadella, Microsoft transformed into a cloud-first company. Its $10 billion investment in OpenAI (ChatGPT) positioned it as the leader in enterprise AI.",
    revenue_breakdown: ["Intelligent Cloud (Azure) 43%", "Productivity (Office) 32%", "Personal Computing 25%"],
    key_drivers: ["Azure cloud growth rate", "AI/Copilot adoption", "Office 365 subscriptions", "Gaming (Xbox + Activision)", "Enterprise IT spending"],
    trading_tip: "Microsoft's Azure growth rate is the single most watched metric. When Azure growth beats estimates, MSFT surges. AI monetization through Copilot is the next major growth driver.",
    fun_fact: "Microsoft Teams went from 32 million to 270 million daily users during COVID — the fastest enterprise software growth ever.",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    icon: "⚡",
    color: "text-red-400",
    sector: "Electric Vehicles",
    founded: "2003",
    ceo: "Elon Musk",
    market_cap: "$700 Billion",
    price_range: "$140 — $280",
    description: "Tesla is the world's leading electric vehicle company and has the most advanced battery technology. Beyond cars, Tesla operates the world's largest EV charging network (Supercharger), sells solar panels and Powerwall batteries. Its Full Self-Driving (FSD) software and robotaxi ambitions could transform the company into an AI/robotics firm.",
    revenue_breakdown: ["Automotive 85%", "Energy Storage 10%", "Services 5%"],
    key_drivers: ["EV delivery numbers (quarterly)", "FSD progress & regulations", "Elon Musk news/tweets", "Competition (BYD, GM, Ford)", "Battery cost reductions"],
    trading_tip: "Tesla is the most volatile major stock. Elon Musk's tweets and actions (Twitter/X purchase) can move the stock 10%+ in a day. Delivery numbers beat/miss is the biggest quarterly catalyst.",
    fun_fact: "Tesla Model 3 is the first electric car to sell over 1 million units. Tesla's battery factory (Gigafactory) in Nevada is one of the largest buildings on Earth.",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet (Google)",
    icon: "🔍",
    color: "text-blue-300",
    sector: "Technology",
    founded: "1998",
    ceo: "Sundar Pichai",
    market_cap: "$2.1 Trillion",
    price_range: "$130 — $195",
    description: "Alphabet is Google's parent company. Google handles 8.5 billion searches daily — controlling 91% of the global search market. Advertising is 80% of revenue. Google Cloud is the #3 cloud provider. YouTube has 2+ billion monthly users. DeepMind (Alphabet's AI lab) created AlphaFold — solving protein folding after 50 years.",
    revenue_breakdown: ["Google Search Ads 57%", "YouTube Ads 10%", "Google Cloud 11%", "Other (Maps, Play) 22%"],
    key_drivers: ["Digital advertising market", "Google Cloud growth", "AI integration (Gemini)", "Antitrust/regulatory risk", "YouTube growth"],
    trading_tip: "Google's ad revenue correlates with global economic health. Recession fears hurt ad spending. Google Cloud is the key growth metric. AI competition from Microsoft/ChatGPT is the biggest long-term risk to watch.",
    fun_fact: "Google processes 8.5 billion searches per day. The word 'Google' is now a verb in the dictionary.",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    icon: "📦",
    color: "text-amber-400",
    sector: "E-commerce / Cloud",
    founded: "1994",
    ceo: "Andy Jassy",
    market_cap: "$1.9 Trillion",
    price_range: "$150 — $220",
    description: "Amazon started as an online bookstore and became the world's largest e-commerce company. But today, Amazon Web Services (AWS) — the cloud computing division — generates most of the company's profits despite being only 17% of revenue. AWS powers Netflix, Airbnb, NASA, and millions of other companies.",
    revenue_breakdown: ["E-commerce North America 40%", "E-commerce International 23%", "AWS Cloud 17%", "Advertising 8%", "Prime/Other 12%"],
    key_drivers: ["AWS growth rate", "E-commerce gross margins", "Advertising revenue growth", "AI/Bedrock adoption", "Retail competition"],
    trading_tip: "AWS is the profit engine — watch its growth rate and operating margins. Amazon's retail business barely breaks even. Advertising is a hidden gem growing 20%+ annually.",
    fun_fact: "Amazon Prime has 200 million paid members worldwide. Jeff Bezos started Amazon in his garage in Bellevue, Washington.",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    icon: "🎮",
    color: "text-green-400",
    sector: "Semiconductors / AI",
    founded: "1993",
    ceo: "Jensen Huang",
    market_cap: "$3.1 Trillion",
    price_range: "$400 — $1,350",
    description: "NVIDIA makes the GPUs (graphics processing units) that power AI. Every major AI company — OpenAI, Google, Microsoft, Meta — runs their AI training on NVIDIA H100 chips. NVIDIA went from gaming GPU company to the most critical company in the AI revolution. Revenue grew 200%+ in 2024 driven by AI chip demand.",
    revenue_breakdown: ["Data Center (AI chips) 78%", "Gaming 17%", "Professional Visualization 3%", "Automotive 2%"],
    key_drivers: ["AI/Data Center chip demand", "H100/H200/Blackwell GPU supply", "Competition (AMD, Intel, custom chips)", "Export restrictions (China)", "Hyperscaler capex (AWS, Azure, Google Cloud)"],
    trading_tip: "NVDA is the 'picks and shovels' of the AI gold rush. When AI spending increases, NVDA benefits directly. Watch hyperscaler (AWS, Azure, GCP) capex guidance — it predicts NVDA chip orders.",
    fun_fact: "NVIDIA stock rose 2,400% in 5 years (2019-2024). Jensen Huang, the CEO, is known for always wearing a leather jacket.",
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    icon: "👥",
    color: "text-blue-500",
    sector: "Social Media / AI",
    founded: "2004",
    ceo: "Mark Zuckerberg",
    market_cap: "$1.3 Trillion",
    price_range: "$280 — $580",
    description: "Meta owns Facebook, Instagram, WhatsApp, and Threads — connecting over 3 billion people daily. After a disastrous 2022 (stock dropped 65% on Metaverse overspending), Meta's 'Year of Efficiency' in 2023 cut costs and refocused on AI. Meta's AI-powered ad targeting is among the best in the industry, driving massive revenue recovery.",
    revenue_breakdown: ["Advertising 98%", "Reality Labs (VR/AR) 2%"],
    key_drivers: ["Digital advertising market", "Instagram/Reels growth", "AI-powered ad targeting", "WhatsApp monetization", "Regulatory/antitrust risk"],
    trading_tip: "Meta's stock is extremely sensitive to ad revenue. Any slowdown in advertising spending hits META hard. The 2022 drop (-65%) and 2023 recovery (+194%) show how volatile it can be around management credibility.",
    fun_fact: "WhatsApp was acquired by Facebook in 2014 for $19 billion when it had only 55 employees. It now has 2.5 billion users.",
  },
];

export default function StocksPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
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

      <section className="border-b border-violet-500/20 bg-violet-500/5 px-6 py-14 text-center">
        <span className="text-5xl">📈</span>
        <h1 className="mt-4 text-4xl font-bold text-violet-400 sm:text-5xl">US Stocks</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          The world&apos;s most powerful companies. Apple, NVIDIA, Microsoft, Tesla —
          trade the stocks that are shaping the future of technology and AI.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
          {[["7", "Stocks"], ["$14T+", "Combined market cap"], ["9:30-16:00", "NYSE/NASDAQ hours"], ["High", "AI exposure"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-xl font-bold text-violet-400">{v}</p>
              <p className="text-slate-400">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">
        {STOCKS.map((stock) => (
          <div key={stock.symbol} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{stock.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-2xl font-bold ${stock.color}`}>{stock.symbol}</h2>
                    <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-400">{stock.sector}</span>
                  </div>
                  <p className="text-sm text-slate-400">{stock.name} · CEO: {stock.ceo} · Founded {stock.founded}</p>
                </div>
              </div>
              <Link href="/register" className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400">Trade →</Link>
            </div>

            <p className="mt-4 leading-relaxed text-slate-300">{stock.description}</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[["Market Cap", stock.market_cap], ["Price Range (1Y)", stock.price_range], ["Founded", stock.founded]].map(([l, v]) => (
                <div key={l} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-xs text-slate-500">{l}</p>
                  <p className="mt-1 text-sm font-medium text-slate-200">{v}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs font-semibold text-slate-400">Revenue Breakdown</p>
                <ul className="mt-2 space-y-1">
                  {stock.revenue_breakdown.map((r) => <li key={r} className="text-xs text-slate-300">• {r}</li>)}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className="text-xs font-semibold text-slate-400">Key Price Drivers</p>
                <ul className="mt-2 space-y-1">
                  {stock.key_drivers.map((d) => <li key={d} className="text-xs text-slate-300">• {d}</li>)}
                </ul>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
              <p className="text-xs font-semibold text-blue-400">🤓 Fun Fact</p>
              <p className="mt-1 text-sm text-slate-300">{stock.fun_fact}</p>
            </div>
            <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <p className="text-xs font-semibold text-amber-400">💡 Trading Tip</p>
              <p className="mt-1 text-sm text-slate-300">{stock.trading_tip}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="border-t border-slate-800 px-6 py-14 text-center">
        <h2 className="text-2xl font-bold">Get AI signals for all 7 stocks</h2>
        <p className="mt-3 text-slate-400">BUY/SELL/HOLD with plain-English reasoning. Free.</p>
        <Link href="/register" className="mt-6 inline-block rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">Start free →</Link>
      </section>
      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-600">
        <p>For educational purposes only · Not financial advice · <Link href="/markets" className="hover:text-slate-400">← Back to Markets</Link></p>
      </footer>
    </div>
  );
}
