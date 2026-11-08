// Automatic waiting list notifications. Notifies only people who match a cancelled slot,
// and confirms the first person to reply "yes". The rest are told "the slot has been taken".

export type OpenedSlot = { id: string; weekday: number; start: number; treatment: string };

export type WaitlistEntry = {
  patientId: string;
  /** Weekdays they can come */
  weekdays: number[];
  /** Time range they can come (minutes) */
  from: number;
  to: number;
  /** Treatment they want */
  treatment: string;
  /** Order of joining the waiting list (lower is earlier) */
  joinedAt: number;
};

export type Reply = { patientId: string; answer: "yes" | "no"; at: number };

export type WaitlistResult = {
  notified: string[];
  bookedBy: string | null;
  /** People to tell "the slot has been taken" */
  releasedNotice: string[];
};

/** Lists people who match the slot (weekday, time, treatment) in the order they joined */
export function matchingEntries(slot: OpenedSlot, entries: WaitlistEntry[], slotLength = 30): WaitlistEntry[] {
  return entries
    .filter(
      (e) =>
        e.treatment === slot.treatment &&
        e.weekdays.includes(slot.weekday) &&
        slot.start >= e.from &&
        slot.start + slotLength <= e.to,
    )
    .sort((a, b) => a.joinedAt - b.joinedAt);
}

/** Decides whom to notify, then who is confirmed from the replies */
export function resolveWaitlist(
  slot: OpenedSlot,
  entries: WaitlistEntry[],
  replies: Reply[],
  maxNotified = 5,
): WaitlistResult {
  const notified = matchingEntries(slot, entries)
    .slice(0, maxNotified)
    .map((e) => e.patientId);
  const firstYes = replies
    .filter((r) => r.answer === "yes" && notified.includes(r.patientId))
    .sort((a, b) => a.at - b.at || notified.indexOf(a.patientId) - notified.indexOf(b.patientId))[0];
  const bookedBy = firstYes?.patientId ?? null;
  const declined = new Set(replies.filter((r) => r.answer === "no").map((r) => r.patientId));
  const releasedNotice = bookedBy ? notified.filter((id) => id !== bookedBy && !declined.has(id)) : [];
  return { notified, bookedBy, releasedNotice };
}
