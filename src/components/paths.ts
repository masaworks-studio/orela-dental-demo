import type { Locale, RegionId } from "@/i18n/config";

/** Clinic site URLs (with a trailing slash) */
export function clinicPath(region: RegionId, lang: Locale, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return `/${region}/${lang}/${clean ? `${clean}/` : ""}`;
}
