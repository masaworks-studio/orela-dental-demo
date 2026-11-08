// Converts between the site's data shape and Sanity's document shape.
// Used both when creating the import file (toSanityDocuments) and when reading from Sanity at build time (fromSanityDocuments).
// A test checks that a round trip gives back the original data (sanity-map.test.ts).

import type { L } from "@/i18n/config";
import type { Clinic, Faq, TeamMember, Treatment, TrustNumbers } from "./types";
import type { Interval, WeeklyHours } from "@/lib/clinic/types";

export type SiteContent = {
  clinics: Record<Clinic["region"], Clinic>;
  treatments: Treatment[];
  team: TeamMember[];
  faqs: Faq[];
  trust: TrustNumbers;
};

type LocaleString = { _type: "localeString" } & L;
type LocaleText = { _type: "localeText" } & L;

/** Front desk hours for one day (entered in Studio in the form "09:30") */
type SanityHours = { _key: string; _type: "openingHours"; day: number; start: string; end: string };

export type SanityDoc = { _id: string; _type: string; [key: string]: unknown };

const ls = (v: L): LocaleString => ({ _type: "localeString", en: v.en, es: v.es, ca: v.ca, fr: v.fr });
const lt = (v: L): LocaleText => ({ _type: "localeText", en: v.en, es: v.es, ca: v.ca, fr: v.fr });
const plain = (v: Partial<L> | undefined): L => ({ en: v?.en ?? "", es: v?.es ?? "", ca: v?.ca ?? "", fr: v?.fr ?? "" });

export const toHHMM = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const fromHHMM = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + (m || 0);
};

/** Builds a string usable as a Sanity _id from a person's name, etc. */
const idPart = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function toSanityDocuments(c: SiteContent): SanityDoc[] {
  const docs: SanityDoc[] = [];
  for (const clinic of Object.values(c.clinics)) {
    const hours: SanityHours[] = [];
    for (const [day, intervals] of Object.entries(clinic.schedule.weekly)) {
      (intervals as Interval[]).forEach((i, n) =>
        hours.push({ _key: `d${day}-${n}`, _type: "openingHours", day: Number(day), start: toHHMM(i.start), end: toHHMM(i.end) }),
      );
    }
    docs.push({
      _id: `clinic-${clinic.region}`,
      _type: "clinic",
      region: clinic.region,
      key: clinic.key,
      name: clinic.name,
      area: clinic.area,
      address: clinic.address,
      phone: clinic.phone,
      phoneHref: clinic.phoneHref,
      sos: clinic.sos,
      messaging: clinic.messaging,
      timeZone: clinic.schedule.timeZone,
      hours,
      closedDates: clinic.schedule.closedDates,
    });
  }
  c.treatments.forEach((t, order) =>
    docs.push({
      _id: `treatment-${t.slug}`,
      _type: "treatment",
      order,
      slug: { _type: "slug", current: t.slug },
      name: ls(t.name),
      summary: lt(t.summary),
      body: lt(t.body),
      minutes: t.minutes,
      priceFrom: t.priceFrom,
      usKind: t.us.kind,
      usAmount: t.us.kind === "monthly" ? t.us.from : t.us.kind === "fee" ? t.us.amount : undefined,
      bookable: t.bookable,
    }),
  );
  c.team.forEach((m, order) =>
    docs.push({
      _id: `team-${m.region}-${idPart(m.name)}`,
      _type: "teamMember",
      order,
      region: m.region,
      name: m.name,
      role: ls(m.role),
      bio: lt(m.bio),
      hygienist: m.hygienist,
      languages: m.languages,
    }),
  );
  c.faqs.forEach((f, order) =>
    docs.push({
      _id: `faq-${f.region}-${f.topic}`,
      _type: "faq",
      order,
      region: f.region,
      topic: f.topic,
      question: ls(f.question),
      answer: lt(f.answer),
    }),
  );
  docs.push({ _id: "trust", _type: "trustNumbers", rating: c.trust.rating, years: c.trust.years });
  // Fields that are undefined are not written to the import file
  return docs.map((d) => Object.fromEntries(Object.entries(d).filter(([, v]) => v !== undefined)) as SanityDoc);
}

type Any = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Converts documents read from Sanity back into the site's data shape. Throws if anything is missing */
export function fromSanityDocuments(docs: Any[]): SiteContent {
  const of = (type: string) => docs.filter((d) => d._type === type).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const clinics = {} as SiteContent["clinics"];
  for (const d of of("clinic")) {
    const weekly: WeeklyHours = {};
    for (const h of (d.hours ?? []) as SanityHours[]) {
      const day = h.day as keyof WeeklyHours;
      (weekly[day] ??= []).push({ start: fromHHMM(h.start), end: fromHHMM(h.end) });
    }
    for (const list of Object.values(weekly)) list!.sort((a, b) => a.start - b.start);
    clinics[d.region as Clinic["region"]] = {
      region: d.region,
      key: d.key,
      name: d.name,
      area: d.area,
      address: d.address,
      phone: d.phone,
      phoneHref: d.phoneHref,
      sos: d.sos,
      messaging: d.messaging,
      schedule: { timeZone: d.timeZone, weekly, closedDates: d.closedDates ?? [] },
    };
  }
  if (!clinics.es || !clinics.us) throw new Error("Sanity: clinic documents for both regions (es, us) are required");

  const treatments: Treatment[] = of("treatment").map((d) => ({
    slug: d.slug?.current,
    name: plain(d.name),
    summary: plain(d.summary),
    body: plain(d.body),
    minutes: d.minutes,
    priceFrom: d.priceFrom,
    us: d.usKind === "monthly" ? { kind: "monthly", from: d.usAmount } : d.usKind === "fee" ? { kind: "fee", amount: d.usAmount } : { kind: "covered" },
    bookable: Boolean(d.bookable),
  }));
  const team: TeamMember[] = of("teamMember").map((d) => ({
    region: d.region,
    name: d.name,
    role: plain(d.role),
    bio: plain(d.bio),
    hygienist: Boolean(d.hygienist),
    languages: d.languages ?? [],
  }));
  const faqs: Faq[] = of("faq").map((d) => ({ region: d.region, topic: d.topic, question: plain(d.question), answer: plain(d.answer) }));
  const t = docs.find((d) => d._type === "trustNumbers");
  if (!t) throw new Error("Sanity: trustNumbers document is required");
  if (treatments.length === 0) throw new Error("Sanity: no treatments found");
  return { clinics, treatments, team, faqs, trust: { rating: t.rating, years: t.years } };
}
