import type { Treatment } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { formatPrice } from "@/lib/clinic/format";

/** How prices are shown in the US version (covered by insurance / monthly payments / fixed price) */
export function usPriceLabel(t: Pick<Treatment, "us">, lang: Locale): string {
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
