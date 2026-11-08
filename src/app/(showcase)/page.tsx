import Link from "next/link";

export default function Entry() {
  return (
    <div className="wrap">
      <div className="hero">
        <div>
          <h1>A dental clinic site that answers, books and fills cancellations.</h1>
          <p className="lede">
            One demo, two markets. The Spain version runs in Spanish, Catalan, English and French with prices up front and WhatsApp. The US version runs in English and Spanish with insurance, payment plans and SMS.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="btn btn-inline" href="/es/en/">Open the EU (Spain) site</Link>
            <Link className="btn btn-inline btn-secondary" href="/us/en/">Open the US (Texas) site</Link>
          </div>
          <p className="small" style={{ marginTop: 12 }}>
            Both open in English: British English for Spain, American English for the US. Use the language menu at the top right to switch to Spanish, Catalan or French.
          </p>
        </div>
        <div className="card">
          <h2>What to look at</h2>
          <ol className="prose" style={{ paddingLeft: 20, margin: 0 }}>
            <li>The status bar: open now, closing time and the emergency queue, in the clinic's own time zone.</li>
            <li>Pick a free time on the home page and go through booking.</li>
            <li>Ask the front-desk assistant something the rules don't cover (the AI answers from the clinic's information), then mention a symptom.</li>
            <li>Switch the style (Direct, Calm, Studio) in the dark demo bar at the top of the clinic site.</li>
            <li>See the automation demos under <Link href="/demo/">Features</Link>.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
