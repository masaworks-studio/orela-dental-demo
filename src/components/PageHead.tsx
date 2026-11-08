import type { Locale } from "@/i18n/config";
import { PAGES } from "@/i18n/pages";

export function PageHead({ page, lang }: { page: keyof typeof PAGES; lang: Locale }) {
  const p = PAGES[page];
  return (
    <div className="page-head">
      <h1>{p.title[lang]}</h1>
      {p.intro[lang] && <p>{p.intro[lang]}</p>}
    </div>
  );
}

export function pageTitle(page: keyof typeof PAGES, lang: Locale): string {
  return PAGES[page].title[lang];
}
