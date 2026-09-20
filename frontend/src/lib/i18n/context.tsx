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
  }, []);

  // Apply dir/lang on locale change (after mount)
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
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
