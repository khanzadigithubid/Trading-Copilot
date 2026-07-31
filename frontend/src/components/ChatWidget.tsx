"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "bot" | "user";
  text: string;
}

const BOT_RESPONSES: Record<string, string> = {
  default:
    "I'm the AI Trading Copilot assistant! I can help you understand the platform. Try asking: 'What is this?', 'How does it work?', 'Is it free?', or 'What markets are covered?'",
  hello:
    "Hey! 👋 Welcome to AI Trading Copilot — a free AI-powered trading platform. What would you like to know?",
  hi: "Hey! 👋 Welcome to AI Trading Copilot — a free AI-powered trading platform. What would you like to know?",
  what:
    "AI Trading Copilot is a free trading platform that covers 27 markets — Forex, Crypto, Stocks, Gold, Oil, and Indices. Unlike other apps, it doesn't just show BUY/SELL — it explains WHY in plain English. 🤖",
  free: "Yes — 100% free! No credit card, no subscription, no hidden fees. Register in 30 seconds and start using all features immediately. 🎉",
  how: "It's simple! 1️⃣ Register free at the link above. 2️⃣ Select any asset (Bitcoin, Gold, EUR/USD...). 3️⃣ Get an AI signal with full explanation. 4️⃣ Paper trade with real market prices. 5️⃣ Get AI coaching after every trade!",
  market:
    "We cover 27 markets:\n💱 Forex: EUR/USD, GBP/USD, USD/JPY + 4 more\n₿ Crypto: BTC, ETH, SOL, BNB + 3 more\n📈 Stocks: AAPL, NVDA, TSLA + 4 more\n🥇 Commodities: Gold, Silver, Oil\n🏦 Indices: S&P 500, NASDAQ, Dow Jones",
  signal:
    "Our AI signals are unique! Instead of just saying 'BUY', we explain: 'RSI at 34.2 suggests oversold conditions. MACD crossing bullish. Price action shows potential reversal.' Full plain-English reasoning every time. 🧠",
  ai: "We use OpenRouter AI (Google Gemma) for signal generation, market chat, and trade journal coaching. All AI-powered, all free!",
  chart:
    "Professional TradingView candlestick charts with volume, signal markers, and 4 timeframe tabs (1D/1W/1M/1Y). Same charts used by professional traders! 📈",
  journal:
    "After every trade you close, AI automatically writes a coaching review — what you did right, what to improve, and a rating (Excellent/Good/Poor). Like having a personal trading coach 24/7! 📚",
  safe: "All trading is paper trading — virtual money only. No real funds involved. It's 100% safe to practice! Your account data is secured with JWT authentication and encrypted passwords.",
  register:
    "Click 'Get started' at the top right! Takes 30 seconds — just email and password. No card needed. 🚀",
  contact:
    "You can reach us at: hello@trading-copilot.app or visit our contact page at /contact. We respond within 24 hours! 📧",
  mobile:
    "Yes! The app is a PWA — you can install it on your phone home screen directly from the browser. Works offline too! 📱",
  bloomberg:
    "Bloomberg Terminal charges $24,000/year for professional trading tools. We built the same quality — for free. That's our mission: democratize trading intelligence for everyone. 🌍",
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
    return BOT_RESPONSES.hello;
  if (lower.includes("free") || lower.includes("cost") || lower.includes("price") || lower.includes("paid"))
    return BOT_RESPONSES.free;
  if (lower.includes("what") || lower.includes("platform") || lower.includes("about"))
    return BOT_RESPONSES.what;
  if (lower.includes("how") || lower.includes("work") || lower.includes("start") || lower.includes("begin"))
    return BOT_RESPONSES.how;
  if (lower.includes("market") || lower.includes("asset") || lower.includes("forex") || lower.includes("crypto") || lower.includes("stock"))
    return BOT_RESPONSES.market;
  if (lower.includes("signal") || lower.includes("buy") || lower.includes("sell") || lower.includes("ai"))
    return BOT_RESPONSES.signal;
  if (lower.includes("chart") || lower.includes("candle") || lower.includes("graph"))
    return BOT_RESPONSES.chart;
  if (lower.includes("journal") || lower.includes("coach") || lower.includes("feedback") || lower.includes("review"))
    return BOT_RESPONSES.journal;
  if (lower.includes("safe") || lower.includes("real money") || lower.includes("risk") || lower.includes("secure"))
    return BOT_RESPONSES.safe;
  if (lower.includes("register") || lower.includes("signup") || lower.includes("sign up") || lower.includes("create account"))
    return BOT_RESPONSES.register;
  if (lower.includes("contact") || lower.includes("email") || lower.includes("support") || lower.includes("help"))
    return BOT_RESPONSES.contact;
  if (lower.includes("mobile") || lower.includes("phone") || lower.includes("app") || lower.includes("pwa"))
    return BOT_RESPONSES.mobile;
  if (lower.includes("bloomberg") || lower.includes("expensive") || lower.includes("compare"))
    return BOT_RESPONSES.bloomberg;
  return BOT_RESPONSES.default;
}

const SUGGESTIONS = [
  "What is this?",
  "Is it free?",
  "How does it work?",
  "What markets?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! 👋 I'm your AI Trading Copilot assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [open, messages]);

  function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setTyping(true);

    setTimeout(() => {
      const reply = getBotReply(msg);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      setTyping(false);
      if (!open) setUnread((u) => u + 1);
    }, 800);
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          style={{ maxHeight: "70vh" }}>
          {/* Header */}
          <div className="flex items-center justify-between bg-emerald-500 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-emerald-400 font-bold text-xs">
                AI
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">AI Copilot Assistant</p>
                <p className="text-xs text-slate-800">Always online 🟢</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-950 hover:text-slate-700 text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/60">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "bot" && (
                  <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-emerald-500 text-slate-950"
                      : "border border-slate-700 bg-slate-900 text-slate-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">
                  AI
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2.5">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-1.5 px-3 py-2 bg-slate-900/80 border-t border-slate-800">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 border-t border-slate-800 bg-slate-900 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-40 transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition hover:scale-110 active:scale-95"
        aria-label="Open chat"
      >
        {open ? (
          <span className="text-slate-950 text-xl font-bold">×</span>
        ) : (
          <span className="text-slate-950 text-2xl">💬</span>
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
