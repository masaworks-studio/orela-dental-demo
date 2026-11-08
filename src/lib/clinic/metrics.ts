// Figures for the front desk dashboard. Builds made-up daily data and totals it.
// Totals are calculated from the daily figures so the breakdown and totals always match.

import { addDays } from "./hours";
import { intBetween, rng, seedFrom } from "./random";

export type DayMetrics = {
  date: string;
  calls: number;
  missedCalls: number;
  /** Bookings made via SMS/WhatsApp after a missed call */
  recovered: number;
  bookings: number;
  /** Handoffs from the AI front desk to a person */
  handoffs: number;
  /** Slots filled from the waiting list */
  waitlistFilled: number;
  /** Average same-day emergency waiting time (minutes). null on days with no same-day emergencies */
  emergencyAvgWait: number | null;
  emergencyPatients: number;
};

export type Totals = Omit<DayMetrics, "date" | "emergencyAvgWait"> & {
  emergencyAvgWait: number | null;
  recoveryRate: number;
};

export function dayMetrics(clinicKey: string, date: string, weekday: number): DayMetrics {
  const r = rng(seedFrom(`${clinicKey}|metrics|${date}`));
  const closed = weekday === 0;
  if (closed) {
    return { date, calls: 0, missedCalls: 0, recovered: 0, bookings: 0, handoffs: 0, waitlistFilled: 0, emergencyAvgWait: null, emergencyPatients: 0 };
  }
  const calls = intBetween(r, 28, 64);
  const missedCalls = intBetween(r, 3, Math.max(3, Math.floor(calls * 0.22)));
  const recovered = intBetween(r, 0, missedCalls);
  const bookings = intBetween(r, 9, 24) + recovered;
  const handoffs = intBetween(r, 1, 7);
  const waitlistFilled = intBetween(r, 0, 3);
  const emergencyPatients = intBetween(r, 0, 5);
  const emergencyAvgWait = emergencyPatients === 0 ? null : intBetween(r, 10, 40);
  return { date, calls, missedCalls, recovered, bookings, handoffs, waitlistFilled, emergencyAvgWait, emergencyPatients };
}

/** The past days days, including endDate */
export function periodMetrics(clinicKey: string, endDate: string, days: number): DayMetrics[] {
  const list: DayMetrics[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = addDays(endDate, -i);
    list.push(dayMetrics(clinicKey, d.date, d.weekday));
  }
  return list;
}

export function totals(list: DayMetrics[]): Totals {
  const sum = (k: keyof Omit<DayMetrics, "date" | "emergencyAvgWait">) => list.reduce((a, d) => a + d[k], 0);
  const emergencyPatients = sum("emergencyPatients");
  const waitWeighted = list.reduce((a, d) => a + (d.emergencyAvgWait ?? 0) * d.emergencyPatients, 0);
  const missedCalls = sum("missedCalls");
  const recovered = sum("recovered");
  return {
    calls: sum("calls"),
    missedCalls,
    recovered,
    bookings: sum("bookings"),
    handoffs: sum("handoffs"),
    waitlistFilled: sum("waitlistFilled"),
    emergencyPatients,
    emergencyAvgWait: emergencyPatients === 0 ? null : Math.round(waitWeighted / emergencyPatients),
    recoveryRate: missedCalls === 0 ? 0 : recovered / missedCalls,
  };
}
