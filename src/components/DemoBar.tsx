import Link from "next/link";
import { REGION_LOCALES, REGION_NAMES, type Locale, type RegionId } from "@/i18n/config";
import { clinicPath } from "./paths";
import { LabelsToggle } from "./LabelsToggle";
import { ThemeSwitcher } from "./ThemeSwitcher";

/**
 * Demo bar for the portfolio (not part of the clinic site).
 * It is separate from the clinic's look and keeps the same colour and shape in every style, so it is clearly a "demo tool".
 * It groups the version (EU / US) and style switches, the pricing tier label toggle, the note that the clinic is not real, and links to the feature demos and the project write-up
 * (these are about the portfolio, so they are not placed in the clinic's footer or menu).
 */
export function DemoBar({ region, lang, notice }: { region: RegionId; lang: Locale; notice: string }) {
  return (
    <div className="demobar" role="region" aria-label="Portfolio demo controls">
      <div className="wrap">
        <p className="demobar-note">
          <span className="demobar-tag">Portfolio demo</span>
          <span>{notice}</span>
        </p>
        <div className="demobar-controls">
          <div className="demobar-group" role="group" aria-label="Market">
            <span className="demobar-label">Market</span>
            <span className="demobar-seg">
              {(Object.keys(REGION_NAMES) as RegionId[]).map((id) => {
                const target = (REGION_LOCALES[id] as string[]).includes(lang) ? lang : REGION_LOCALES[id][0];
                return (
                  <Link key={id} href={clinicPath(id, target as Locale)} aria-current={id === region ? "true" : undefined}>
                    {REGION_NAMES[id]}
                  </Link>
                );
              })}
            </span>
          </div>
          <ThemeSwitcher label="Style" variant="demo" />
          <LabelsToggle />
          <span className="demobar-links">
            <Link className="demobar-link" href="/demo/">
              Feature demos
            </Link>
            <Link className="demobar-link" href="/about-this-project/">
              About this project
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
