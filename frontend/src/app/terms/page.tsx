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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="border-b border-slate-800 bg-slate-900 sticky top-0 z-40">
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

      <div className="mx-auto max-w-3xl px-4 sm:px-4 sm:px-4 sm:px-4 sm:px-6 py-6 sm:py-8 sm:py-12 sm:py-16">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-10 space-y-8 text-slate-300">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
            <p className="font-semibold text-amber-400">⚠️ Important</p>
            <p className="mt-2 text-sm leading-relaxed">
              AI Trading Copilot is an educational platform only. We do not provide financial advice.
              All trading signals, analysis, and content are for learning purposes.
              Never invest money you cannot afford to lose. Past performance does not guarantee future results.
            </p>
          </div>

          {[
            {
              title: "1. Acceptance of Terms",
              content: "By creating an account and using AI Trading Copilot, you agree to these terms. If you do not agree, please do not use the service. We may update these terms at any time — continued use means acceptance.",
            },
            {
              title: "2. Educational Purpose Only",
              content: "This platform is strictly for educational purposes. All AI signals, market analysis, backtest results, and community content are informational only. Nothing on this platform constitutes financial, investment, or trading advice. You should consult a qualified financial advisor before making any investment decisions.",
            },
            {
              title: "3. Paper Trading — No Real Money",
              content: "All trading on this platform is paper trading — using virtual money only. No real funds are deposited, managed, or traded. We are not a broker, exchange, or financial institution. We do not hold or process real money in any form.",
            },
            {
              title: "4. Account Responsibility",
              content: "You are responsible for maintaining the security of your account. Do not share your password. You are responsible for all activity under your account. We may suspend accounts that violate these terms or abuse the platform.",
            },
            {
              title: "5. AI Signals Disclaimer",
              content: "AI signals are generated automatically based on technical indicators and AI analysis. They are not guaranteed to be accurate or profitable. Market conditions change rapidly. Always verify signals with your own research. The AI can be wrong — past signal accuracy does not predict future accuracy.",
            },
            {
              title: "6. Community Content",
              content: "You are responsible for content you post in Community Signals. Do not post false, misleading, or harmful content. Do not pump or manipulate assets. We reserve the right to remove content and ban accounts that violate community standards.",
            },
            {
              title: "7. Limitation of Liability",
              content: "AI Trading Copilot is provided 'as is' without warranties. We are not liable for any financial losses, trading losses, or damages arising from use of this platform. The maximum liability is limited to the amount you paid us (which is $0 on the free tier).",
            },
            {
              title: "8. Intellectual Property",
              content: "The platform code is open source (MIT License) on GitHub. The AI Trading Copilot brand, logo, and name are our property. You may not use our branding without permission.",
            },
            {
              title: "9. Termination",
              content: "You may delete your account at any time. We may terminate accounts that violate these terms. Upon termination, your data will be deleted within 30 days.",
            },
            {
              title: "10. Contact",
              content: "Questions about these terms? Contact us at: legal@trading-copilot.app",
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-slate-100">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      </div>

      <footer className="border-t border-slate-800 px-4 sm:px-6 py-6 sm:py-8 text-center text-xs text-slate-600">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-3">
          <Link href="/" className="hover:text-slate-400">Home</Link>
          <Link href="/privacy" className="hover:text-slate-400">Privacy</Link>
          <Link href="/contact" className="hover:text-slate-400">Contact</Link>
        </div>
        <p>© {new Date().getFullYear()} AI Trading Copilot</p>
      </footer>
    </div>
  );
}
