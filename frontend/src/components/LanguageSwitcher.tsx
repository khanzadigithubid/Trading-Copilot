"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

const LANGUAGES: { code: Locale; label: string; flag: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English",    flag: "🇺🇸", dir: "ltr" },
  { code: "ar", label: "العربية",    flag: "🇸🇦", dir: "rtl" },
  { code: "es", label: "Español",    flag: "🇪🇸", dir: "ltr" },
  { code: "pt", label: "Português",  flag: "🇧🇷", dir: "ltr" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/50 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition"
        aria-label="Change language"
        title="Change language"
      >
        <span className="text-sm">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg
          className={`h-3 w-3 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-40 rounded-xl border border-slate-700 bg-slate-900 shadow-xl shadow-black/40 overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLocale(lang.code); setOpen(false); }}
              className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition
                ${locale === lang.code
                  ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                  : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
              {lang.dir === "rtl" && (
                <span className="ms-auto text-[10px] text-slate-600 font-mono">RTL</span>
              )}
              {locale === lang.code && (
                <svg className="ms-auto h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
