"use client";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">AI</div>
            <span className="font-semibold">Trading Copilot</span>
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-100">← Home</Link>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-4 text-slate-400">Questions, feedback, or collaboration? We&apos;d love to hear from you.</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-400">Get In Touch</p>
              <h2 className="mt-2 text-2xl font-bold">We&apos;re here to help</h2>
              <p className="mt-3 text-slate-400 leading-relaxed">
                Whether you have a bug report, feature request, trading question, or just want
                to say hello — reach out. We typically respond within 24 hours.
              </p>
            </div>

            {[
              { icon: "📧", label: "General Enquiries", value: "hello@trading-copilot.app", href: "mailto:hello@trading-copilot.app" },
              { icon: "🐛", label: "Bug Reports", value: "GitHub Issues", href: "https://github.com/khanzadigithubid/Trading-Copilot/issues" },
              { icon: "💼", label: "LinkedIn", value: "Khanzadi Wazir Ali", href: "https://linkedin.com" },
              { icon: "💻", label: "GitHub", value: "khanzadigithubid", href: "https://github.com/khanzadigithubid" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-emerald-500/30 hover:bg-slate-900"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-sm font-medium text-emerald-400">{item.value}</p>
                </div>
              </a>
            ))}

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs text-slate-500">Live App</p>
              <a href="https://kw-trading-copilot.vercel.app" target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium text-emerald-400 hover:underline">
                https://kw-trading-copilot.vercel.app
              </a>
            </div>
          </div>

          {/* Message form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-10">
                <span className="text-5xl">✅</span>
                <h3 className="mt-4 text-xl font-bold">Message sent!</h3>
                <p className="mt-2 text-slate-400">We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-sm text-emerald-400 hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold">Send a message</h3>
                <form
                  className="mt-5 space-y-4"
                  onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                >
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Your name"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Email</label>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Subject</label>
                    <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-500">
                      <option>General question</option>
                      <option>Bug report</option>
                      <option>Feature request</option>
                      <option>Collaboration</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us what's on your mind..."
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
                  >
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { q: "Is this platform really free?", a: "Yes — 100% free. No credit card, no hidden fees. We use free tiers of Vercel, Render, Neon, and OpenRouter." },
              { q: "Is this real trading?", a: "No. All trading is paper trading (virtual money). No real funds are involved. It is purely educational." },
              { q: "How accurate are the AI signals?", a: "Signals are based on technical indicators and AI analysis. They are educational tools, not guaranteed profitable advice. Always do your own research." },
              { q: "Can I use this on mobile?", a: "Yes! The app is a PWA — you can install it on your phone home screen from the browser. Works on iOS and Android." },
              { q: "What AI model is used?", a: "We use Google Gemma (free via OpenRouter) with Anthropic Claude as optional premium fallback. Falls back to rule-based signals if no AI key." },
              { q: "Is the code open source?", a: "Yes! Full source code is on GitHub under MIT license. You can fork it, learn from it, and build your own version." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="font-medium text-slate-100">{faq.q}</p>
                <p className="mt-2 text-sm text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-800 px-6 py-8 text-center text-xs text-slate-600">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-3">
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
