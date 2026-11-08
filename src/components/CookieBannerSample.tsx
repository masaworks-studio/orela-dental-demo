"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { MESSAGES } from "@/i18n/messages";
import { clinicPath } from "./paths";

const KEY = "orela-cookie-sample";

/**
 * Sample cookie consent banner for the EU version. This demo uses no cookies, so no button sets anything.
 * Following EU guidance, "Reject" and "Accept" have the same size and prominence, and nothing is accepted by default.
 * Only the fact that it was closed is remembered in this browser (in browser storage, not a cookie).
 */
export function CookieBannerSample({ lang }: { lang: Locale }) {
  const msg = MESSAGES[lang].cookie;
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      setShow(localStorage.getItem(KEY) === null);
    } catch {
      setShow(true);
    }
  }, []);
  if (!show) return null;
  const close = (choice: "rejected" | "accepted") => {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      /* Close even if saving fails */
    }
    setShow(false);
  };
  return (
    <div className="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-title">
      <p className="cookie-sample">{msg.sample}</p>
      <h2 id="cookie-title">{msg.title}</h2>
      <p>{msg.body}</p>
      <div className="cookie-actions">
        <button type="button" className="btn btn-secondary" onClick={() => close("rejected")}>
          {msg.reject}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => close("accepted")}>
          {msg.accept}
        </button>
        <Link className="cookie-settings" href={clinicPath("es", lang, "cookies")}>
          {msg.settings}
        </Link>
      </div>
    </div>
  );
}
