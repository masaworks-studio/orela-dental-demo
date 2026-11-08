"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Clinic, Treatment } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { fill, MESSAGES } from "@/i18n/messages";
import { formatShortDate, formatTime, weekdayShort } from "@/lib/clinic/format";
import { nextFreeSlots } from "@/lib/clinic/slots";
import type { Slot } from "@/lib/clinic/types";
import { TierBadge } from "./TierBadge";
import { buildBookingPayload } from "@/lib/clinic/booking-payload";
import { PayloadPreview } from "./PayloadPreview";
import { useClinicNow } from "./useNow";

type T = Pick<Treatment, "slug" | "name" | "bookable" | "minutes">;

/** Booking flow (treatment -> time -> contact details -> confirm). Sends nothing anywhere */
export function BookingFlow({ clinic, lang, treatments }: { clinic: Clinic; lang: Locale; treatments: T[] }) {
  const msg = MESSAGES[lang];
  const params = useSearchParams();
  const now = useClinicNow(clinic.schedule.timeZone);
  const slots = now ? nextFreeSlots(clinic.key, clinic.schedule, now, { count: 8 }) : [];
  const preset = params.get("date") && params.get("start") ? `${params.get("date")}|${params.get("start")}` : "";

  const [step, setStep] = useState(1);
  const [treatment, setTreatment] = useState("checkup");
  const [slotKey, setSlotKey] = useState(preset);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  const key = (s: Slot) => `${s.date}|${s.start}`;
  const label = (k: string) => {
    const [date, start] = k.split("|");
    const wd = new Date(`${date}T12:00:00Z`).getUTCDay();
    return `${weekdayShort(wd, clinic.region, lang, true)} ${formatShortDate(date, clinic.region)} · ${formatTime(Number(start), clinic.region, lang)}`;
  };
  const options = slotKey && !slots.some((s) => key(s) === slotKey) ? [slotKey, ...slots.map(key)] : slots.map(key);
  const tName = treatments.find((t) => t.slug === treatment)?.name[lang] ?? "";

  if (done) {
    return (
      <div className="card">
        <h2>{msg.form.submit}</h2>
        <p>
          {tName} · {label(slotKey)}
        </p>
        <p className="notice">{msg.form.sentNot}</p>
        <PayloadPreview
          payload={buildBookingPayload({
            clinicKey: clinic.key,
            timeZone: clinic.schedule.timeZone,
            date: slotKey.split("|")[0],
            start: Number(slotKey.split("|")[1]),
            minutes: treatments.find((t) => t.slug === treatment)?.minutes ?? 30,
            treatment,
            name,
            phone,
            lang,
            channel: "web",
          })}
        />
      </div>
    );
  }

  return (
    <form
      className="card"
      onSubmit={(e) => {
        e.preventDefault();
        if (step < 3) setStep(step + 1);
        else setDone(true);
      }}
    >
      <p className="small">
        {fill(msg.form.step, { n: step })} <TierBadge tier="growth" />
      </p>
      {step === 1 && (
        <div className="field">
          <label htmlFor="treatment">{msg.form.treatment}</label>
          <select id="treatment" value={treatment} onChange={(e) => setTreatment(e.target.value)}>
            {treatments.filter((t) => t.bookable).map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name[lang]}
              </option>
            ))}
          </select>
        </div>
      )}
      {step === 2 && (
        <fieldset className="field" style={{ border: 0, padding: 0, margin: "0 0 14px" }}>
          <legend style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{msg.form.time}</legend>
          <div className="slots">
            {options.map((k) => (
              <button key={k} type="button" className="slot" aria-pressed={k === slotKey} onClick={() => setSlotKey(k)}>
                {label(k)}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {step === 3 && (
        <>
          <div className="field">
            <label htmlFor="name">{msg.form.name}</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" required />
          </div>
          <div className="field">
            <label htmlFor="phone">{msg.form.phone}</label>
            <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="off" required />
          </div>
          <p className="small">
            {tName} · {slotKey ? label(slotKey) : ""}
          </p>
        </>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        {step > 1 && (
          <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)}>
            {msg.form.back}
          </button>
        )}
        <button type="submit" className="btn" disabled={step === 2 && !slotKey}>
          {step < 3 ? msg.form.next : msg.form.submit}
        </button>
      </div>
      <p className="small">{msg.book.sample}</p>
    </form>
  );
}
