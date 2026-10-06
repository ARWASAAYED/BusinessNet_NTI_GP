"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

// Flatten nested translation keys: { "nav.feed": "Feed", ... }
type NestedObject = { [key: string]: string | NestedObject };

function flattenMessages(obj: NestedObject, prefix = ''): Record<string, string> {
  return Object.keys(obj).reduce<Record<string, string>>((acc, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (typeof value === 'string') {
      acc[prefixedKey] = value;
    } else {
      Object.assign(acc, flattenMessages(value as NestedObject, prefixedKey));
    }
    return acc;
  }, {});
}

const messages: Record<Locale, Record<string, string>> = {
  en: flattenMessages(en as NestedObject),
  ar: flattenMessages(ar as NestedObject),
};

type TVars = Record<string, string | number>;

interface LanguageContextType {
  locale: Locale;
  dir: Direction;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallbackOrVars?: string | TVars) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'mada-locale';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem(LOCALE_STORAGE_KEY) || localStorage.getItem('businessnet-locale')) as Locale | null;
    if (stored && (stored === 'en' || stored === 'ar')) {
      setLocaleState(stored);
    }
    setMounted(true);
  }, []);

  const dir: Direction = locale === 'ar' ? 'rtl' : 'ltr';
  const isRTL = locale === 'ar';

  // Apply dir + lang to <html>
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    html.setAttribute('dir', dir);
    html.setAttribute('lang', locale);

    // Toggle font family for Arabic
    if (isRTL) {
      html.style.fontFamily = "'Cairo', 'Noto Sans Arabic', system-ui, -apple-system, sans-serif";
    } else {
      html.style.fontFamily = '';
    }
  }, [locale, dir, isRTL, mounted]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
  }, []);

  const t = useCallback((key: string, fallbackOrVars?: string | TVars): string => {
    let str = messages[locale][key];
    let vars: TVars | undefined;
    if (typeof fallbackOrVars === 'object' && fallbackOrVars !== null) {
      vars = fallbackOrVars;
      str = str || key;
    } else {
      str = str || fallbackOrVars || key;
    }
    if (vars) {
      str = str.replace(/\{(\w+)\}/g, (_, name) =>
        name in vars! ? String(vars![name]) : `{${name}}`
      );
    }
    return str;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, dir, setLocale, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
