"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Locale, Translations } from "./types";
import { en } from "./translations/en";
import { ar } from "./translations/ar";
import { es } from "./translations/es";
import { pt } from "./translations/pt";

const LOCALES: Record<Locale, Translations> = { en, ar, es, pt };
const STORAGE_KEY = "tc_locale";

// Dynamically load Arabic font only when Arabic is selected
// This prevents unnecessary preload warnings on non-Arabic pages
function loadArabicFont() {
  if (document.getElementById("arabic-font-link")) return; // already loaded
  const link = document.createElement("link");
  link.id = "arabic-font-link";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700;900&display=swap";
  document.head.appendChild(link);
}

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  t: en,
  setLocale: () => {},
  isRTL: false,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  // Load saved locale on mount — only runs client-side
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Locale) || "en";
    if (LOCALES[saved]) setLocaleState(saved);
    setMounted(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = l;
    // Load Arabic font on demand — only when user switches to Arabic
    if (l === "ar") loadArabicFont();
  }, []);

  // Apply dir/lang on locale change (after mount)
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    if (locale === "ar") loadArabicFont();
  }, [locale, mounted]);

  // Always render with "en" on first pass to match server HTML
  // After mount, context updates to saved locale — no hydration mismatch
  return (
    <I18nContext.Provider
      value={{
        locale: mounted ? locale : "en",
        t: mounted ? (LOCALES[locale] ?? en) : en,
        setLocale,
        isRTL: mounted ? locale === "ar" : false,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
