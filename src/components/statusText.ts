import { formatTime, weekdayShort, type Locale } from "@/lib/clinic/format";
import { openStatus, splitMinutes } from "@/lib/clinic/hours";
import type { ClinicSchedule, LocalTime, RegionId } from "@/lib/clinic/types";
import { fill, MESSAGES } from "@/i18n/messages";

/** Builds text such as "Open now / Closes in 1 h 5 min" */
export function statusText(schedule: ClinicSchedule, now: LocalTime, region: RegionId, lang: Locale) {
  const m = MESSAGES[lang].status;
  const s = openStatus(schedule, now);
  if (s.state === "open") {
    const { h, m: mm } = splitMinutes(s.minutesLeft);
    const left = s.minutesLeft <= 90 ? fill(m.closesIn, { t: h ? `${h} h ${mm} min` : `${mm} min` }) : fill(m.closesAt, { t: formatTime(s.closesAt, region, lang) });
    return { open: true, title: m.open, sub: left };
  }
  if (!s.next) return { open: false, title: m.closed, sub: "" };
  const t = formatTime(s.next.opensAt, region, lang);
  const sub =
    s.next.daysAhead === 0
      ? fill(m.opensToday, { t })
      : s.next.daysAhead === 1
        ? fill(m.opensTomorrow, { t })
        : fill(m.opensOn, { d: weekdayShort(s.next.weekday, region, lang), t });
  return { open: false, title: m.closed, sub };
}
