"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [shown, setShown] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Check already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (installed || shown || !prompt) return null;

  async function handleInstall() {
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setShown(true);
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-emerald-500/30 bg-slate-900 p-4 shadow-2xl shadow-black/40">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold text-lg">
          AI
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-100">Install Trading Copilot</p>
          <p className="mt-0.5 text-xs text-slate-400">
            Add to home screen for instant access — works offline too.
          </p>
        </div>
        <button
          onClick={() => setShown(true)}
          className="text-slate-600 hover:text-slate-400 text-lg leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 rounded-xl bg-emerald-500 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
        >
          Install app
        </button>
        <button
          onClick={() => setShown(true)}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 transition"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
