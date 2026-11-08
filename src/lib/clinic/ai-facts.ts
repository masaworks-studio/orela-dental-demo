// The "clinic facts" passed to the AI front desk. The AI answers using only what is written here.
// Before the build, scripts/build-ai-facts.ts creates them from the CMS content and writes JSON for each version and language.
// (Netlify functions do not read the CMS; they use only this JSON)

import { formatDuration, formatPrice, formatTime, weekdayShort, type Locale } from "./format";
import type { RegionId } from "./types";

type L = Record<Locale, string>;

/** Content used to build the clinic facts (only part of the CMS shape) */
export type FactsInput = {
  clinic: {
    region: RegionId;
    name: string;
    area: string;
    address: string;
    phone: string;
    sos: string;
    schedule: { weekly: Partial<Record<0 | 1 | 2 | 3 | 4 | 5 | 6, { start: number; end: number }[]>> };
  };
  treatments: {
    name: L;
    summary: L;
    minutes: number;
    priceFrom: number;
    us: { kind: "covered" } | { kind: "monthly"; from: number } | { kind: "fee"; amount: number };
  }[];
  languages: string[];
  faqs: { question: L; answer: L }[];
};

/** Languages available for each version */
export const FACT_LANGS: Record<RegionId, Locale[]> = { es: ["es", "ca", "en", "fr"], us: ["en", "es"] };

function usPrice(t: FactsInput["treatments"][number], lang: Locale): string {
  const es = lang === "es";
  switch (t.us.kind) {
    case "covered":
      return es ? "$0 con la mayoría de los planes" : "$0 with most plans";
    case "monthly":
      return es ? `desde ${formatPrice(t.us.from, "us", lang)}/mes` : `from ${formatPrice(t.us.from, "us", lang)}/mo`;
    case "fee":
      return formatPrice(t.us.amount, "us", lang);
  }
}

/** Turns the clinic facts into a list of short lines for the AI (labels in English, content in that language) */
export function clinicFacts(input: FactsInput, lang: Locale): string {
  const { clinic, treatments, languages, faqs } = input;
  const r = clinic.region;
  const hours = [1, 2, 3, 4, 5, 6, 0]
    .map((d) => {
      const iv = clinic.schedule.weekly[d as 0] ?? [];
      const span = iv.length ? iv.map((i) => `${formatTime(i.start, r, lang)}-${formatTime(i.end, r, lang)}`).join(", ") : "closed";
      return `- ${weekdayShort(d, r, lang, true)}: ${span}`;
    })
    .join("\n");
  const list = treatments
    .map((t) => {
      const price = r === "es" ? `from ${formatPrice(t.priceFrom, r, lang)}` : usPrice(t, lang);
      return `- ${t.name[lang]} (${formatDuration(t.minutes, lang)}, ${price}): ${t.summary[lang]}`;
    })
    .join("\n");
  const qa = faqs.map((f) => `- Q: ${f.question[lang]}\n  A: ${f.answer[lang]}`).join("\n");
  return [
    `Clinic: ${clinic.name}, ${clinic.area}`,
    `Address: ${clinic.address}`,
    `Phone: ${clinic.phone}`,
    `Emergency services number for severe cases: ${clinic.sos}`,
    `Opening hours:\n${hours}`,
    `Treatments (duration, price):\n${list}`,
    r === "es"
      ? "Prices: starting prices; a written quote is given after the first visit, before treatment starts."
      : "Insurance: most PPO plans accepted; coverage is checked before the visit; monthly payment plans through third-party financing.",
    `Languages the team speaks: ${languages.join(", ")}`,
    `Booking: online on the website (free times on the home page and the booking page).`,
    `Frequently asked questions:\n${qa}`,
  ].join("\n\n");
}
