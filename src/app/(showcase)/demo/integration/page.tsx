export const metadata = { title: "How it connects" };

const BOXES = [
  { x: 10, label: "Website / WhatsApp / SMS", sub: "patient books or asks" },
  { x: 200, label: "Booking system", sub: "the clinic's own" },
  { x: 390, label: "CRM", sub: "one record per patient" },
  { x: 580, label: "Follow-ups", sub: "reminders, waitlist" },
];

export default function Integration() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>How it connects</h1>
        <p>The valuable part of these projects is not adding AI but connecting the clinic's existing booking, phone and CRM without duplicates.</p>
      </div>
      <svg className="flow" viewBox="0 0 760 170" role="img" aria-label="Flow: website, WhatsApp or SMS to booking system to CRM to follow-ups; a booking stops follow-ups.">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="currentColor" />
          </marker>
        </defs>
        {BOXES.map((b, i) => (
          <g key={b.label}>
            <rect x={b.x} y={30} width={170} height={70} rx={10} fill="var(--panel)" stroke="var(--line)" />
            <text x={b.x + 85} y={60} textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--ink)">{b.label}</text>
            <text x={b.x + 85} y={80} textAnchor="middle" fontSize="12" fill="var(--muted)">{b.sub}</text>
            {i < BOXES.length - 1 && <line x1={b.x + 172} y1={65} x2={b.x + 196} y2={65} stroke="var(--ink)" strokeWidth={2} markerEnd="url(#arrow)" style={{ color: "var(--ink)" }} />}
          </g>
        ))}
        <path d="M 475 102 C 475 150, 665 150, 665 104" fill="none" stroke="var(--ink)" strokeDasharray="4 4" strokeWidth={1.5} markerEnd="url(#arrow)" style={{ color: "var(--ink)" }} />
        <text x={570} y={160} textAnchor="middle" fontSize="12" fill="var(--muted)">booked → stop chasing</text>
      </svg>
      <div className="grid" style={{ marginTop: 32 }}>
        <div className="prose">
          <h2>No duplicates</h2>
          <p>Every channel looks up the patient by phone number first. One person gets one record, so the same patient is never reminded twice or booked twice.</p>
          <p>Every message carries an ID; if the same event arrives twice, the second one is ignored.</p>
        </div>
        <div className="prose">
          <h2>Privacy by design</h2>
          <p>The assistant and the messages never collect symptoms. Health details stay in the clinic's own system.</p>
          <p>For EU clinics: services are chosen where a data processing agreement (DPA) can be signed, and consent is asked before any non-essential cookies.</p>
          <p>For US clinics: services are chosen that sign a business associate agreement (BAA) for HIPAA, and no health details are sent by plain SMS or email.</p>
          <p className="small">This is a design approach, not legal advice. Each real project is checked with the clinic.</p>
        </div>
      </div>
    </div>
  );
}
