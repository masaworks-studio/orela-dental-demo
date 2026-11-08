// Single entry point for content. Pages use only this (read on the server side, at build time only).
// If there is a snapshot that scripts/fetch-content.ts read from Sanity before the build, use it;
// otherwise use the fictional sample data in src/content/data.ts.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { RegionId } from "@/i18n/config";
import { CLINICS, FAQS, TEAM, TREATMENTS, TRUST } from "./data";
import { SNAPSHOT_PATH } from "./sanity-config";
import type { SiteContent } from "./sanity-map";

function load(): { content: SiteContent; source: "sanity" | "local" } {
  const file = join(process.cwd(), SNAPSHOT_PATH);
  if (existsSync(file)) {
    const { content } = JSON.parse(readFileSync(file, "utf8")) as { content: SiteContent };
    return { content, source: "sanity" };
  }
  return { content: { clinics: CLINICS, treatments: TREATMENTS, team: TEAM, faqs: FAQS, trust: TRUST }, source: "local" };
}

const { content, source } = load();

/** Where the content was read from (for the "how it was made" page and debugging) */
export const contentSource = source;

export const getClinic = (region: RegionId) => content.clinics[region];
export const getTreatments = () => content.treatments;
export const getTreatment = (slug: string) => content.treatments.find((t) => t.slug === slug);
export const getTeam = (region: RegionId) => content.team.filter((m) => m.region === region);
export const getFaqs = (region: RegionId) => content.faqs.filter((f) => f.region === region || f.region === "both");
export const getTrust = () => content.trust;

/** Number of languages spoken (counted from the team's languages, so the number lives in one place) */
export const languageCount = (region: RegionId) => new Set(getTeam(region).flatMap((m) => m.languages)).size;
