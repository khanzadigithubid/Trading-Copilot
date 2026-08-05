"use client";

import { FormEvent, useRef, useState } from "react";

import { sendChatQuery } from "@/lib/chat";
import type { ChatMessage } from "@/types/chat";

const SUGGESTIONS = [
  "What is the EUR/USD trend?",
  "How risky is Bitcoin this week?",
  "Should I buy AAPL based on current signals?",
];

interface ChatPanelProps {
  accessToken?: string;
  selectedSymbol?: string | null;
}

export default function ChatPanel({ accessToken, selectedSymbol }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Ask me about any asset — trends, risk, signals, or market outlook. I'll use live data from your dashboard.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setLoading(true);

    try {
      const result = await sendChatQuery(query, selectedSymbol, accessToken);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.response, source: result.source },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }

  return (
    <section className="flex min-h-[400px] h-[520px] max-h-[70vh] flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold">Market Chat</h2>
        <p className="mt-1 text-sm text-slate-400">
          Natural language Q&A powered by live market data
          {selectedSymbol ? ` · context: ${selectedSymbol}` : ""}.
        </p>
      </div>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-emerald-500 text-slate-950"
                  : "border border-slate-800 bg-slate-950/60 text-slate-200"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.source && (
                <p className="mt-2 text-xs uppercase opacity-60">via {message.source}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                </span>
                AI is analyzing market data...
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setInput(suggestion)}
            className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400 hover:bg-slate-800"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about any market..."
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
}
