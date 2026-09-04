"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Services() {
  const { t } = useLanguage();
  const s = t.services;

  return (
    <section className="py-xl bg-background" id="services">
      <div className="max-w-[1200px] mx-auto px-gutter">
        <div className="mb-lg">
          <h2
            className="text-3xl font-semibold text-primary mb-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {s.title}
          </h2>
          <div className="w-20 h-1 bg-secondary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Individuals */}
          <div className="bg-surface-container-lowest p-lg rounded-lg border border-outline-variant border-left-brazil">
            <div className="flex items-center gap-sm mb-md text-secondary">
              <span className="material-symbols-outlined text-4xl">person</span>
              <h3 className="text-xl font-semibold text-primary" style={{ fontFamily: "var(--font-display)" }}>
                {s.individuals.title}
              </h3>
            </div>
            <ul className="space-y-md">
              <li className="flex gap-sm items-start">
                <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                <div>
                  <p className="text-sm font-bold text-primary">{s.individuals.item1Title}</p>
                  <p className="text-on-surface-variant">{s.individuals.item1Body}</p>
                </div>
              </li>
              <li className="flex gap-sm items-start">
                <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                <div>
                  <p className="text-sm font-bold text-primary">{s.individuals.item2Title}</p>
                  <p className="text-on-surface-variant">{s.individuals.item2Body}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Business */}
          <div className="bg-surface-container-lowest p-lg rounded-lg border border-outline-variant border-left-finland">
            <div className="flex items-center gap-sm mb-md text-primary">
              <span className="material-symbols-outlined text-4xl">business_center</span>
              <h3 className="text-xl font-semibold text-primary" style={{ fontFamily: "var(--font-display)" }}>
                {s.business.title}
              </h3>
            </div>
            <ul className="space-y-md">
              <li className="flex gap-sm items-start">
                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                <div>
                  <p className="text-sm font-bold text-primary">{s.business.item1Title}</p>
                  <p className="text-on-surface-variant">{s.business.item1Body}</p>
                </div>
              </li>
              <li className="flex gap-sm items-start">
                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                <div>
                  <p className="text-sm font-bold text-primary">{s.business.item2Title}</p>
                  <p className="text-on-surface-variant">{s.business.item2Body}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Interpretation */}
          <div className="bg-surface-container-lowest p-lg rounded-lg border border-outline-variant border-left-brazil">
            <div className="flex items-center gap-sm mb-md text-secondary">
              <span className="material-symbols-outlined text-4xl">record_voice_over</span>
              <h3 className="text-xl font-semibold text-primary" style={{ fontFamily: "var(--font-display)" }}>
                {s.interpretation.title}
              </h3>
            </div>
            <ul className="space-y-md">
              <li className="flex gap-sm items-start">
                <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                <div>
                  <p className="text-sm font-bold text-primary">{s.interpretation.item1Title}</p>
                  <p className="text-on-surface-variant">{s.interpretation.item1Body}</p>
                </div>
              </li>
              <li className="flex gap-sm items-start">
                <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                <div>
                  <p className="text-sm font-bold text-primary">{s.interpretation.item2Title}</p>
                  <p className="text-on-surface-variant">{s.interpretation.item2Body}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
