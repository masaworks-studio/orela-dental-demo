// Types for clinic opening hours and bookings. The UI and CMS follow these shapes.

export type RegionId = "es" | "us";

/** An opening period in a day, in minutes (9:30 → 570). end is exclusive */
export type Interval = { start: number; end: number };

/** Opening periods per weekday. 0=Sunday … 6=Saturday. Days with no key are closed */
export type WeeklyHours = Partial<Record<0 | 1 | 2 | 3 | 4 | 5 | 6, Interval[]>>;

export type ClinicSchedule = {
  timeZone: string;
  weekly: WeeklyHours;
  /** Closed days (local date YYYY-MM-DD) */
  closedDates: string[];
};

/** Parts of a local time */
export type LocalTime = {
  date: string; // YYYY-MM-DD
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  minutes: number; // minutes from 0:00
};

export type OpenStatus =
  | { state: "open"; closesAt: number; minutesLeft: number }
  | { state: "closed"; next: { date: string; weekday: number; daysAhead: number; opensAt: number } | null };

export type Slot = { date: string; weekday: number; start: number };
