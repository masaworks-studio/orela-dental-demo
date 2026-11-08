import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/styles/globals.css";
import { fontVariables, themeBootScript } from "@/app/fonts";
import { getClinic, getTeam, getTreatments } from "@/content";
import { isLocaleOf, isRegion, REGION_LOCALES, type Locale } from "@/i18n/config";
import { MESSAGES } from "@/i18n/messages";
import { intlLocale } from "@/lib/clinic/format";
import { CookieBannerSample } from "@/components/CookieBannerSample";
import { DemoBar } from "@/components/DemoBar";
import { MessagingButton } from "@/components/MessagingButton";
import { ReceptionistChat } from "@/components/ReceptionistChat";
import { MobileBar, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { StatusStrip } from "@/components/StatusStrip";

type Params = Promise<{ region: string; lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { region, lang } = await params;
  if (!isRegion(region) || !isLocaleOf(region, lang)) return {};
  const clinic = getClinic(region);
  return {
    title: { default: `${clinic.name} · ${clinic.area}`, template: `%s · ${clinic.name}` },
    description: MESSAGES[lang].demoNotice,
    robots: { index: false, follow: false },
  };
}

export default async function ClinicLayout({ children, params }: { children: React.ReactNode; params: Params }) {
  const { region, lang } = await params;
  if (!isRegion(region) || !isLocaleOf(region, lang)) notFound();
  const clinic = getClinic(region);
  const msg = MESSAGES[lang];
  const simTreatments = getTreatments().map(({ slug, name, priceFrom, bookable }) => ({ slug, name, priceFrom, bookable }));
  const languages = [...new Set(getTeam(region).flatMap((m) => m.languages))].filter((l): l is Locale =>
    (["en", "es", "ca", "fr"] as string[]).includes(l),
  );

  return (
    <html lang={intlLocale(region, lang)} className={fontVariables} data-region={region} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        {REGION_LOCALES[region].map((l) => (
          <link key={l} rel="alternate" hrefLang={l} href={`/${region}/${l}/`} />
        ))}
      </head>
      <body>
        <DemoBar region={region} lang={lang} notice={msg.demoNotice} />
        <StatusStrip clinic={clinic} lang={lang} />
        <SiteHeader clinic={clinic} lang={lang} />
        <main id="main">{children}</main>
        <SiteFooter clinic={clinic} lang={lang} />
        <MobileBar clinic={clinic} lang={lang} treatments={simTreatments} languages={languages} />
        <MessagingButton clinic={clinic} lang={lang} treatments={simTreatments} languages={languages} place="float" />
        {region === "es" && <CookieBannerSample lang={lang} />}
        <ReceptionistChat
          clinic={clinic}
          lang={lang}
          languages={languages}
          treatments={getTreatments().map(({ name, priceFrom, slug }) => ({ name, priceFrom, slug }))}
        />
      </body>
    </html>
  );
}
