"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, type Lang, type TranslationKey } from "./translations";

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "barry_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  const [mounted, setMounted] = useState(false);

  // Charge la langue au démarrage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && translations[saved]) {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  // Applique la direction (RTL pour l'arabe)
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang, mounted]);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations.fr[key] || key;
  };

  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLang doit être utilisé dans LanguageProvider");
  }
  return context;
}