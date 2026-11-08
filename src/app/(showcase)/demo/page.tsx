import Link from "next/link";
import { FEATURES, TIERS } from "@/content/features";

export const metadata = { title: "Features" };

export default function DemoIndex() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Features</h1>
        <p>Each feature is labelled with the package it belongs to. All data is fictional and nothing is sent to a clinic or stored.</p>
      </div>
      <div className="feature-list">
        {FEATURES.map((f, i) => (
          <Link key={f.slug} className="feature" href={f.href}>
            <span className="n">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <strong>{f.title}</strong>
              <br />
              <span className="muted">{f.summary}</span>
              {f.origin && (
                <>
                  <br />
                  <span className="small">{f.origin}</span>
                </>
              )}
            </span>
            <span className={`tier tier-${f.tier}`}>{TIERS.find((t) => t.id === f.tier)?.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
