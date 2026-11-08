"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type NavLink = { href: string; label: string };
export type NavItem = NavLink & { children?: NavLink[] };

/**
 * Clinic site menu, in the form common on real clinic sites (Inicio / Tratamientos ▾ / Clínica / Equipo / … / Contacto).
 * Desktop: "Treatments" opens a list (each treatment plus prices / insurance). Mobile: the "Menu" button opens all items in a vertical list.
 * Every item is a real link. Closes with Esc, a click outside, or a page change.
 */
export function SiteNav({ items, menuLabel, closeLabel }: { items: NavItem[]; menuLabel: string; closeLabel: string }) {
  const pathname = usePathname();
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // Close when the page changes
  useEffect(() => {
    setOpenDrop(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    if (!openDrop && !mobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDrop(null);
        setMobile(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) {
        setOpenDrop(null);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [openDrop, mobile]);

  const isHome = (href: string) => items[0]?.href === href;
  const current = (href: string) => (isHome(href) ? pathname === href : pathname.startsWith(href));

  return (
    <div className="nav-box" ref={box}>
      <button type="button" className="nav-toggle" aria-expanded={mobile} aria-controls="site-nav" onClick={() => setMobile((m) => !m)}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          {mobile ? (
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
        <span>{mobile ? closeLabel : menuLabel}</span>
      </button>
      <nav id="site-nav" className={`site-nav${mobile ? " is-open" : ""}`} aria-label="Main">
        {items.map((item) =>
          item.children ? (
            <div key={item.href} className="nav-drop">
              <button
                type="button"
                className="nav-drop-button"
                aria-expanded={openDrop === item.href}
                aria-current={item.children.some((c) => current(c.href)) ? "page" : undefined}
                onClick={() => setOpenDrop((o) => (o === item.href ? null : item.href))}
              >
                {item.label}
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" className="nav-chevron">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openDrop === item.href && (
                <div className="nav-drop-menu">
                  {item.children.map((c, i) => (
                    <Link key={c.href} href={c.href} className={i === 0 ? "nav-drop-all" : undefined} aria-current={pathname === c.href ? "page" : undefined}>
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link key={item.href} href={item.href} aria-current={current(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
