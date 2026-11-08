"use client";

import Link from "next/link";
import type { Clinic } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { fill, MESSAGES } from "@/i18n/messages";
import { emergencyQueue } from "@/lib/clinic/queue";
import { clinicPath } from "./paths";
import { TierBadge } from "./TierBadge";
import { statusText } from "./statusText";
import { useClinicNow } from "./useNow";

export function StatusStrip({ clinic, lang }: { clinic: Clinic; lang: Locale }) {
  const now = useClinicNow(clinic.schedule.timeZone);
  const msg = MESSAGES[lang];
  const status = now ? statusText(clinic.schedule, now, clinic.region, lang) : null;
  const queue = now ? emergencyQueue(clinic.key, clinic.schedule, now) : null;

  return (
    <div className="strip" role="region" aria-label={msg.hours}>
      <div className="wrap">
        <div className="strip-group">
          <span className={`status${status?.open ? " is-open" : ""}`} aria-live="polite">
            <span className="dot" aria-hidden="true" />
            <span>{status?.title ?? " "}</span>
            <span className="sub">{status?.sub}</span>
          </span>
          <TierBadge tier="starter" />
          {queue?.accepting && (
            <Link href={clinicPath(clinic.region, lang, "emergency")}>
              {msg.emergency.strip}: {fill(msg.emergency.waiting, { n: queue.waiting })} · {fill(msg.emergency.wait, { m: queue.estimatedMinutes })}
            </Link>
          )}
          {queue?.accepting && <TierBadge tier="pro" />}
        </div>
        <span>
          {clinic.address} · <a href={clinic.phoneHref}>{clinic.phone}</a>
        </span>
      </div>
    </div>
  );
}
