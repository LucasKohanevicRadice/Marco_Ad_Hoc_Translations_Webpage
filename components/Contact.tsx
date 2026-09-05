"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import ObfuscatedEmail from "@/components/ObfuscatedEmail";

type FormState = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contact;
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      service: (form.elements.namedItem("service") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setFormState("success");
        return;
      }

      const payload = await res.json().catch(() => null);
      setErrorMessage(payload?.error ?? "");
      setFormState("error");
    } catch {
      setFormState("error");
    }
  }

  return (
    <section
      className="py-xl bg-background relative overflow-hidden"
      id="contact"
    >
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-5 pointer-events-none">
        <img
          src="/liput_suomi_brasilia.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-gutter relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
          {/* Contact details */}
          <div>
            <h2
              className="text-3xl font-semibold text-primary mb-md"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.title}
            </h2>
            <p className="text-lg text-on-surface-variant mb-lg leading-relaxed">
              {c.body}
            </p>

            <div className="flex items-center gap-md">
              <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <p className="text-sm text-outline">{c.email}</p>
                <p
                  className="text-xl font-semibold text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <ObfuscatedEmail className="hover:underline" />
                </p>
              </div>
            </div>
          </div>

          {/* Quote form */}
          <div
            className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm"
            id="quote"
          >
            <h3
              className="text-xl font-semibold text-primary mb-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.formTitle}
            </h3>

            {formState === "success" ? (
              <div className="flex flex-col items-center justify-center gap-md py-xl text-center">
                <span className="material-symbols-outlined text-secondary text-6xl">
                  check_circle
                </span>
                <p className="text-lg font-semibold text-primary">
                  {c.successTitle}
                </p>
                <p className="text-on-surface-variant">{c.successBody}</p>
              </div>
            ) : (
              <form className="space-y-md" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] w-px h-px overflow-hidden"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-xs">
                      {c.labelName}
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-xs">
                      {c.labelEmail}
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-on-surface-variant mb-xs">
                    {c.labelService}
                  </label>
                  <select
                    name="service"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option>{c.option1}</option>
                    <option>{c.option2}</option>
                    <option>{c.option3}</option>
                    <option>{c.option4}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-on-surface-variant mb-xs">
                    {c.labelMessage}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>

                {formState === "error" && (
                  <p className="text-sm text-error">
                    {errorMessage || "Lähetys epäonnistui. Yritä uudelleen."}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="w-full bg-primary-surface text-on-primary-surface py-md rounded-lg text-xl font-bold hover:bg-primary-surface-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formState === "submitting" ? c.submitting : c.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
