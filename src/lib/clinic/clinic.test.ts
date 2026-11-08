import { describe, expect, it } from "vitest";
import { addDays, openStatus, toLocal } from "./hours";
import { isBooked, nextFreeSlots } from "./slots";
import { emergencyQueue, estimateWait } from "./queue";
import { matchingEntries, resolveWaitlist, type WaitlistEntry } from "./waitlist";
import { classify, route } from "./receptionist";
import { formatPrice, formatShortDate, formatTime, weekdayShort } from "./format";
import { MESSAGES } from "@/i18n/messages";
import { periodMetrics, totals } from "./metrics";
import type { ClinicSchedule, LocalTime } from "./types";

const h = (hh: number, mm = 0) => hh * 60 + mm;

// Weekdays 9:00–14:00 and 15:00–19:00, Saturday 10:00–14:00, closed Sunday
const schedule: ClinicSchedule = {
  timeZone: "Europe/Madrid",
  weekly: {
    1: [{ start: h(9), end: h(14) }, { start: h(15), end: h(19) }],
    2: [{ start: h(9), end: h(14) }, { start: h(15), end: h(19) }],
    3: [{ start: h(9), end: h(14) }, { start: h(15), end: h(19) }],
    4: [{ start: h(9), end: h(14) }, { start: h(15), end: h(19) }],
    5: [{ start: h(9), end: h(14) }, { start: h(15), end: h(19) }],
    6: [{ start: h(10), end: h(14) }],
  },
  closedDates: ["2026-12-25"],
};

// 2026-11-09 is a Monday
const at = (date: string, weekday: LocalTime["weekday"], minutes: number): LocalTime => ({ date, weekday, minutes });

describe("hours", () => {
  it("when open, returns the minutes until closing", () => {
    expect(openStatus(schedule, at("2026-11-09", 1, h(13, 59)))).toEqual({ state: "open", closesAt: h(14), minutesLeft: 1 });
  });

  it("closed at lunchtime, opens in the afternoon of the same day", () => {
    const s = openStatus(schedule, at("2026-11-09", 1, h(14, 0)));
    expect(s).toEqual({ state: "closed", next: { date: "2026-11-09", weekday: 1, daysAhead: 0, opensAt: h(15) } });
  });

  it("after closing on Saturday, skips Sunday and opens on Monday", () => {
    const s = openStatus(schedule, at("2026-11-14", 6, h(14, 30)));
    expect(s.state === "closed" && s.next).toEqual({ date: "2026-11-16", weekday: 1, daysAhead: 2, opensAt: h(9) });
  });

  it("skips closed days (Christmas)", () => {
    const s = openStatus(schedule, at("2026-12-24", 4, h(20)));
    expect(s.state === "closed" && s.next?.date).toBe("2026-12-26");
  });

  it("conversion to local time accounts for DST (the day Madrid's summer time ends)", () => {
    // 2026-10-25 01:30 UTC is after summer time ends, so 2:30 local
    expect(toLocal(new Date("2026-10-25T01:30:00Z"), "Europe/Madrid")).toEqual({ date: "2026-10-25", weekday: 0, minutes: h(2, 30) });
    // 2026-07-01 12:00 UTC is during summer time, so 14:00 local
    expect(toLocal(new Date("2026-07-01T12:00:00Z"), "Europe/Madrid").minutes).toBe(h(14));
  });

  it("date addition crosses month boundaries", () => {
    expect(addDays("2026-11-30", 1)).toEqual({ date: "2026-12-01", weekday: 2 });
  });
});

describe("slots", () => {
  const now = at("2026-11-09", 1, h(10));

  it("does not show slots outside opening hours, at lunchtime or too soon", () => {
    const slots = nextFreeSlots("test", schedule, now, { count: 30, busyRate: 0 });
    for (const s of slots) {
      const day = schedule.weekly[s.weekday as 1]!;
      expect(day.some((i) => s.start >= i.start && s.start + 30 <= i.end)).toBe(true);
      if (s.date === now.date) expect(s.start).toBeGreaterThanOrEqual(now.minutes + 90);
    }
    expect(slots.some((s) => s.start === h(14))).toBe(false);
  });

  it("same inputs always give the same slots", () => {
    expect(nextFreeSlots("test", schedule, now)).toEqual(nextFreeSlots("test", schedule, now));
  });

  it("does not show booked slots", () => {
    for (const s of nextFreeSlots("test", schedule, now, { count: 10 })) {
      expect(isBooked("test", s.date, s.start, 0.6)).toBe(false);
    }
  });
});

describe("queue", () => {
  it("waiting time is 20 minutes per person, rounded up to 5 minutes", () => {
    expect(estimateWait(0)).toBe(0);
    expect(estimateWait(2)).toBe(40);
    expect(estimateWait(3, { minutesPerPatient: 12, cutoffMinutes: 45, parallel: 2 })).toBe(25);
  });

  it("does not accept patients when closed or from 45 minutes before closing", () => {
    expect(emergencyQueue("t", schedule, at("2026-11-08", 0, h(11)))).toEqual({ accepting: false, reason: "closed" });
    expect(emergencyQueue("t", schedule, at("2026-11-09", 1, h(18, 20)))).toEqual({ accepting: false, reason: "closing-soon" });
  });

  it("when open, 0–4 people, and the waiting time matches the count", () => {
    const q = emergencyQueue("t", schedule, at("2026-11-09", 1, h(10, 5)));
    expect(q.accepting).toBe(true);
    if (q.accepting) {
      expect(q.waiting).toBeGreaterThanOrEqual(0);
      expect(q.waiting).toBeLessThanOrEqual(4);
      expect(q.estimatedMinutes).toBe(estimateWait(q.waiting));
    }
  });
});

describe("waitlist", () => {
  const slot = { id: "s1", weekday: 2, start: h(10), treatment: "cleaning" };
  const entries: WaitlistEntry[] = [
    { patientId: "late", weekdays: [2], from: h(9), to: h(12), treatment: "cleaning", joinedAt: 3 },
    { patientId: "early", weekdays: [1, 2], from: h(9), to: h(19), treatment: "cleaning", joinedAt: 1 },
    { patientId: "wrong-day", weekdays: [4], from: h(9), to: h(19), treatment: "cleaning", joinedAt: 0 },
    { patientId: "wrong-time", weekdays: [2], from: h(15), to: h(19), treatment: "cleaning", joinedAt: 0 },
    { patientId: "wrong-treatment", weekdays: [2], from: h(9), to: h(19), treatment: "implant", joinedAt: 0 },
    { patientId: "too-short", weekdays: [2], from: h(9), to: h(10, 15), treatment: "cleaning", joinedAt: 0 },
  ];

  it("picks only matching people, in the order they joined", () => {
    expect(matchingEntries(slot, entries).map((e) => e.patientId)).toEqual(["early", "late"]);
  });

  it("confirms the first person to reply \"yes\" and tells the rest the slot is taken", () => {
    const r = resolveWaitlist(slot, entries, [
      { patientId: "late", answer: "yes", at: 5 },
      { patientId: "early", answer: "yes", at: 9 },
    ]);
    expect(r).toEqual({ notified: ["early", "late"], bookedBy: "late", releasedNotice: ["early"] });
  });

  it("for simultaneous replies, the person who joined the waiting list first wins", () => {
    const r = resolveWaitlist(slot, entries, [
      { patientId: "late", answer: "yes", at: 5 },
      { patientId: "early", answer: "yes", at: 5 },
    ]);
    expect(r.bookedBy).toBe("early");
  });

  it("ignores replies from people not notified, and does not send \"slot taken\" to people who said \"no\"", () => {
    const r = resolveWaitlist(slot, entries, [
      { patientId: "wrong-day", answer: "yes", at: 1 },
      { patientId: "early", answer: "no", at: 2 },
      { patientId: "late", answer: "yes", at: 3 },
    ]);
    expect(r.bookedBy).toBe("late");
    expect(r.releasedNotice).toEqual([]);
  });

  it("if nobody says \"yes\", the slot stays free", () => {
    expect(resolveWaitlist(slot, entries, []).bookedBy).toBeNull();
  });
});

describe("receptionist", () => {
  it("stops symptom talk before anything else and points to the phone", () => {
    expect(route("I want to book, my tooth hurts")).toEqual({ intent: "symptom", action: "redirect-phone" });
    expect(classify("Me duele una muela")).toBe("symptom");
    expect(classify("Em fa mal la dent")).toBe("symptom");
    expect(classify("J'ai mal aux dents")).toBe("symptom");
    expect(classify("my gum is bleeding")).toBe("symptom");
  });

  it("routes requests in 4 languages", () => {
    expect(classify("How much is a cleaning?")).toBe("prices");
    expect(classify("¿Cuánto cuesta una limpieza?")).toBe("prices");
    expect(classify("A qué hora abren el sábado?")).toBe("hours");
    expect(classify("On és la clínica?")).toBe("location");
    expect(classify("Je voudrais un rendez-vous")).toBe("booking");
    expect(classify("Do you take Medicaid?")).toBe("insurance");
    expect(classify("I need to cancel my appointment")).toBe("cancel");
  });

  it("sends urgent cases to same-day emergency and hands unknown questions to a person", () => {
    expect(route("Is there a same-day emergency slot?").action).toBe("open-emergency");
    expect(route("Can I bring my dog?").action).toBe("handoff");
    expect(route("").intent).toBe("unknown");
  });

  it("matches short words as whole words (hi does not match this)", () => {
    expect(classify("is this the clinic")).toBe("unknown");
  });
});

describe("format", () => {
  it("formats currency for the language", () => {
    expect(formatPrice(65, "es", "es")).toBe("65 €");
    expect(formatPrice(65, "es", "en")).toBe("€65");
    expect(formatPrice(1150, "es", "fr")).toMatch(/^1\s?150 €$/);
    expect(formatPrice(39, "us", "en")).toBe("$39");
  });

  it("writes \"9 h 30\" in French", () => {
    expect(formatTime(h(9), "es", "fr")).toBe("9 h");
    expect(formatTime(h(9, 30), "es", "fr")).toBe("9 h 30");
  });

  it("uses the 12-hour clock only in the US", () => {
    expect(formatTime(h(9, 30), "es", "ca")).toBe("9:30");
    expect(formatTime(h(17), "us", "en")).toBe("5 pm");
    expect(formatTime(h(12, 15), "us", "es")).toBe("12:15 pm");
    expect(formatTime(h(0, 5), "us", "en")).toBe("12:05 am");
  });
});

describe("weekday names", () => {
  it("lower case mid-sentence as the language requires, upper case only at the start; drops the trailing full stop", () => {
    expect(weekdayShort(1, "es", "es")).toBe("lun");
    expect(weekdayShort(1, "es", "es", true)).toBe("Lun");
    expect(weekdayShort(2, "es", "ca", true)).toBe("Dt");
    expect(weekdayShort(0, "us", "en")).toBe("Sun");
  });
});

describe("metrics", () => {
  const list = periodMetrics("t", "2026-11-08", 30);

  it("builds one entry per day in the range, with 0 on Sundays", () => {
    expect(list).toHaveLength(30);
    expect(list.filter((d) => d.calls === 0).length).toBeGreaterThanOrEqual(4);
  });

  it("totals match the breakdown, and recovered bookings never exceed missed calls", () => {
    const t = totals(list);
    expect(t.calls).toBe(list.reduce((a, d) => a + d.calls, 0));
    expect(t.recovered).toBeLessThanOrEqual(t.missedCalls);
    for (const d of list) {
      expect(d.missedCalls).toBeLessThanOrEqual(d.calls);
      expect(d.recovered).toBeLessThanOrEqual(d.missedCalls);
    }
    expect(t.recoveryRate).toBeCloseTo(t.recovered / t.missedCalls);
  });
});

describe("WhatsApp-style labels", () => {
  it("short dates are day/month in Spain and month/day in the US", () => {
    expect(formatShortDate("2026-11-09", "es")).toBe("09/11");
    expect(formatShortDate("2026-11-09", "us")).toBe("11/09");
  });

  it("list rows (menu, short first-visit names) are 24 characters or fewer; the list button is 20 or fewer", () => {
    for (const lang of ["en", "es", "ca", "fr"] as const) {
      const wa = MESSAGES[lang].wa;
      for (const label of Object.values(wa.menu)) expect(label.length, `${lang}: ${label}`).toBeLessThanOrEqual(24);
      expect(wa.checkupShort.length).toBeLessThanOrEqual(24);
      expect(wa.viewOptions.length).toBeLessThanOrEqual(20);
    }
  });

  it("free-slot reply buttons are 20 characters or fewer (even the longest US form)", () => {
    const label = `${weekdayShort(3, "us", "es", true)} ${formatShortDate("2026-12-30", "us")} · ${formatTime(h(12, 30), "us", "es")}`;
    expect(label.length).toBeLessThanOrEqual(20);
  });
});
