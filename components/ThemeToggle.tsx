"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Teeman vaihto lennossa. Attribuutin asettaa alun perin layout.tsx:n
 * inline-skripti ennen maalausta; tämä vain kääntää sen ja tallentaa valinnan.
 *
 * Teemaa ei tiedetä palvelimella, joten ensimmäinen renderöinti on tarkoituksella
 * sama molemmissa päissä ja oikea ikoni asetetaan vasta hydraation jälkeen.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Yksityinen selaustila voi estää tallennuksen. Teema vaihtuu silti,
      // se ei vain säily seuraavaan käyntiin.
    }
  }

  const label = theme === "light" ? "Vaihda tummaan teemaan" : "Vaihda vaaleaan teemaan";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`flex items-center text-on-surface-variant hover:text-primary transition-colors ${className}`}
    >
      <span className="material-symbols-outlined">
        {theme === "light" ? "dark_mode" : "light_mode"}
      </span>
    </button>
  );
}
