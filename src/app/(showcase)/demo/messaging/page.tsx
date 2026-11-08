import { getClinic, getTeam, getTreatments } from "@/content";
import type { Locale } from "@/i18n/config";
import { ReminderPhone, WaitlistDemo } from "@/components/demos/MessagingDemo";
import { MessagingSimulator } from "@/components/MessagingSimulator";

export const metadata = { title: "WhatsApp, SMS and waitlist" };

export default function MessagingDemo() {
  const treatments = getTreatments().map(({ slug, name, priceFrom, bookable }) => ({ slug, name, priceFrom, bookable }));
  const langs = (region: "es" | "us") => [...new Set(getTeam(region).flatMap((m) => m.languages))] as Locale[];
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>WhatsApp, SMS and the waitlist</h1>
        <p>Spain patients use WhatsApp; US patients get SMS. Try the conversations below. Nothing is sent.</p>
      </div>
      <div className="grid">
        <div>
          <h2>WhatsApp (Spain)</h2>
          <p className="muted">
            Modelled on the LINE official-account menus many Japanese clinics use. Tap the menu or type freely: free text goes through the same rules as the
            front-desk assistant, so a symptom is stopped and sent to the phone even in the middle of a booking. On the Spain site this opens from the WhatsApp
            button in Spanish, Catalan, English or French.
          </p>
          <MessagingSimulator clinic={getClinic("es")} lang="en" treatments={treatments} languages={langs("es")} />
        </div>
        <div>
          <h2>Reminder and late change (US)</h2>
          <p className="muted">A reminder the day before. A change inside 24 hours goes to a person, and the freed slot goes to the waitlist.</p>
          <ReminderPhone />
        </div>
      </div>
      <section className="block">
        <h2>Waitlist auto-fill</h2>
        <p className="muted">Only people whose day, time and treatment match get a message. The first yes books the slot; everyone else who was messaged is told it's taken.</p>
        <WaitlistDemo />
      </section>
    </div>
  );
}
