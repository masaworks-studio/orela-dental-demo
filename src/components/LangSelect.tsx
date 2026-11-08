"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOCALE_NAMES, REGION_LOCALES, type Locale, type RegionId } from "@/i18n/config";

/**
 * Language switcher (custom menu). The button opens a list, which goes to the same page in another language.
 * Each item is a real link, so it can also open in a new tab. Closes with Esc or a click outside.
 */
export function LangSelect({ region, lang, label }: { region: RegionId; lang: Locale; label: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    // When opened, move focus to the current language item
    box.current?.querySelector<HTMLAnchorElement>('a[aria-current="true"]')?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  // Move between items with the up and down arrow keys
  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = [...(box.current?.querySelectorAll<HTMLAnchorElement>(".lang-item") ?? [])];
    const i = items.indexOf(document.activeElement as HTMLAnchorElement);
    const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  return (
    <div className="lang" ref={box}>
      <button
        ref={button}
        type="button"
        className="lang-button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${label}: ${LOCALE_NAMES[lang]}`}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        <span className="lang-code">{lang.toUpperCase()}</span>
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" className="lang-chevron">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="lang-menu" role="menu" aria-label={label} onKeyDown={onMenuKey}>
          {REGION_LOCALES[region].map((l) => (
            <Link
              key={l}
              role="menuitem"
              className="lang-item"
              href={pathname.replace(`/${region}/${lang}/`, `/${region}/${l}/`)}
              hrefLang={l}
              lang={l}
              aria-current={l === lang ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="lang-item-code">{l.toUpperCase()}</span>
              <span className="lang-item-name">{LOCALE_NAMES[l]}</span>
              {l === lang && (
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="lang-check">
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
