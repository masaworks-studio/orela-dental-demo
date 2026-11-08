// What data a booking would look like "if we sent it" to the clinic's booking system or CRM.
// The demo does not send it; it only shows it on screen. It covers the points that matter in real projects:
//  - The same booking delivered twice becomes one record (idempotencyKey)
//  - Patients are looked up by phone number, one record per person (no duplicates)
//  - Once booked, follow-up messages stop (reminder nudges, waiting list offers, etc.)
//  - No health data such as symptoms (designed with GDPR/HIPAA in mind)

import { seedFrom } from "./random";

export type BookingInput = {
  clinicKey: string;
  timeZone: string;
  date: string; // local YYYY-MM-DD
  start: number; // minutes from 0:00
  minutes: number;
  treatment: string;
  name: string;
  phone: string;
  lang: string;
  channel: "web" | "whatsapp" | "sms" | "phone";
};

/** Offset from UTC (in minutes) of the time zone at the given moment. Intl handles daylight saving time */
export function offsetMinutes(utcInstant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(utcInstant);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return Math.round((asUtc - utcInstant.getTime()) / 60000);
}

/** Turns a local date and time into ISO 8601 with offset (e.g. 2026-11-10T10:00:00+01:00) */
export function zonedIso(date: string, minutes: number, timeZone: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const naive = Date.UTC(y, m - 1, d, Math.floor(minutes / 60), minutes % 60);
  // First treat it as UTC, then correct by the offset at that moment (correct within opening hours, even on DST change days)
  const off = offsetMinutes(new Date(naive - offsetMinutes(new Date(naive), timeZone) * 60000), timeZone);
  const sign = off >= 0 ? "+" : "-";
  const abs = Math.abs(off);
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return `${date}T${hh}:${mm}:00${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

/** Reduces a phone number to digits and a leading + (for matching) */
export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

/** When shown on screen, hide most of the phone number */
export function maskPhone(phone: string): string {
  const n = normalizePhone(phone);
  return n.length <= 4 ? "••••" : `${"•".repeat(n.length - 4)}${n.slice(-4)}`;
}

export function buildBookingPayload(b: BookingInput) {
  const phone = normalizePhone(b.phone);
  const idempotencyKey = `bk_${seedFrom(`${b.clinicKey}|${b.date}|${b.start}|${phone}`).toString(16).padStart(8, "0")}`;
  return {
    event: "appointment.requested",
    idempotencyKey,
    clinic: b.clinicKey,
    appointment: {
      treatment: b.treatment,
      start: zonedIso(b.date, b.start, b.timeZone),
      durationMinutes: b.minutes,
      timeZone: b.timeZone,
    },
    patient: {
      matchBy: "phone",
      phone,
      name: b.name.trim(),
      preferredLanguage: b.lang,
    },
    crm: {
      upsert: true,
      stopFollowUps: ["missed-call", "waitlist-offer", "rebook-reminder"],
    },
    channel: b.channel,
    // Health data (symptoms, etc.) is not collected or sent
    containsHealthData: false,
  };
}

export type BookingPayload = ReturnType<typeof buildBookingPayload>;
