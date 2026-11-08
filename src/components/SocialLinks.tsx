"use client";

import { useState } from "react";
import type { Locale, RegionId } from "@/i18n/config";

/**
 * Social media and email icons in the footer (each in its network's colour).
 * The clinic is not real, so they do not link to real accounts. Clicking one shows "This is a demo, so there is no account".
 * The email uses an .example address, which is reserved and never exists (mail is not delivered).
 */
const EMAIL: Record<RegionId, string> = { es: "hola@orela.example", us: "hello@orela.example" };

const NOTE: Record<Locale, string> = {
  en: "Demo clinic: these social accounts don't exist.",
  es: "Clínica de demostración: estas cuentas no existen.",
  ca: "Clínica de demostració: aquests comptes no existeixen.",
  fr: "Cabinet de démonstration : ces comptes n'existent pas.",
};

type Net = { id: string; name: string; bg: string; icon: React.ReactNode };

const NETS: Net[] = [
  {
    id: "instagram",
    name: "Instagram",
    bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="#fff" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="#fff" strokeWidth="2" />
        <circle cx="17.3" cy="6.7" r="1.2" fill="#fff" />
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    bg: "#1877f2",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path fill="#fff" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    name: "YouTube",
    bg: "#ff0000",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path fill="#fff" d="M10 8.5v7l6-3.5z" />
      </svg>
    ),
  },
];

export function SocialLinks({ region, lang }: { region: RegionId; lang: Locale }) {
  const [shown, setShown] = useState(false);
  const email = EMAIL[region];
  return (
    <div className="social">
      <p className="social-email">
        <a href={`mailto:${email}`}>{email}</a>
      </p>
      <div className="social-icons">
        {NETS.map((n) => (
          <button
            key={n.id}
            type="button"
            className="social-icon"
            style={{ background: n.bg }}
            aria-label={`${n.name} — ${NOTE[lang]}`}
            title={`${n.name} — ${NOTE[lang]}`}
            onClick={() => setShown(true)}
          >
            {n.icon}
          </button>
        ))}
        <a className="social-icon" style={{ background: "#5f6368" }} href={`mailto:${email}`} aria-label={email} title={email}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="#fff" strokeWidth="2" />
            <path d="M3.5 7l8.5 6 8.5-6" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
      <p className="small social-note" aria-live="polite">
        {shown ? NOTE[lang] : " "}
      </p>
    </div>
  );
}
