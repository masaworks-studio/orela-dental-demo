import { addDays, intervalsOn } from "./hours";
import { rng, seedFrom } from "./random";
import type { ClinicSchedule, LocalTime, Slot } from "./types";

export type SlotOptions = {
  /** Booking length (minutes) */
  length: number;
  /** How many to return */
  count: number;
  /** Earliest start, in minutes from now (no last-minute slots) */
  leadMinutes: number;
  /** Share of slots booked (0–1). Used to build a made-up schedule */
  busyRate: number;
  /** How many days ahead to search */
  daysAhead: number;
};

const DEFAULTS: SlotOptions = { length: 30, count: 4, leadMinutes: 90, busyRate: 0.6, daysAhead: 14 };

/** Whether the slot is booked. Based on the date and time, so the same slot always gives the same result */
export function isBooked(clinicKey: string, date: string, start: number, busyRate: number): boolean {
  return rng(seedFrom(`${clinicKey}|${date}|${start}`))() < busyRate;
}

/** Returns the next free slots. Skips times outside opening hours, lunchtime, closed days and last-minute slots */
export function nextFreeSlots(
  clinicKey: string,
  schedule: ClinicSchedule,
  now: LocalTime,
  options: Partial<SlotOptions> = {},
): Slot[] {
  const o = { ...DEFAULTS, ...options };
  const found: Slot[] = [];
  for (let ahead = 0; ahead <= o.daysAhead && found.length < o.count; ahead++) {
    const day = ahead === 0 ? { date: now.date, weekday: now.weekday } : addDays(now.date, ahead);
    for (const interval of intervalsOn(schedule, day.date, day.weekday)) {
      for (let start = interval.start; start + o.length <= interval.end; start += o.length) {
        if (ahead === 0 && start < now.minutes + o.leadMinutes) continue;
        if (isBooked(clinicKey, day.date, start, o.busyRate)) continue;
        found.push({ date: day.date, weekday: day.weekday, start });
        if (found.length >= o.count) return found;
      }
    }
  }
  return found;
}
