"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer className="footer-surface w-full">
      <div className="flex flex-col md:flex-row justify-between items-center py-lg px-gutter w-full max-w-[1200px] mx-auto gap-md">
        <div className="flex flex-col gap-xs items-center md:items-start">
          <span className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Marco Izaac
          </span>
          <p className="text-sm opacity-80">{f.copyright}</p>
        </div>
        <div className="flex gap-lg">
          <a
            href="#services"
            className="opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-colors duration-200 underline text-sm"
          >
            {f.services}
          </a>
          <a
            href="#contact"
            className="opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-colors duration-200 underline text-sm"
          >
            {f.contact}
          </a>
          <a
            href="/tietosuoja"
            className="opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-colors duration-200 underline text-sm"
          >
            Tietosuoja
          </a>
        </div>
      </div>
    </footer>
  );
}
