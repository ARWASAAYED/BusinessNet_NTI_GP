"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import i18next from "@/lib/i18n";
import { initReactI18next } from "react-i18next";

export type Locale = "en" | "ar";
export type Direction = "ltr" | "rtl";

type TVars = Record<string, string | number>;

interface LanguageContextType {
  locale: Locale;
  dir: Direction;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallbackOrVars?: string | TVars) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const LOCALE_STORAGE_KEY = "mada-locale";

i18next.use(initReactI18next);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem(LOCALE_STORAGE_KEY) ||
      localStorage.getItem("businessnet-locale")) as Locale | null;

    if (stored === "en" || stored === "ar") {
      setLocaleState(stored);
      void i18next.changeLanguage(stored);
    }
    setMounted(true);
  }, []);

  const dir: Direction = locale === "ar" ? "rtl" : "ltr";
  const isRTL = locale === "ar";

  // Apply dir + lang to <html>
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    html.setAttribute("dir", dir);
    html.setAttribute("lang", locale);

    // Toggle font family for Arabic
    if (isRTL) {
      html.style.fontFamily =
        "'Cairo', 'Noto Sans Arabic', system-ui, -apple-system, sans-serif";
    } else {
      html.style.fontFamily = "";
    }
  }, [locale, dir, isRTL, mounted]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    void i18next.changeLanguage(newLocale);
  }, []);

  const t = useCallback(
    (key: string, fallbackOrVars?: string | TVars): string => {
      let variables: TVars | undefined;
      let fallback = fallbackOrVars;

      if (typeof fallbackOrVars === "object" && fallbackOrVars !== null) {
        variables = fallbackOrVars;
        fallback = key;
      }

      return i18next.t(key, {
        defaultValue: fallback as string | undefined,
        ...variables,
      });
    },
    [],
  );

  return (
    <LanguageContext.Provider value={{ locale, dir, setLocale, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
