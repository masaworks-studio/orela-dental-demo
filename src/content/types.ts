// Shape of the content updated in the CMS (Sanity). Until Sanity is connected, the fictional sample data in data.ts is used.

import type { L, RegionId } from "@/i18n/config";
import type { ClinicSchedule } from "@/lib/clinic/types";

export type Clinic = {
  region: RegionId;
  key: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  phoneHref: string;
  /** Emergency number (112 / 911) */
  sos: string;
  messaging: "whatsapp" | "sms";
  schedule: ClinicSchedule;
};

export type Treatment = {
  slug: string;
  name: L;
  summary: L;
  body: L;
  minutes: number;
  /** EU version price (euros). A "from" price */
  priceFrom: number;
  /** How it is shown in the US version */
  us: { kind: "covered" } | { kind: "monthly"; from: number } | { kind: "fee"; amount: number };
  /** Whether this treatment can be booked (same-day emergencies go to the queue) */
  bookable: boolean;
};

export type TeamMember = {
  region: RegionId;
  name: string;
  role: L;
  bio: L;
  /** Whether to present this person as the assigned dental hygienist */
  hygienist: boolean;
  languages: string[];
};

export type Faq = { region: RegionId | "both"; question: L; answer: L; topic: string };

export type TrustNumbers = { rating: number; years: number };
