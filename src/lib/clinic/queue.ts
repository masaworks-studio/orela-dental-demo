import { intervalsOn } from "./hours";
import { intBetween, rng, seedFrom } from "./random";
import type { ClinicSchedule, LocalTime } from "./types";

export type QueueStatus =
  | { accepting: true; waiting: number; estimatedMinutes: number }
  | { accepting: false; reason: "closed" | "closing-soon" };

export type QueueOptions = {
  /** Estimated time per same-day emergency patient (minutes) */
  minutesPerPatient: number;
  /** How many minutes before closing the front desk stops accepting */
  cutoffMinutes: number;
  /** Number of same-day emergency patients that can be seen at once */
  parallel: number;
};

const DEFAULTS: QueueOptions = { minutesPerPatient: 20, cutoffMinutes: 45, parallel: 1 };

/** Estimates the waiting time from the number waiting (rounded up to 5 minutes) */
export function estimateWait(waiting: number, o: QueueOptions = DEFAULTS): number {
  if (waiting <= 0) return 0;
  const raw = Math.ceil(waiting / o.parallel) * o.minutesPerPatient;
  return Math.ceil(raw / 5) * 5;
}

/**
 * Same-day emergency status. The number waiting is made up and changes every 15 minutes.
 * No new patients from cutoff minutes before closing (based on how real clinics operate).
 */
export function emergencyQueue(
  clinicKey: string,
  schedule: ClinicSchedule,
  now: LocalTime,
  options: Partial<QueueOptions> = {},
): QueueStatus {
  const o = { ...DEFAULTS, ...options };
  const current = intervalsOn(schedule, now.date, now.weekday).find(
    (i) => now.minutes >= i.start && now.minutes < i.end,
  );
  if (!current) return { accepting: false, reason: "closed" };
  if (current.end - now.minutes <= o.cutoffMinutes) return { accepting: false, reason: "closing-soon" };
  const bucket = Math.floor(now.minutes / 15);
  const waiting = intBetween(rng(seedFrom(`${clinicKey}|queue|${now.date}|${bucket}`)), 0, 4);
  return { accepting: true, waiting, estimatedMinutes: estimateWait(waiting, o) };
}
