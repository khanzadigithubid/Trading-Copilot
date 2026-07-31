"use client";

import { useEffect, useRef, useState } from "react";
import { API_URL } from "@/lib/api";

interface Message {
  role: "bot" | "user";
  text: string;
  source?: string;
}

const SUGGESTIONS = [
  "Bitcoin price?",
  "Should I buy Gold?",
  "EUR/USD trend?",
  "What is this platform?",
];

const VOICE_LANGUAGES = [
  { code: "en-US", label: "EN" },
  { code: "ur-PK", label: "اردو" },
  { code: "hi-IN", label: "हिंदी" },
  { code: "ar-SA", label: "عربي" },
];

async function askPublicChat(query: string): Promise<{ response: string; source: string }> {
  const res = await fetch(`${API_URL}/public/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(90000),
  });
  if (!res.ok) throw new Error("Chat failed");
  return res.json() as Promise<{ response: string; source: string }>;
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
  utterance.rate = 1.0;
  utterance.lang = "en-US";
  const voices = window.speechSynthesis.getVoices();
  const eng = voices.find((v) => v.lang.startsWith("en"));
  if (eng) utterance.voice = eng;
  window.speechSynthesis.speak(utterance);
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! 👋 I'm your AI trading assistant. Ask me anything — current prices, trends, or how this platform works! Use 🎤 to talk to me.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceLang, setVoiceLang] = useState("en-US");
  const bottomRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      setVoiceSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
    }
  }, []);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [open, messages]);

  function startListening() {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = voiceLang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const t: string = e.results[0][0].transcript;
      setInput(t);
      setTimeout(() => handleSend(t), 300);
    };
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const data = await askPublicChat(msg);
      setMessages((prev) => [...prev, { role: "bot", text: data.response, source: data.source }]);
      if (voiceEnabled) speak(data.response);
    } catch {
      const err = "Sorry, server is waking up — try again in 30 seconds! ☕";
      setMessages((prev) => [...prev, { role: "bot", text: err }]);
      if (voiceEnabled) speak(err);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          style={{ maxHeight: "75vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-emerald-500 px-4 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-emerald-400 font-bold text-xs">AI</div>
              <div>
                <p className="text-sm font-semibold text-slate-950">AI Trading Assistant</p>
                <p className="text-xs text-slate-800">Live data · Voice enabled 🟢</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language selector */}
              {voiceSupported && (
                <select
                  value={voiceLang}
                  onChange={(e) => setVoiceLang(e.target.value)}
                  className="rounded-lg bg-slate-950/70 text-slate-950 text-xs px-1.5 py-1 border-0 font-semibold cursor-pointer"
                >
                  {VOICE_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              )}
              {voiceSupported && (
                <button
                  onClick={() => setVoiceEnabled((p) => !p)}
                  title={voiceEnabled ? "Disable voice" : "Enable voice responses"}
                  className={`rounded-full p-1.5 text-sm transition ${voiceEnabled ? "bg-slate-950 text-emerald-400" : "bg-slate-950/50 text-slate-600"}`}
                >
                  🔊
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-slate-950 hover:text-slate-700 text-xl leading-none">×</button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/60 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "bot" && (
                  <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">AI</div>
                )}
                <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user" ? "bg-emerald-500 text-slate-950" : "border border-slate-700 bg-slate-900 text-slate-200"
                }`}>
                  {msg.text}
                  {msg.source && msg.source !== "rules" && (
                    <p className="mt-1 text-xs opacity-50 uppercase">via {msg.source}</p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">AI</div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {listening && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                  Listening... speak now
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-1.5 px-3 py-2 bg-slate-900/80 border-t border-slate-800 shrink-0">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => handleSend(s)} disabled={loading}
                  className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50 transition">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 border-t border-slate-800 bg-slate-900 p-3 shrink-0">
            {voiceSupported && (
              <button
                onClick={listening ? stopListening : startListening}
                disabled={loading}
                title={listening ? "Stop" : "Speak"}
                className={`rounded-xl px-3 py-2 text-lg transition ${
                  listening ? "bg-red-500 text-white animate-pulse" : "border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-emerald-400"
                }`}
              >
                🎤
              </button>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
              placeholder={listening ? "Listening... / سن رہا ہوں..." : "Ask in any language... | کوئی بھی زبان میں پوچھیں"}
              disabled={loading || listening}
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

      {/* Toggle */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition hover:scale-110 active:scale-95"
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
