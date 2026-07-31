"use client";

import { useEffect, useRef, useState } from "react";
import { API_URL } from "@/lib/api";

interface Message {
  role: "bot" | "user";
  text: string;
  source?: string;
}

const SUGGESTIONS = [
  "What is Bitcoin price?",
  "Should I buy Gold?",
  "EUR/USD trend today?",
  "What is this platform?",
];

async function askPublicChat(query: string): Promise<{ response: string; source: string }> {
  const res = await fetch(`${API_URL}/public/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(90000),
  });
  if (!res.ok) throw new Error("Chat failed");
  return res.json();
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! 👋 I'm your AI trading assistant. Ask me anything — current prices, market trends, trading tips, or how this platform works!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [open, messages]);

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const data = await askPublicChat(msg);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.response, source: data.source },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Sorry, I couldn't get a response right now. The server might be waking up — please try again in 30 seconds! ☕",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          style={{ maxHeight: "75vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-emerald-500 px-4 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-emerald-400 font-bold text-xs">
                AI
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">AI Trading Assistant</p>
                <p className="text-xs text-slate-800">Live market data · Powered by AI 🟢</p>
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
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/60 min-h-0">
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
                  className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-emerald-500 text-slate-950"
                      : "border border-slate-700 bg-slate-900 text-slate-200"
                  }`}
                >
                  {msg.text}
                  {msg.source && msg.source !== "rules" && (
                    <p className="mt-1 text-xs opacity-50 uppercase">via {msg.source}</p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">
                  AI
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                    </span>
                    Fetching live data...
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-1.5 px-3 py-2 bg-slate-900/80 border-t border-slate-800 shrink-0">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  disabled={loading}
                  className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 border-t border-slate-800 bg-slate-900 p-3 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
              placeholder="Ask about any market..."
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
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
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
