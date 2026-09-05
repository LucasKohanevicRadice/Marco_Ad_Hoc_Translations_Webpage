"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      className="relative overflow-hidden py-xl"
      style={{
        backgroundImage: "url('/liput_suomi_brasilia_tekstuuri.png')",
        backgroundSize: "cover",
        backgroundPosition: "45% center",
      }}
    >
      <div className="hero-scrim absolute inset-0 backdrop-blur-sm" />
      <div className="relative z-10 max-w-[1200px] mx-auto px-gutter grid grid-cols-1 lg:grid-cols-2 gap-lg items-center">
        <div>
          <span className="inline-block bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full text-xs font-semibold mb-md">
            {t.hero.badge}
          </span>
          <h1
            className="text-5xl font-bold text-primary mb-md leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.hero.title}
          </h1>
          <p className="text-lg text-on-surface-variant mb-lg leading-relaxed">
            {t.hero.body}
          </p>
          <div className="flex flex-wrap gap-md">
            <a
              href="#contact"
              className="bg-primary-surface text-on-primary-surface px-lg py-md rounded-lg text-xl font-semibold hover:shadow-lg transition-all flex items-center gap-sm"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.hero.cta}
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
            <a
              href="#services"
              className="border border-primary text-primary px-lg py-md rounded-lg text-xl font-semibold hover:bg-surface-container transition-all"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.hero.secondary}
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[6/7] rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="/marco-izaac.png"
              alt="Marco Izaac — ammattikääntäjä"
              width={600}
              height={600}
              className="w-full h-full object-cover"
              priority
              style={{ objectPosition: "50% 0%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
