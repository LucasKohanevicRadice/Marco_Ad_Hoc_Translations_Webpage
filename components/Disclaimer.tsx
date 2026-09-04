"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Disclaimer() {
  const { t } = useLanguage();
  const d = t.disclaimer;

  return (
    <section className="py-xl bg-surface-container-low" id="adhoc">
      <div className="max-w-[1200px] mx-auto px-gutter">
        <div className="mb-lg">
          <h2
            className="text-3xl font-semibold text-primary mb-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {d.title}
          </h2>
          <div className="w-20 h-1 bg-secondary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
          {/* What it is */}
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant border-left-brazil">
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-secondary text-4xl">translate</span>
              <h3
                className="text-xl font-semibold text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {d.flexTitle}
              </h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed">{d.flexBody}</p>
          </div>

          {/* What it is NOT */}
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant border-left-warning">
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-warning text-4xl">info</span>
              <h3
                className="text-xl font-semibold text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {d.noteTitle}
              </h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              {d.noteBodyPre}{" "}
              <strong className="text-warning">{d.noteBodyStrong}</strong>
              {d.noteBodyPost}
            </p>
          </div>
        </div>

        {/* Bottom callout */}
        <div className="mt-md p-md bg-surface-container-lowest border border-outline-variant rounded-xl flex items-start gap-md">
          <span
            className="material-symbols-outlined text-primary text-4xl mt-1 shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            help
          </span>
          <p className="text-on-surface-variant">
            <strong className="text-primary">{d.calloutStrong}</strong>
            {d.calloutBody}
          </p>
        </div>
      </div>
    </section>
  );
}
