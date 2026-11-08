// Showcase of the work: the feature list and the price tiers. Amounts are estimates based on Upwork jobs, not fixed prices.

export type Tier = "starter" | "growth" | "pro";

export const TIERS: { id: Tier; name: string; price: string; summary: string }[] = [
  { id: "starter", name: "Starter", price: "$300–500", summary: "Multilingual clinic site. The booking button links to the clinic's existing booking service." },
  { id: "growth", name: "Growth", price: "$800–1,500", summary: "Adds embedded booking, WhatsApp or SMS reminders, and waitlist automation." },
  { id: "pro", name: "Pro", price: "$2,000–3,000", summary: "Adds the front-desk assistant, missed-call follow-up, the same-day emergency queue, CRM sync and the dashboard." },
];

export type Feature = { slug: string; title: string; tier: Tier; summary: string; href: string; origin?: string };

export const FEATURES: Feature[] = [
  {
    slug: "site",
    title: "Multilingual clinic site with live status",
    tier: "starter",
    summary: "Spain: ES, CA, EN, FR. US: EN, ES. Open now / closes in, computed in the clinic's own time zone.",
    href: "/es/en/",
    origin: "Live opening status is common on Japanese clinic sites.",
  },
  {
    slug: "booking",
    title: "Pick a time on the home page",
    tier: "growth",
    summary: "Next free times are on the first screen; booking takes three steps. None of the award-winning reference sites did this.",
    href: "/us/en/book/",
  },
  {
    slug: "messaging",
    title: "WhatsApp / SMS menu and reminders",
    tier: "growth",
    summary: "A WhatsApp (Spain) or SMS (US) chat you can try on the clinic site: book through the menu or type freely. It uses the same rules as the front-desk assistant. Changes and cancellations go to a person.",
    href: "/demo/messaging/",
    origin: "Modelled on the LINE official-account menus many Japanese clinics use.",
  },
  {
    slug: "waitlist",
    title: "Waitlist auto-fill",
    tier: "growth",
    summary: "When someone cancels, matching people on the waitlist get a message; the first yes gets the slot, the rest are told it's taken.",
    href: "/demo/messaging/#waitlist",
  },
  {
    slug: "receptionist",
    title: "Front-desk assistant",
    tier: "pro",
    summary: "Answers hours, prices, insurance and directions in four languages from the clinic's data, and other questions with AI limited to the clinic's information. Never assesses symptoms; sends those to the phone. Hands off to a person.",
    href: "/demo/receptionist/",
  },
  {
    slug: "missed-call",
    title: "Missed-call follow-up",
    tier: "pro",
    summary: "If nobody can pick up, the caller gets a booking link by SMS or WhatsApp within seconds.",
    href: "/demo/missed-call/",
  },
  {
    slug: "emergency",
    title: "Same-day emergency queue",
    tier: "pro",
    summary: "Shows how many people are waiting and roughly how long, and lets patients take a place online.",
    href: "/es/en/emergency/",
    origin: "Adapted from the queue systems used by Japanese clinics.",
  },
  {
    slug: "dashboard",
    title: "Front-desk dashboard",
    tier: "pro",
    summary: "Calls, missed calls recovered, bookings, handoffs, waitlist fills and emergency waiting time.",
    href: "/demo/dashboard/",
  },
  {
    slug: "integration",
    title: "How it connects",
    tier: "pro",
    summary: "Booking → CRM → stop follow-ups. How duplicates are avoided, and privacy by design for GDPR and HIPAA.",
    href: "/demo/integration/",
  },
];
