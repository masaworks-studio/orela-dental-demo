import { notFound } from "next/navigation";
import { getClinic } from "@/content";
import { allRegionLocales, isLocaleOf, isRegion, type Locale, type RegionId } from "@/i18n/config";
import { MESSAGES } from "@/i18n/messages";

export type PageParams = Promise<{ region: string; lang: string }>;

/** Gets the version, language, clinic and texts used by a page in one go */
export async function resolve(params: PageParams) {
  const { region, lang } = await params;
  if (!isRegion(region) || !isLocaleOf(region, lang)) notFound();
  return { region: region as RegionId, lang: lang as Locale, clinic: getClinic(region), msg: MESSAGES[lang as Locale] };
}

/** Combinations of pages to generate. If regions is given, only those versions are built (price list for Spain, insurance for the US, etc.) */
export function paramsFor(regions: RegionId[] = ["es", "us"]) {
  return allRegionLocales()
    .filter((p) => regions.includes(p.region))
    .map(({ region, lang }) => ({ region, lang }));
}
