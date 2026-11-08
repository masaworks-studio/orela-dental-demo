"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Clinic } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { MESSAGES } from "@/i18n/messages";
import { MessagingSimulator, type SimTreatment } from "./MessagingSimulator";

/**
 * The "WhatsApp" (Spain version) / "SMS" (US version) button on the clinic site.
 * On a real clinic site it would open WhatsApp, but the phone number is not real, so it opens the simulator.
 * It floats as a round button in the bottom-right corner, next to the AI front desk button (on desktop and mobile).
 */
export function MessagingButton({
  clinic,
  lang,
  treatments,
  languages,
  place,
}: {
  clinic: Clinic;
  lang: Locale;
  treatments: SimTreatment[];
  languages: Locale[];
  place: "float" | "bar";
}) {
  const wa = MESSAGES[lang].wa;
  const [open, setOpen] = useState(false);
  const label = clinic.messaging === "sms" ? wa.sms : wa.whatsapp;

  // Close with Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`fab fab-msg${clinic.messaging === "sms" ? " is-sms" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen(true)}
      >
        {clinic.messaging === "sms" ? (
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path fill="currentColor" d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.6 3.4 6.1L4.6 21l4.3-2.3c1 .2 2 .3 3.1.3 5.5 0 10-3.6 10-8s-4.5-8-10-8z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
            <path fill="currentColor" d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5zm0 17.2a7.7 7.7 0 0 1-3.9-1.1l-.3-.2-2.8.8.8-2.7-.2-.3A7.7 7.7 0 1 1 12 19.7z" />
            <path fill="currentColor" d="M9.3 7.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.5l.4-.5.3-.4v-.5l-.8-1.9z" />
          </svg>
        )}
        <span className="fab-label">{label}</span>
      </button>
      {open &&
        createPortal(
        <div className="sim-overlay" role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <MessagingSimulator clinic={clinic} lang={lang} treatments={treatments} languages={languages} onClose={() => setOpen(false)} />
        </div>,
          // Render it in the top layer of the page, not inside the bottom button row (so it does not overlap other floating buttons)
          document.body,
        )}
    </>
  );
}
