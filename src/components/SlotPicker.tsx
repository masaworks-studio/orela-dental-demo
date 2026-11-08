"use client";

import Link from "next/link";
import { useState } from "react";
import type { Clinic } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { MESSAGES } from "@/i18n/messages";
import { formatTime, weekdayShort } from "@/lib/clinic/format";
import { nextFreeSlots } from "@/lib/clinic/slots";
import { clinicPath } from "./paths";
import { TierBadge } from "./TierBadge";
import { useClinicNow } from "./useNow";

export function SlotPicker({ clinic, lang }: { clinic: Clinic; lang: Locale }) {
  const now = useClinicNow(clinic.schedule.timeZone);
  const msg = MESSAGES[lang].book;
  const slots = now ? nextFreeSlots(clinic.key, clinic.schedule, now, { count: 4 }) : [];
  const [picked, setPicked] = useState(0);
  const chosen = slots[picked];
  const bookHref = clinicPath(clinic.region, lang, "book") + (chosen ? `?date=${chosen.date}&start=${chosen.start}` : "");

  return (
    <div className="card">
      <h2>
        {msg.heading} <TierBadge tier="growth" />
      </h2>
      {now && slots.length === 0 && <p>{msg.none}</p>}
      <div className="slots" role="group" aria-label={msg.pick}>
        {(now ? slots : [null, null, null, null]).map((s, i) =>
          s ? (
            <button key={`${s.date}-${s.start}`} type="button" className="slot" aria-pressed={i === picked} onClick={() => setPicked(i)}>
              {weekdayShort(s.weekday, clinic.region, lang, true)} {formatTime(s.start, clinic.region, lang)}
            </button>
          ) : (
            <span key={i} className="slot" aria-hidden="true">&nbsp;</span>
          ),
        )}
      </div>
      <Link className="btn" href={bookHref}>
        {msg.cta}
      </Link>
      <p className="small">{msg.sample}</p>
    </div>
  );
}
