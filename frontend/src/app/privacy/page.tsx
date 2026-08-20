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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
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

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-14">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-10 space-y-8 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-slate-100">1. What We Collect</h2>
            <p className="mt-3 leading-relaxed">
              We collect only the information needed to provide the service:
            </p>
            <ul className="mt-3 space-y-2">
              {[
                "Email address — for account creation and login",
                "Password — stored as a secure hash (we never see your actual password)",
                "Paper trades — the virtual trades you open and close in the app",
                "Price alerts — the alerts you set for specific assets",
                "Community signals — posts you share publicly",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm"><span className="mt-1 text-emerald-400 shrink-0">•</span>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-100">2. What We Do NOT Collect</h2>
            <ul className="mt-3 space-y-2">
              {[
                "Real money or payment information — there are no real trades",
                "Phone number or physical address",
                "Government ID or identity documents",
                "Bank or brokerage account details",
                "Location data",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm"><span className="mt-1 text-red-400 shrink-0">✗</span>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-100">3. How We Use Your Data</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                "To authenticate you and keep your account secure",
                "To show you your own trading history and performance",
                "To generate personalized AI signals and portfolio analytics",
                "To display your community posts to other users (only what you share)",
              ].map((item) => <li key={item} className="flex items-start gap-2"><span className="mt-1 text-emerald-400 shrink-0">→</span>{item}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-100">4. Third-Party Services</h2>
            <p className="mt-3 text-sm leading-relaxed">We use these third-party services to power the platform:</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { name: "Neon (PostgreSQL)", desc: "Stores your account data and trades" },
                { name: "OpenRouter / Anthropic", desc: "Powers AI signals and market chat" },
                { name: "Binance / TwelveData", desc: "Provides live market prices" },
                { name: "Vercel / Render", desc: "Hosts the application" },
              ].map((s) => (
                <div key={s.name} className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-sm">
                  <p className="font-medium text-slate-200">{s.name}</p>
                  <p className="text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-100">5. Data Security</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Passwords are hashed using bcrypt — we cannot see your password.
              All API communication is encrypted via HTTPS/TLS.
              JWT tokens expire after 24 hours.
              We do not sell or share your personal data with advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-100">6. Your Rights</h2>
            <p className="mt-3 text-sm leading-relaxed">You have the right to:</p>
            <ul className="mt-3 space-y-1 text-sm">
              {["Request deletion of your account and all associated data", "Export your trading history", "Update your email or password at any time"].map((r) => (
                <li key={r} className="flex items-start gap-2"><span className="mt-1 text-emerald-400">→</span>{r}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm">To exercise these rights, contact us at: <a href="mailto:privacy@trading-copilot.app" className="text-emerald-400 hover:underline">privacy@trading-copilot.app</a></p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-100">7. Cookies</h2>
            <p className="mt-3 text-sm leading-relaxed">
              We use only essential session cookies required for authentication (NextAuth.js).
              We do not use advertising, tracking, or analytics cookies.
            </p>
          </section>
        </div>
      </div>

      <footer className="border-t border-slate-800 px-4 sm:px-4 sm:px-6 py-6 sm:py-8 text-center text-xs text-slate-600">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-3">
          <Link href="/" className="hover:text-slate-400">Home</Link>
          <Link href="/terms" className="hover:text-slate-400">Terms</Link>
          <Link href="/contact" className="hover:text-slate-400">Contact</Link>
        </div>
        <p>© {new Date().getFullYear()} AI Trading Copilot</p>
      </footer>
    </div>
  );
}
