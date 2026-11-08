// Formats currency, dates and times for the language and version.

import type { RegionId } from "./types";

export type Locale = "en" | "es" | "ca" | "fr";

/** Locale code with region for Intl, from the version and language */
export function intlLocale(region: RegionId, lang: Locale): string {
  if (region === "us") return lang === "es" ? "es-US" : "en-US";
  return { en: "en-GB", es: "es-ES", ca: "ca-ES", fr: "fr-FR" }[lang];
}

export function formatPrice(amount: number, region: RegionId, lang: Locale): string {
  const currency = region === "us" ? "USD" : "EUR";
  return new Intl.NumberFormat(intlLocale(region, lang), {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  })
    .format(amount)
    .replace(/ /g, " ");
}

/** Turns minutes (from 0:00) into a time string. The US uses the 12-hour clock */
export function formatTime(minutes: number, region: RegionId, lang: Locale): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (region === "us") {
    const suffix = h < 12 ? "am" : "pm";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
  }
  // French writes "9 h" and "9 h 30"
  if (lang === "fr") return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
  return `${h}:${String(m).padStart(2, "0")}`;
}

/**
 * Short weekday name (0=Sunday). Mid-sentence it follows the language's rules (lower case for es, ca, fr);
 * at the start of a button or table, use capitalize to make it upper case
 */
export function weekdayShort(weekday: number, region: RegionId, lang: Locale, capitalize = false): string {
  // 2024-01-07 is a Sunday. Move forward weekday days from there
  const d = new Date(Date.UTC(2024, 0, 7 + weekday, 12));
  const name = new Intl.DateTimeFormat(intlLocale(region, lang), { weekday: "short", timeZone: "UTC" })
    .format(d)
    .replace(/\.$/, "");
  return capitalize ? name.charAt(0).toLocaleUpperCase(intlLocale(region, lang)) + name.slice(1) : name;
}

/** "45 min", "1 h 20 min" */
export function formatDuration(minutes: number, lang: Locale): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

/** "09/11" (Spain: day/month), "11/09" (US: month/day) */
export function formatShortDate(date: string, region: RegionId): string {
  const [, m, d] = date.split("-");
  return region === "us" ? `${m}/${d}` : `${d}/${m}`;
}
