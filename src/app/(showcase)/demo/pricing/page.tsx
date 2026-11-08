import { FEATURES, TIERS } from "@/content/features";

export const metadata = { title: "Packages" };

export default function Pricing() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Packages</h1>
        <p>One build, three levels. Prices are guide ranges, not a quote.</p>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {TIERS.map((t, i) => (
          <div key={t.id} className="card">
            <span className={`tier tier-${t.id}`}>{t.name}</span>
            <h2 style={{ marginTop: 12 }}>{t.price}</h2>
            <p>{t.summary}</p>
            <ul>
              {FEATURES.filter((f) => TIERS.findIndex((x) => x.id === f.tier) <= i).map((f) => (
                <li key={f.slug}>{f.title}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
