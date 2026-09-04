"use client";

import { createContext, useContext, useState } from "react";
import { translations, Locale } from "./translations";

type LanguageContextType = {
  locale: Locale;
  t: typeof translations[Locale];
  setLocale: (l: Locale) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "fi",
  t: translations["fi"],
  setLocale: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("fi");
  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
