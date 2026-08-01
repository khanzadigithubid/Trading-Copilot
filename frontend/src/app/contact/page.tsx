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

const FAQ = [
  { q: "Is this platform really free?", a: "Yes — 100% free. No credit card, no hidden fees." },
  { q: "Is this real trading?", a: "No. All trading is paper trading (virtual money). Educational only." },
  { q: "How accurate are AI signals?", a: "Signals are educational tools, not guaranteed advice. Always do your own research." },
  { q: "Can I use this on mobile?", a: "Yes! PWA — install on phone home screen from browser. Works offline too." },
  { q: "What AI model is used?", a: "Google Gemma (free via OpenRouter) with Anthropic Claude as optional fallback." },
  { q: "Is the code open source?", a: "Yes! Full source on GitHub under MIT license." },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const subject = (form.elements.namedItem("subject") as HTMLSelectElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        setSent(true);
      } else {
        alert("Failed to send. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">

      {/* Nav */}
      <nav className="border-b border-slate-800 bg-slate-900 sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">AI</div>
            <span className="font-semibold text-sm sm:text-base">Trading Copilot</span>
          </Link>
          <div className="hidden sm:flex items-center gap-4 text-sm text-slate-400">
            <Link href="/markets" className="hover:text-slate-100">Markets</Link>
            <Link href="/learn" className="hover:text-slate-100">Learn</Link>
            <Link href="/about" className="hover:text-slate-100">About</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/register" className="hidden sm:block rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400">Get started</Link>
            <MobileNav links={NAV_LINKS} showAuth={true} />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold">Contact Us</h1>
          <p className="mt-3 text-slate-400">Questions, feedback, or collaboration? We&apos;d love to hear from you.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2">Get In Touch</p>
              <h2 className="text-xl font-bold">We&apos;re here to help</h2>
              <p className="mt-2 text-slate-400 text-sm leading-relaxed">
                Whether you have a bug report, feature request, or just want to say hello — reach out. We typically respond within 24 hours.
              </p>
            </div>

            {[
              { icon: "📧", label: "General Enquiries", value: "hello@trading-copilot.app", href: "mailto:hello@trading-copilot.app" },
              { icon: "🐛", label: "Bug Reports", value: "GitHub Issues", href: "https://github.com/khanzadigithubid/Trading-Copilot/issues" },
              { icon: "💻", label: "GitHub", value: "khanzadigithubid", href: "https://github.com/khanzadigithubid" },
              { icon: "🌐", label: "Live App", value: "kw-trading-copilot.vercel.app", href: "https://kw-trading-copilot.vercel.app" },
            ].map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-emerald-500/30 hover:bg-slate-900">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-sm font-medium text-emerald-400">{item.value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <span className="text-5xl">✅</span>
                <h3 className="mt-4 text-xl font-bold">Message sent!</h3>
                <p className="mt-2 text-slate-400 text-sm">We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-sm text-emerald-400 hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-5">Send a message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Name</label>
                    <input required type="text" name="name" placeholder="Your name"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Email</label>
                    <input required type="email" name="email" placeholder="you@example.com"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Subject</label>
                    <select name="subject"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-500">
                      <option>General question</option>
                      <option>Bug report</option>
                      <option>Feature request</option>
                      <option>Collaboration</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Message</label>
                    <textarea required name="message" rows={4} placeholder="Tell us what&apos;s on your mind..."
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-500 resize-none" />
                  </div>
                  <button type="submit" disabled={sending}
                    className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60 transition">
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FAQ.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="font-medium text-slate-100 text-sm">{faq.q}</p>
                <p className="mt-2 text-sm text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-800 px-4 sm:px-6 py-6 text-center text-xs text-slate-600">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
          <Link href="/" className="hover:text-slate-400">Home</Link>
          <Link href="/about" className="hover:text-slate-400">About</Link>
          <Link href="/privacy" className="hover:text-slate-400">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-400">Terms</Link>
        </div>
        <p>© {new Date().getFullYear()} AI Trading Copilot · For educational purposes only</p>
      </footer>
    </div>
  );
}
