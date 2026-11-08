"use client";

import { useState } from "react";
import { resolveWaitlist, type Reply, type WaitlistEntry } from "@/lib/clinic/waitlist";

type Bubble = { dir: "in" | "out" | "sys"; text: string };

/** Flow for the day-before reminder and passing last-minute cancellations to staff (US version, SMS) */
export function ReminderPhone() {
  const [step, setStep] = useState(0);
  const lines: Bubble[] = [
    { dir: "sys", text: "Mon 6:00 pm · day-before reminder" },
    { dir: "in", text: "Orela Dental: see you tomorrow, Tue 9:30 am, for your cleaning with Maria. Reply C to confirm or R to reschedule." },
    { dir: "out", text: "R" },
    { dir: "in", text: "Less than 24 h to go, so a person from our front desk will text you back shortly with new times." },
    { dir: "sys", text: "Handed to front desk · slot offered to waitlist" },
  ];
  return (
    <div>
      <div className="phone sms" aria-label="SMS reminder demo">
        {lines.slice(0, step + 2).map((b, i) => (
          <div key={i} className={b.dir === "sys" ? "sys" : `bubble${b.dir === "out" ? " out" : ""}`}>
            {b.text}
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-inline" style={{ marginTop: 12 }} disabled={step >= 3} onClick={() => setStep((s) => s + 1)}>
        Next step
      </button>
    </div>
  );
}

const ENTRIES: (WaitlistEntry & { label: string })[] = [
  { patientId: "a", label: "Ana · cleaning · Tue mornings", weekdays: [2], from: 540, to: 780, treatment: "cleaning", joinedAt: 1 },
  { patientId: "b", label: "Ben · cleaning · any weekday", weekdays: [1, 2, 3, 4, 5], from: 480, to: 1080, treatment: "cleaning", joinedAt: 2 },
  { patientId: "c", label: "Chloé · cleaning · afternoons only", weekdays: [2, 4], from: 900, to: 1200, treatment: "cleaning", joinedAt: 3 },
  { patientId: "d", label: "Dev · implant consult · Tue", weekdays: [2], from: 540, to: 1200, treatment: "implant", joinedAt: 0 },
];

/** Automatic waiting list notifications. Logic is in src/lib/clinic/waitlist.ts (tested) */
export function WaitlistDemo() {
  const slot = { id: "tue-1000", weekday: 2, start: 600, treatment: "cleaning" };
  const [replies, setReplies] = useState<Reply[]>([]);
  const result = resolveWaitlist(slot, ENTRIES, replies);
  const name = (id: string) => ENTRIES.find((e) => e.patientId === id)?.label.split(" · ")[0] ?? id;
  const reply = (patientId: string, answer: "yes" | "no") =>
    setReplies((r) => (r.some((x) => x.patientId === patientId) ? r : [...r, { patientId, answer, at: r.length + 1 }]));

  return (
    <div className="card" id="waitlist">
      <p>
        <strong>A cleaning on Tue 10:00 was cancelled.</strong> Who should hear about it?
      </p>
      <div className="rows">
        {ENTRIES.map((e) => {
          const notified = result.notified.includes(e.patientId);
          const r = replies.find((x) => x.patientId === e.patientId);
          return (
            <div key={e.patientId} className="row" style={{ alignItems: "center" }}>
              <span>
                {e.label}
                <br />
                <span className="small">{notified ? "Matches → message sent" : "Doesn't match → not messaged"}</span>
              </span>
              <span>
                {notified && !r && !result.bookedBy && (
                  <>
                    <button type="button" className="slot" onClick={() => reply(e.patientId, "yes")}>Yes</button>{" "}
                    <button type="button" className="slot" onClick={() => reply(e.patientId, "no")}>No</button>
                  </>
                )}
                {r && <span>{r.answer === "yes" ? "Replied yes" : "Replied no"}</span>}
              </span>
            </div>
          );
        })}
      </div>
      <p className="notice" aria-live="polite" style={{ marginTop: 16 }}>
        {result.bookedBy
          ? `Booked by ${name(result.bookedBy)} (first yes). ${result.releasedNotice.length ? `Told it's taken: ${result.releasedNotice.map(name).join(", ")}.` : ""}`
          : "Waiting for the first yes. Tap Yes or No for the people who were messaged."}
      </p>
      <button type="button" className="btn btn-inline btn-secondary" onClick={() => setReplies([])}>
        Reset
      </button>
    </div>
  );
}
