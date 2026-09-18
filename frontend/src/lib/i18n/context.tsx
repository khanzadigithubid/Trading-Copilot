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

  // Load saved locale on mount
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Locale) || "en";
    if (LOCALES[saved]) setLocaleState(saved);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
    // Apply RTL direction to document
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = l;
  }, []);

  // Apply dir on locale change
  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <I18nContext.Provider
      value={{
        locale,
        t: LOCALES[locale] ?? en,
        setLocale,
        isRTL: locale === "ar",
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
