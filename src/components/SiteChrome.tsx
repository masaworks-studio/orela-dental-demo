import Link from "next/link";
import type { Clinic } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { MESSAGES } from "@/i18n/messages";
import { formatTime, weekdayShort } from "@/lib/clinic/format";
import { getTreatments } from "@/content";
import { LangSelect } from "./LangSelect";
import { SiteNav, type NavItem } from "./SiteNav";
import { SocialLinks } from "./SocialLinks";
import type { SimTreatment } from "./MessagingSimulator";
import { clinicPath } from "./paths";

export function SiteHeader({ clinic, lang }: { clinic: Clinic; lang: Locale }) {
  const msg = MESSAGES[lang];
  const r = clinic.region;
  const to = (path = "") => clinicPath(r, lang, path);
  const items: NavItem[] = [
    { href: to(), label: msg.nav.home },
    {
      href: to("treatments"),
      label: msg.nav.treatments,
      children: [
        { href: to("treatments"), label: msg.nav.allTreatments },
        ...getTreatments().map((t) => ({ href: to(`treatments/${t.slug}`), label: t.name[lang] })),
        r === "es" ? { href: to("prices"), label: msg.nav.prices } : { href: to("insurance"), label: msg.nav.insurance },
      ],
    },
    { href: to("clinic"), label: msg.nav.clinic },
    { href: to("team"), label: msg.nav.team },
    { href: to("emergency"), label: msg.nav.emergency },
    { href: to("contact"), label: msg.nav.contact },
  ];
  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="logo" href={to()}>
          <i aria-hidden="true">O</i>
          {clinic.name}
        </Link>
        <SiteNav items={items} menuLabel={msg.nav.menu} closeLabel={msg.nav.close} />
        <div className="switches">
          <LangSelect region={r} lang={lang} label={msg.language} />
        </div>
      </div>
    </header>
  );
}

/** Opening hours for each day of the week (used in the footer and on the "Contact" page) */
export function HoursTable({ clinic, lang }: { clinic: Clinic; lang: Locale }) {
  const msg = MESSAGES[lang];
  const days = [1, 2, 3, 4, 5, 6, 0] as const;
  return (
    <table className="hours-table">
      <tbody>
        {days.map((d) => {
          const intervals = clinic.schedule.weekly[d] ?? [];
          return (
            <tr key={d}>
              <td>{weekdayShort(d, clinic.region, lang, true)}</td>
              <td>
                {intervals.length === 0
                  ? msg.closedDay
                  : intervals.map((i) => `${formatTime(i.start, clinic.region, lang)}–${formatTime(i.end, clinic.region, lang)}`).join(", ")}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function SiteFooter({ clinic, lang }: { clinic: Clinic; lang: Locale }) {
  const msg = MESSAGES[lang];
  const r = clinic.region;
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div>
          <h3>{msg.footer.hours}</h3>
          <HoursTable clinic={clinic} lang={lang} />
        </div>
        <div>
          <h3>{msg.footer.address}</h3>
          <p>
            {clinic.name}
            <br />
            {clinic.address}
          </p>
          <h3>{msg.footer.phone}</h3>
          <p>
            <a href={clinic.phoneHref}>{clinic.phone}</a>
          </p>
          <SocialLinks region={r} lang={lang} />
        </div>
        <div className="footer-links">
          <Link href={clinicPath(r, lang, "faq")}>{msg.nav.faq}</Link>
          <Link href={clinicPath(r, lang, "privacy")}>{msg.footer.privacy}</Link>
          {r === "es" ? (
            <Link href={clinicPath(r, lang, "cookies")}>{msg.footer.cookies}</Link>
          ) : (
            <Link href={clinicPath(r, lang, "language-assistance")}>{msg.footer.languageHelp}</Link>
          )}
          <p className="small">
            {msg.demoNotice} {msg.footer.aiImages}
          </p>
        </div>
      </div>
    </footer>
  );
}

export function MobileBar({ clinic, lang, treatments, languages }: { clinic: Clinic; lang: Locale; treatments: SimTreatment[]; languages: Locale[] }) {
  const msg = MESSAGES[lang];
  return (
    <div className="mobilebar">
      <a href={clinic.phoneHref}>{msg.call}</a>
      <Link className="primary" href={clinicPath(clinic.region, lang, "book")}>
        {msg.book.short}
      </Link>
    </div>
  );
}
