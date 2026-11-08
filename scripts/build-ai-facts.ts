// Before the build, creates the "clinic information" given to the AI front desk for each version and language, and writes it to JSON (runs automatically in prebuild of npm run build).
// The content comes from the CMS (Sanity) snapshot, or the fictional sample data if there is none (same order as src/content/index.ts).
// The Netlify function (netlify/functions/receptionist.mts) reads only this JSON.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { getClinic, getFaqs, getTeam, getTreatments } from "../src/content";
import { clinicFacts, FACT_LANGS } from "../src/lib/clinic/ai-facts";

export const AI_FACTS_PATH = "src/content/.generated/ai-facts.json";

const out: Record<string, Record<string, string>> = {};
for (const region of ["es", "us"] as const) {
  out[region] = {};
  const input = {
    clinic: getClinic(region),
    treatments: getTreatments(),
    languages: [...new Set(getTeam(region).flatMap((m) => m.languages))],
    faqs: getFaqs(region),
  };
  for (const lang of FACT_LANGS[region]) out[region][lang] = clinicFacts(input, lang);
}
mkdirSync(dirname(AI_FACTS_PATH), { recursive: true });
writeFileSync(AI_FACTS_PATH, JSON.stringify(out, null, 2));
console.log(`✓ AI facts: wrote ${AI_FACTS_PATH}`);
