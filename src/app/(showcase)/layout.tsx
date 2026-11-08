import type { Metadata } from "next";
import "@/styles/globals.css";
import "./showcase.css";
import { fontVariables, themeBootScript } from "@/app/fonts";

export const metadata: Metadata = {
  title: { default: "Orela Dental — booking and front-desk automation demo", template: "%s · Orela Dental demo" },
  description: "A portfolio demo: multilingual dental clinic site with live status, same-day emergency queue, waitlist automation and a front-desk assistant. All data is fictional.",
  robots: { index: false, follow: false },
};

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <p className="demo-notice">
          Portfolio demo modelled on real dental clinic websites. The clinic, people, address, phone numbers and figures are fictional. Nothing is sent to a clinic or stored.
        </p>
        <header className="site-header">
          <div className="wrap">
            <a className="logo" href="/">
              <i aria-hidden="true">O</i>Orela Dental <span className="small" style={{ marginLeft: 6 }}>demo</span>
            </a>
            <nav className="site-nav show-nav" aria-label="Demo">
              <a href="/es/en/">EU (Spain) site</a>
              <a href="/us/en/">US (Texas) site</a>
              <a href="/demo/">Features</a>
              <a href="/demo/pricing/">Packages</a>
              <a href="/about-this-project/">About this project</a>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <p className="small">Demo site. Images marked as AI-generated are AI-generated. No cookies, no analytics, no data collection.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
