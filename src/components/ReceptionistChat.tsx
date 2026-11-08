"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Clinic, Treatment } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { MESSAGES } from "@/i18n/messages";
import { answerLine, decide, SUGGESTIONS } from "./assistant";
import { TierBadge } from "./TierBadge";

type Line = { from: "bot" | "me"; text: string; link?: { href: string; label: string }; ai?: boolean };


export function ReceptionistChat({
  clinic,
  lang,
  treatments,
  languages,
  inline = false,
}: {
  clinic: Clinic;
  lang: Locale;
  treatments: Pick<Treatment, "name" | "priceFrom" | "slug">[];
  languages: Locale[];
  /** On the demo page, keep it open inside the page */
  inline?: boolean;
}) {
  const msg = MESSAGES[lang];
  const [open, setOpen] = useState(inline);
  const [input, setInput] = useState("");
  const [log, setLog] = useState<Line[]>([{ from: "bot", text: msg.chat.intro }]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (log.length > 1) end.current?.scrollIntoView({ block: "nearest" });
  }, [log]);


  async function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setLog((l) => [...l, { from: "me", text: clean }]);
    setInput("");
    const { route: r, reply } = await decide(clean, lang, clinic.region);
    setLog((l) => [...l, { from: "bot", ...answerLine(r, { clinic, lang, treatments, languages }, reply) }]);
  }

  return (
    <>
      {!inline && (
        <button type="button" className="fab fab-chat" aria-expanded={open} aria-label={msg.chat.open} onClick={() => setOpen((o) => !o)}>
          {open ? (
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
              <circle cx="8" cy="11" r="1.4" fill="var(--accent)" />
              <circle cx="12" cy="11" r="1.4" fill="var(--accent)" />
              <circle cx="16" cy="11" r="1.4" fill="var(--accent)" />
            </svg>
          )}
          <span className="fab-label">{msg.chat.open}</span>
        </button>
      )}
      {open && (
        <div className={inline ? "chat-panel chat-inline" : "chat-panel"} role={inline ? "region" : "dialog"} aria-label={msg.chat.title}>
          <div className="chat-head">
            <strong>
              {msg.chat.title} <TierBadge tier="pro" />
            </strong>
            {!inline && (
              <button type="button" className="icon-btn" aria-label="Close" onClick={() => setOpen(false)}>
                ✕
              </button>
            )}
          </div>
          <div className="chat-log" aria-live="polite">
            {log.map((line, i) => (
              <div key={i} className={`msg ${line.from}`}>
                {line.ai && (
                  <span className="ai-tag" title={msg.chat.aiNote}>
                    {msg.chat.aiTag}
                  </span>
                )}
                {line.text}
                {line.link && (
                  <>
                    {"\n"}
                    {line.link.href.startsWith("tel:") ? <a href={line.link.href}>{line.link.label}</a> : <Link href={line.link.href}>{line.link.label}</Link>}
                  </>
                )}
              </div>
            ))}
            {log.length === 1 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {SUGGESTIONS[lang].map((s) => (
                  <button key={s} type="button" className="slot" style={{ fontWeight: 500 }} onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={end} />
          </div>
          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label className="visually-hidden" htmlFor="chat-input">
              {msg.chat.placeholder}
            </label>
            <input id="chat-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={msg.chat.placeholder} autoComplete="off" />
            <button type="submit" className="btn btn-inline">
              {msg.chat.send}
            </button>
          </form>
          <p className="small" style={{ padding: "0 12px 10px", margin: 0 }}>
            {msg.chat.disclaimer}
          </p>
        </div>
      )}
    </>
  );
}
