import type { Locale } from "@/lib/clinic/format";
import type { RegionId } from "@/lib/clinic/types";

export type { Locale, RegionId };

/** Languages per version. The first one is the default language */
export const REGION_LOCALES: Record<RegionId, Locale[]> = {
  es: ["es", "ca", "en", "fr"],
  us: ["en", "es"],
};

export const LOCALE_NAMES: Record<Locale, string> = {
  es: "Español",
  ca: "Català",
  en: "English",
  fr: "Français",
};

export const REGION_NAMES: Record<RegionId, string> = { es: "EU (Spain)", us: "US (Texas)" };

export function isRegion(v: string): v is RegionId {
  return v === "es" || v === "us";
}

export function isLocaleOf(region: RegionId, v: string): v is Locale {
  return (REGION_LOCALES[region] as string[]).includes(v);
}

export function allRegionLocales(): { region: RegionId; lang: Locale }[] {
  return (Object.keys(REGION_LOCALES) as RegionId[]).flatMap((region) =>
    REGION_LOCALES[region].map((lang) => ({ region, lang })),
  );
}

/** Text in four languages. The US version does not use ca or fr */
export type L = { en: string; es: string; ca: string; fr: string };

export function t(value: L, lang: Locale): string {
  return value[lang];
}
