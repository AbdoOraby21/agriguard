import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return window.localStorage.getItem("agriguard-lang") || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("agriguard-lang", lang);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const dict = translations[lang];

  function t(key, ...args) {
    const entry = dict[key];
    if (typeof entry === "function") return entry(...args);
    if (entry === undefined) return key;
    return entry;
  }

  const dir = lang === "ar" ? "rtl" : "ltr";
  const locale = lang === "ar" ? "ar-EG" : "en-US";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir, locale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
