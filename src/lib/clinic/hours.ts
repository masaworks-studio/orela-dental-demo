import type { ClinicSchedule, Interval, LocalTime, OpenStatus } from "./types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Converts a moment to the clinic's local time (Intl handles daylight saving time) */
export function toLocal(instant: Date, timeZone: string): LocalTime {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = WEEKDAYS.indexOf(get("weekday") as (typeof WEEKDAYS)[number]);
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    weekday: weekday as LocalTime["weekday"],
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

/** Adds days to YYYY-MM-DD (calendar maths only, so done in UTC) */
export function addDays(date: string, days: number): { date: string; weekday: LocalTime["weekday"] } {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return { date: d.toISOString().slice(0, 10), weekday: d.getUTCDay() as LocalTime["weekday"] };
}

/** Opening periods for that day (empty if closed) */
export function intervalsOn(schedule: ClinicSchedule, date: string, weekday: number): Interval[] {
  if (schedule.closedDates.includes(date)) return [];
  return schedule.weekly[weekday as keyof ClinicSchedule["weekly"]] ?? [];
}

/** Whether it is open now. If closed, the next opening date and time (searches up to 2 weeks ahead) */
export function openStatus(schedule: ClinicSchedule, now: LocalTime): OpenStatus {
  const today = intervalsOn(schedule, now.date, now.weekday);
  const current = today.find((i) => now.minutes >= i.start && now.minutes < i.end);
  if (current) {
    return { state: "open", closesAt: current.end, minutesLeft: current.end - now.minutes };
  }
  for (let ahead = 0; ahead <= 14; ahead++) {
    const day = ahead === 0 ? { date: now.date, weekday: now.weekday } : addDays(now.date, ahead);
    const next = intervalsOn(schedule, day.date, day.weekday).find((i) => ahead > 0 || i.start > now.minutes);
    if (next) {
      return { state: "closed", next: { date: day.date, weekday: day.weekday, daysAhead: ahead, opensAt: next.start } };
    }
  }
  return { state: "closed", next: null };
}

/** Splits minutes into hours and minutes (parts for display) */
export function splitMinutes(total: number): { h: number; m: number } {
  return { h: Math.floor(total / 60), m: total % 60 };
}
