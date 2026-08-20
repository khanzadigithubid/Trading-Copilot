"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

interface LivePrice {
  price: number;
  change_percent: number;
  source: string;
}

interface LiveSignal {
  signal: string;
  confidence: number;
  reasoning: string;
  risk_level: string;
  source: string;
}

export default function LiveSignalPreview() {
  const [price, setPrice] = useState<LivePrice | null>(null);
  const [signal, setSignal] = useState<LiveSignal | null>(null);
  const [loading, setLoading] = useState(true);
  const SYMBOL = "BTCUSDT";

  useEffect(() => {
    async function load() {
      try {
        // Fetch real BTC price
        const pRes = await fetch(`${API_URL}/assets/${SYMBOL}/price`, {
          signal: AbortSignal.timeout(10000),
        });
        if (pRes.ok) {
          const pData = await pRes.json();
          setPrice(pData);
        }

        // Fetch real AI signal (public endpoint)
        const sRes = await fetch(`${API_URL}/signals/${SYMBOL}`, {
          signal: AbortSignal.timeout(15000),
        });
        if (sRes.ok) {
          const sData = await sRes.json();
          setSignal(sData);
        }
      } catch {
        // fallback shown below
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const isUp = (price?.change_percent ?? 0) >= 0;
  const signalColor =
    signal?.signal === "BUY"
      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
      : signal?.signal === "SELL"
      ? "border-red-500/30 bg-red-500/15 text-red-400"
      : "border-slate-600 bg-slate-800 text-slate-300";

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-3">
            Live preview
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            See a real AI signal — right now
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            This is live data fetched in real-time. Not a demo. Not hardcoded.
          </p>
          {/* Live indicator */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live from KuCoin + OpenRouter AI
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Live Price + Signal */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-emerald-500/30 transition">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
                  Live AI Signal
                </p>
                <p className="text-xl font-bold">BTCUSDT</p>
                {price && (
                  <p className="text-sm font-mono text-slate-300 mt-0.5">
                    ${price.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    <span className={`ml-2 text-xs ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                      {isUp ? "+" : ""}{(price.change_percent ?? 0).toFixed(2)}%
                    </span>
                  </p>
                )}
              </div>
              {loading ? (
                <div className="h-9 w-16 animate-pulse rounded-xl bg-slate-800" />
              ) : signal ? (
                <span className={`rounded-xl border px-4 py-1.5 text-sm font-black ${signalColor}`}>
                  {signal.signal}
                </span>
              ) : (
                <span className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-1.5 text-sm font-black text-slate-400">
                  HOLD
                </span>
              )}
            </div>

            {loading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 rounded bg-slate-800 w-full" />
                <div className="h-3 rounded bg-slate-800 w-3/4" />
              </div>
            ) : signal ? (
              <>
                <div className="flex gap-6 text-sm mb-4">
                  <div>
                    <p className="text-slate-600 text-xs mb-0.5">Confidence</p>
                    <p className="font-bold text-slate-200">{signal.confidence.toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-xs mb-0.5">Risk</p>
                    <p className={`font-bold capitalize ${
                      signal.risk_level === "high" ? "text-red-400" :
                      signal.risk_level === "medium" ? "text-amber-400" : "text-emerald-400"
                    }`}>{signal.risk_level}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-xs mb-0.5">Source</p>
                    <p className="font-bold text-slate-200 capitalize">{signal.source}</p>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 mb-4">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                    style={{ width: `${signal.confidence}%` }}
                  />
                </div>
                <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-4">
                  <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wide font-semibold">
                    AI Reasoning
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300">
                    &ldquo;{signal.reasoning}&rdquo;
                  </p>
                </div>
              </>
            ) : (
              <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-4">
                <p className="text-xs text-slate-500">
                  Signal loading... Server may be waking up (free tier).
                </p>
              </div>
            )}
          </div>

          {/* What makes it unique */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-violet-500/30 transition flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Why this is different
              </p>
              <h3 className="text-xl font-bold mb-4">
                Other apps say <span className="text-red-400">BUY</span>.<br />
                We say <span className="text-emerald-400">BUY — and here&apos;s why.</span>
              </h3>
              <div className="space-y-3">
                {[
                  { icon: "🤖", text: "AI explains every signal in plain English" },
                  { icon: "📚", text: "Auto trade coaching after every position" },
                  { icon: "🕐", text: "1D + 1W + 1M timeframes combined" },
                  { icon: "🌍", text: "27 real markets — all live prices" },
                  { icon: "💰", text: "Bloomberg charges $24k/year. This is free." },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-base">
                      {item.icon}
                    </div>
                    <p className="text-sm text-slate-300 leading-snug mt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 text-center">
                Signal above is fetched live from the same API your dashboard uses.
                {price && (
                  <span className="ml-1 text-emerald-600">
                    Source: {price.source}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
