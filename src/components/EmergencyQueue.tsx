"use client";

import { useState } from "react";
import type { Clinic } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { fill, MESSAGES } from "@/i18n/messages";
import { emergencyQueue } from "@/lib/clinic/queue";
import { TierBadge } from "./TierBadge";
import { useClinicNow } from "./useNow";

export function EmergencyQueue({ clinic, lang }: { clinic: Clinic; lang: Locale }) {
  const now = useClinicNow(clinic.schedule.timeZone);
  const msg = MESSAGES[lang].emergency;
  const [ticket, setTicket] = useState<number | null>(null);
  const q = now ? emergencyQueue(clinic.key, clinic.schedule, now) : null;

  return (
    <div className="card" aria-live="polite">
      <p style={{ margin: "0 0 8px" }}>
        <TierBadge tier="pro" />
      </p>
      {!q && <p>&nbsp;</p>}
      {q && !q.accepting && <p>{q.reason === "closed" ? msg.closed : msg.closingSoon}</p>}
      {q?.accepting && (
        <>
          <div className="big-number">{fill(msg.waiting, { n: q.waiting })}</div>
          <p className="muted">{fill(msg.wait, { m: q.estimatedMinutes })}</p>
          {ticket === null ? (
            <button type="button" className="btn" onClick={() => setTicket(q.waiting + 1)}>
              {msg.take}
            </button>
          ) : (
            <p className="notice">{fill(msg.taken, { n: ticket })}</p>
          )}
        </>
      )}
      <p className="small">{fill(msg.notDiagnosis, { sos: clinic.sos })}</p>
    </div>
  );
}
