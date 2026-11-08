import Link from "next/link";

export const metadata = { title: "About this project" };

export default function About() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>About this project</h1>
        <p>A demo built to show what I can deliver for dental and medical clinics in Europe and the US. It is modelled on real dental clinic websites; the clinic itself is fictional.</p>
      </div>
      <div className="prose">
        <h2>The aim</h2>
        <p>
          Clinics already have booking systems, phones and CRMs. What costs them patients is the gap between those: calls nobody can pick up, cancellations that leave an empty chair, and a website that doesn't say whether
          the clinic is open right now. This demo closes those gaps and shows the result on a dashboard.
        </p>

        <h2>What I looked at first</h2>
        <p>
          Three award-winning dental sites: LAVA dental studio (Awwwards Honorable Mention), Embrace Your Smile Orthodontics (WebAward 2025, Best Medical Website) and South Cliff Dental Group (Awwwards Honorable Mention). They are
          beautiful, photo- and video-led sites, but none of them show opening hours or free times on the first screen. Two of the three styles here (Calm and Studio) take their colour and type direction from those sites; the
          live status bar and picking a time on the home page are this project's own additions.
        </p>

        <h2>Ideas brought from Japan</h2>
        <ul>
          <li>Live opening status, common on Japanese clinic sites.</li>
          <li>A menu-style chat for booking and changes, modelled on the LINE official-account menus many Japanese clinics use, rebuilt as a WhatsApp (Spain) and SMS (US) simulation that opens from a button on the clinic site.</li>
          <li>A same-day queue with waiting time, adapted from Japanese clinic queue systems to dental emergencies.</li>
        </ul>
        <p>The waitlist auto-fill is not a Japanese idea; US dental software already does it. It's included because cancellations are expensive.</p>

        <h2>Two markets, one build</h2>
        <ul>
          <li>Spain (Barcelona): Spanish, Catalan, English and French; prices up front; WhatsApp; no cookies.</li>
          <li>US (Houston): English and Spanish on every page, the same pair used by federal health sites such as Medicare.gov; insurance and payment plans; SMS.</li>
        </ul>

        <h2>How it's built</h2>
        <ul>
          <li>Next.js and TypeScript, exported as static pages; every page has its own URL in every language.</li>
          <li>Opening status, free times, the emergency queue, waitlist matching, the assistant's routing, formatting and dashboard numbers live in one module with automated tests. The CMS mapping is tested too.</li>
          <li>Three visual styles share one layout; only colour, type and corner radius change.</li>
          <li>The dark bar at the top, the yellow package labels and the dark payload panels are portfolio tools, not part of the clinic site. They can be switched off (Portfolio notes) to see the site as a patient would.</li>
          <li>After a booking, a panel shows the data that would go to the clinic's booking system and CRM: an idempotency key so a repeated request books once, the patient matched by phone so there are no duplicates, follow-ups stopped once booked, and no health data. Nothing is actually sent.</li>
          <li>The Contact page shows an embedded Google map, as most clinic sites do. The privacy and cookie pages say that loading it shares the visitor's IP address with Google and may set Google cookies. The address is fictional, so the map shows the neighbourhood rather than a building, in the page's language.</li>
          <li>The EU version shows a sample cookie consent banner with reject and accept given equal weight. It is only a sample: no cookies are set either way.</li>
          <li>Fonts are served from this site, so no visitor data goes to a font provider.</li>
        </ul>

        <h2>What is and isn't connected</h2>
        <ul>
          <li>Clinic content (treatments, team, FAQ, opening hours, trust numbers) is edited in a headless CMS (Sanity) in four languages and read at build time from its public, read-only API. No write key is stored in the site. If the CMS can't be reached, the build falls back to a local copy and warns.</li>
          <li>The assistant asks a small API (/api/receptionist, a serverless function) how to route each message, and falls back to the same rules in the browser if the API can't be reached. Common questions get fixed answers from the clinic's data. Only questions the rules don't cover go to an AI model (Llama 3.1 8B on Cloudflare Workers AI). It is given the clinic's information from the CMS and told to answer only from it; a reply containing any number that isn't in that information (a price, a time, a phone number) is thrown away, and the message goes to a person instead. Symptoms, urgent requests and changes are decided by the rules first, so the AI never handles them. Messages are not stored, and Cloudflare states it does not train models on them. It runs on Cloudflare's free daily allowance; when that runs out, the assistant falls back to the rules.</li>
          <li>WhatsApp and SMS are simulated in the browser. The conversation logic is a separate, tested module written so a real WhatsApp webhook could call it; that connection isn't set up.</li>
          <li>No messages, calls or form submissions are sent to a clinic or anyone else. Chat messages go only to the site's own routing function and are not stored or logged.</li>
          <li>Catalan and French text hasn't been checked by a native speaker yet.</li>
          <li>All photos, including the team portraits, are AI-generated images of fictional places and people, and each one is labelled as AI-generated on the page.</li>
        </ul>

        <p>
          <Link href="/demo/">See the features →</Link>
        </p>
      </div>
    </div>
  );
}
