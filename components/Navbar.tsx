"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, locale, setLocale } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant h-20 w-full">
      <div className="flex justify-between items-center px-gutter w-full max-w-[1200px] mx-auto h-full">
        <a href="#" className="flex items-center gap-sm hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-primary text-4xl">translate</span>
          <span className="font-[var(--font-display)] text-2xl font-bold text-primary tracking-tight">
            {t.nav.brand}
          </span>
        </a>

        {/*
          Katkaisukohta on xl eikä md, koska suomenkielinen brändi
          ("Marco Izaac - Ad Hoc Tulkkauspalvelut") vie yksin 466 px ja
          navigaatio 600 px. Sitä kapeammalla brändi, linkit ja painike
          rivittyivät kahdelle riville 80 px korkeaan palkkiin.
        */}
        <div className="hidden xl:flex items-center gap-md">
          <a href="#services" className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200">
            {t.nav.services}
          </a>
          <a href="#adhoc" className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200">
            {t.nav.adhoc}
          </a>
          <a href="#contact" className="bg-primary-surface text-on-primary-surface px-lg py-sm rounded-lg text-sm font-bold active:scale-95 transition-all hover:opacity-90">
            {t.nav.contact}
          </a>
          {/* Language switcher */}
          <div className="flex items-center gap-sm">
            <button
              onClick={() => setLocale("fi")}
              className={`text-2xl transition-opacity ${locale === "fi" ? "opacity-100" : "opacity-35 hover:opacity-70"}`}
              aria-label="Suomi"
            >
              🇫🇮
            </button>
            <button
              onClick={() => setLocale("pt-br")}
              className={`text-2xl transition-opacity ${locale === "pt-br" ? "opacity-100" : "opacity-35 hover:opacity-70"}`}
              aria-label="Português"
            >
              🇧🇷
            </button>
            <ThemeToggle className="ml-xs" />
          </div>
        </div>

        <button
          className="xl:hidden p-sm text-primary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="xl:hidden bg-surface-container-lowest border-t border-outline-variant px-gutter py-md flex flex-col gap-md">
          <a href="#services" onClick={() => setMenuOpen(false)} className="text-on-surface-variant font-medium">
            {t.nav.services}
          </a>
          <a href="#adhoc" onClick={() => setMenuOpen(false)} className="text-on-surface-variant font-medium">
            {t.nav.adhoc}
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)} className="text-on-surface-variant font-medium">
            {t.nav.contact}
          </a>
          <div className="flex gap-md pt-xs">
            <button
              onClick={() => { setLocale("fi"); setMenuOpen(false); }}
              className={`text-2xl transition-opacity ${locale === "fi" ? "opacity-100" : "opacity-35"}`}
            >
              🇫🇮
            </button>
            <button
              onClick={() => { setLocale("pt-br"); setMenuOpen(false); }}
              className={`text-2xl transition-opacity ${locale === "pt-br" ? "opacity-100" : "opacity-35"}`}
            >
              🇧🇷
            </button>
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
