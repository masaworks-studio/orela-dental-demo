"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Clinic, Treatment } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { fill, MESSAGES } from "@/i18n/messages";
import { step, MENU, type FlowEvent, type FlowState, type Reply } from "@/lib/clinic/chat-flow";
import { formatShortDate, formatTime, weekdayShort } from "@/lib/clinic/format";
import type { Slot } from "@/lib/clinic/types";
import { ANSWERS, answerLine, decide } from "./assistant";
import { clinicPath } from "./paths";
import { TierBadge } from "./TierBadge";
import { useClinicNow } from "./useNow";

type Button = { label: string; event: FlowEvent };
type Bubble = {
  from: "clinic" | "me";
  text: string;
  /** Reply buttons (WhatsApp rules: up to 3, up to 20 characters) */
  buttons?: Button[];
  /** List (WhatsApp rules: opens from one button, up to 10 rows, up to 24 characters) */
  list?: { button: string; rows: Button[] };
  link?: { href: string; label: string };
};

// Cut text that is too long, to follow WhatsApp rules (short forms are used before this point, so it is not normally cut)
const clip = (t: string, n: number) => (t.length <= n ? t : `${t.slice(0, n - 1)}…`);

export type SimTreatment = Pick<Treatment, "slug" | "name" | "priceFrom" | "bookable">;

/**
 * Simulator for WhatsApp (Spain version) / SMS (US version). It sends nothing.
 * Conversation logic is in src/lib/clinic/chat-flow.ts (tested); free-text routing is the same as the AI front desk.
 */
export function MessagingSimulator({
  clinic,
  lang,
  treatments,
  languages,
  onClose,
}: {
  clinic: Clinic;
  lang: Locale;
  treatments: SimTreatment[];
  languages: Locale[];
  onClose?: () => void;
}) {
  const msg = MESSAGES[lang];
  const wa = msg.wa;
  const now = useClinicNow(clinic.schedule.timeZone);
  const [state, setState] = useState<FlowState>({ step: "menu" });
  const [log, setLog] = useState<Bubble[]>([]);
  const [input, setInput] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const bookable = treatments.filter((t) => t.bookable);
  const nameOf = (slug: string) => treatments.find((t) => t.slug === slug)?.name[lang] ?? slug;
  const rowName = (slug: string) => clip(slug === "checkup" ? wa.checkupShort : nameOf(slug), 24);
  const slotLabel = (s: Slot) => `${weekdayShort(s.weekday, clinic.region, lang, true)} ${formatShortDate(s.date, clinic.region)} · ${formatTime(s.start, clinic.region, lang)}`;
  const [sheet, setSheet] = useState<number | null>(null);
  const assistant = { clinic, lang, treatments, languages };
  const isSms = clinic.messaging === "sms";

  function render(r: Reply, aiReply?: string): Bubble {
    switch (r.kind) {
      case "welcome":
        return { from: "clinic", text: fill(wa.welcome, { clinic: clinic.name }) };
      case "menu":
        return { from: "clinic", text: wa.hint, list: { button: wa.viewOptions, rows: MENU.map((id) => ({ label: clip(wa.menu[id], 24), event: { type: "menu", id } })) } };
      case "treatments":
        return { from: "clinic", text: wa.pickTreatment, list: { button: wa.viewOptions, rows: r.options.slice(0, 10).map((slug) => ({ label: rowName(slug), event: { type: "treatment", slug } })) } };
      case "slots":
        return {
          from: "clinic",
          text: fill(wa.pickSlot, { treatment: nameOf(r.treatment) }),
          buttons: r.slots.slice(0, 3).map((slot) => ({ label: clip(slotLabel(slot), 20), event: { type: "slot", slot } })),
        };
      case "noSlots":
        return { from: "clinic", text: wa.noSlots, link: { href: clinic.phoneHref, label: `${msg.call} ${clinic.phone}` } };
      case "askName":
        return { from: "clinic", text: fill(wa.askName, { treatment: nameOf(r.treatment), slot: slotLabel(r.slot) }) };
      case "booked":
        return { from: "clinic", text: fill(wa.booked, { treatment: nameOf(r.treatment), slot: slotLabel(r.slot), name: r.name }) };
      case "queue":
        return {
          from: "clinic",
          text: r.status.accepting
            ? fill(wa.queueOpen, { n: r.status.waiting, m: r.status.estimatedMinutes })
            : r.status.reason === "closed"
              ? msg.emergency.closed
              : msg.emergency.closingSoon,
          link: { href: clinicPath(clinic.region, lang, "emergency"), label: msg.emergency.take },
        };
      case "location":
        return {
          from: "clinic",
          text: fill(ANSWERS.location[lang], { address: clinic.address }),
          link: { href: clinicPath(clinic.region, lang, "contact"), label: wa.seeMap },
        };
      case "handoff":
        return { from: "clinic", text: ANSWERS[r.reason === "change" ? "cancel" : r.reason][lang] };
      case "answer":
        return { from: "clinic", ...answerLine(r.route, assistant, aiReply) };
    }
  }

  function apply(event: FlowEvent, echo?: string) {
    if (!now) return;
    const out = step(state, event, { clinicKey: clinic.key, schedule: clinic.schedule, now, treatments: bookable.map((t) => t.slug) });
    setState(out.state);
    setLog((l) => [...l, ...(echo ? [{ from: "me" as const, text: echo }] : []), ...out.replies.map((x) => render(x))]);
  }

  // When opened, show a greeting and the menu
  useEffect(() => {
    if (now && log.length === 0) apply({ type: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  useEffect(() => {
    if (log.length > 2) end.current?.scrollIntoView({ block: "nearest" });
  }, [log]);

  const lastWithButtons = log.map((b, i) => (b.buttons || b.list ? i : -1)).reduce((a, b) => Math.max(a, b), -1);
  const choose = (btn: Button) => {
    setSheet(null);
    apply(btn.event, btn.label);
  };

  async function sendText(text: string) {
    const clean = text.trim();
    if (!clean || !now) return;
    setInput("");
    // When asking for a name, treat the input as the name; otherwise route it the same way as the AI front desk (the API, or the same rules)
    if (state.step === "askName") return apply({ type: "text", text: clean }, clean);
    // A reply that is only a number, such as "2", is taken as the number of an option from the previous message (the usual SMS pattern)
    const last = lastWithButtons >= 0 ? log[lastWithButtons] : undefined;
    const options = last?.buttons ?? last?.list?.rows;
    if (options && /^\d{1,2}$/.test(clean)) {
      const picked = options[Number(clean) - 1];
      if (picked) {
        setInput("");
        return apply(picked.event, clean);
      }
    }
    setLog((l) => [...l, { from: "me", text: clean }]);
    const { route, reply } = await decide(clean, lang, clinic.region);
    if (!now) return;
    const out = step(state, { type: "text", text: clean, route }, { clinicKey: clinic.key, schedule: clinic.schedule, now, treatments: bookable.map((t) => t.slug) });
    setState(out.state);
    setLog((l) => [...l, ...out.replies.map((x) => render(x, reply))]);
  }


  return (
    <div className={`sim${isSms ? " sim-sms" : ""}`} role="region" aria-label={isSms ? wa.sms : wa.whatsapp}>
      <div className="sim-head">
        <span className="sim-avatar" aria-hidden="true">
          O
        </span>
        <span className="sim-title">
          <strong>{clinic.name}</strong>
          <span>{wa.status}</span>
        </span>
        <TierBadge tier="growth" />
        {onClose && (
          <button type="button" className="sim-close" onClick={onClose} aria-label={wa.close}>
            ✕
          </button>
        )}
      </div>
      <p className="sim-demo">{isSms ? wa.demoSms : wa.demo}</p>
      <div className="sim-log" aria-live="polite">
        {log.map((b, i) => (
          <div key={i} className={`sim-bubble ${b.from}`}>
            {b.text}
            {b.link && (
              <>
                {"\n"}
                {b.link.href.startsWith("tel:") ? <a href={b.link.href}>{b.link.label}</a> : <Link href={b.link.href}>{b.link.label}</Link>}
              </>
            )}
            {isSms && (b.buttons || b.list) && (
              <span className="sim-buttons">
                {(b.buttons ?? b.list!.rows).map((btn, n) => (
                  <button key={btn.label} type="button" className="sim-sms-option" disabled={i !== lastWithButtons} onClick={() => choose(btn)}>
                    {n + 1}. {btn.label}
                  </button>
                ))}
                <span className="wa-note">SMS · no buttons · reply with a number</span>
              </span>
            )}
            {!isSms && b.buttons && (
              <span className="sim-buttons">
                {b.buttons.map((btn) => (
                  <button key={btn.label} type="button" disabled={i !== lastWithButtons} onClick={() => choose(btn)}>
                    {btn.label}
                  </button>
                ))}
                <span className="wa-note">Reply buttons · max 3 · 20 chars</span>
              </span>
            )}
            {!isSms && b.list && (
              <span className="sim-buttons">
                <button type="button" className="sim-list-open" disabled={i !== lastWithButtons} onClick={() => setSheet(i)}>
                  ☰ {b.list.button}
                </button>
                <span className="wa-note">List message · max 10 rows · 24 chars</span>
              </span>
            )}
          </div>
        ))}
        <div ref={end} />
      </div>
      {sheet !== null && log[sheet]?.list && (
        <div className="sim-sheet" role="dialog" aria-label={log[sheet].text}>
          <div className="sim-sheet-head">
            <button type="button" className="sim-close" onClick={() => setSheet(null)} aria-label={wa.close}>
              ✕
            </button>
            <strong>{log[sheet].list!.button}</strong>
          </div>
          {log[sheet].list!.rows.map((row) => (
            <button key={row.label} type="button" className="sim-row" onClick={() => choose(row)}>
              {row.label}
            </button>
          ))}
        </div>
      )}
      <form
        className="sim-input"
        onSubmit={(e) => {
          e.preventDefault();
          void sendText(input);
        }}
      >
        <label className="visually-hidden" htmlFor={`sim-input-${clinic.region}`}>
          {wa.placeholder}
        </label>
        <input id={`sim-input-${clinic.region}`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={wa.placeholder} autoComplete="off" maxLength={300} />
        <button type="submit" aria-label={msg.chat.send}>
          ➤
        </button>
      </form>
    </div>
  );
}
