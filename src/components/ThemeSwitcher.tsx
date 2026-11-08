"use client";

import { useEffect, useState } from "react";

const THEMES = [
  { id: "direct", label: "Direct" },
  { id: "calm", label: "Calm" },
  { id: "studio", label: "Studio" },
] as const;

/**
 * Key feature of the project: keep the same layout and switch only the colours, fonts and corner rounding.
 * It is not part of the clinic site, so it sits in the demo bar (DemoBar) at the top of the page
 */
export function ThemeSwitcher({ label, variant = "site" }: { label: string; variant?: "site" | "demo" }) {
  const [theme, setTheme] = useState<string>("direct");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme ?? "direct");
  }, []);
  const choose = (id: string) => {
    document.documentElement.dataset.theme = id;
    setTheme(id);
    try {
      localStorage.setItem("orela-theme", id);
    } catch {
      /* The display still switches even if saving fails */
    }
  };
  return (
    <label className={variant === "demo" ? "demobar-group" : "theme-select"}>
      <span className={variant === "demo" ? "demobar-label" : "theme-select-label"}>{label}</span>
      <select className={variant === "demo" ? "demobar-select" : "lang-select"} value={theme} onChange={(e) => choose(e.target.value)}>
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </label>
  );
}
