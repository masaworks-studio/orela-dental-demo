"use client";

import { useState } from "react";

const STEPS = [
  { at: "10:42:05", phone: "Incoming call · (713) 555-0187", note: "Front desk is with a patient. Nobody picks up." },
  { at: "10:42:35", phone: "Missed call", note: "The phone system reports a missed call (webhook)." },
  { at: "10:42:41", phone: "SMS: Sorry we missed your call! Book a time here: orela.example/book — or reply and we'll call you back.", note: "Within seconds the caller gets a booking link. If the number is already a patient, the message uses their name." },
  { at: "10:44:10", phone: "Booked: Wed 9:30 am, first visit", note: "The booking is written to the CRM once. Follow-up texts stop, so nobody gets chased after booking." },
];

/** Missed call follow-up. Uses no real calls or SMS; shows the flow step by step */
export function MissedCallDemo() {
  const [step, setStep] = useState(0);
  return (
    <div className="hero" style={{ paddingTop: 8 }}>
      <div className="phone sms" aria-live="polite" aria-label="Phone screen demo">
        {STEPS.slice(0, step + 1).map((s, i) => (
          <div key={i} className={i === 2 || i === 3 ? "bubble" : "sys"}>
            {s.phone}
          </div>
        ))}
      </div>
      <div>
        <ol className="prose" style={{ paddingLeft: 20 }}>
          {STEPS.map((s, i) => (
            <li key={i} style={{ opacity: i <= step ? 1 : 0.45, marginBottom: 12 }}>
              <span className="small">{s.at}</span>
              <br />
              {s.note}
            </li>
          ))}
        </ol>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn btn-inline" disabled={step >= STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>
            Next step
          </button>
          <button type="button" className="btn btn-inline btn-secondary" onClick={() => setStep(0)}>
            Restart
          </button>
        </div>
        <p className="small">The number is from the 555-01xx range reserved for fiction. No call or SMS is made.</p>
      </div>
    </div>
  );
}
