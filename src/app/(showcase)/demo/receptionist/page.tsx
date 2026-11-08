import { getClinic, getTeam, getTreatments } from "@/content";
import type { Locale } from "@/i18n/config";
import { ReceptionistChat } from "@/components/ReceptionistChat";

export const metadata = { title: "Front-desk assistant" };

export default function ReceptionistDemo() {
  const clinic = getClinic("es");
  const languages = [...new Set(getTeam("es").flatMap((m) => m.languages))] as Locale[];
  const treatments = getTreatments().map(({ name, priceFrom, slug }) => ({ name, priceFrom, slug }));
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Front-desk assistant</h1>
        <p>Try it in English here, or open it on any clinic page in Spanish, Catalan or French.</p>
      </div>
      <div className="hero" style={{ paddingTop: 8 }}>
        <div className="prose">
          <h2>Rules it follows</h2>
          <ul>
            <li>It never asks about or assesses symptoms. Any message about pain, bleeding or swelling is stopped first and sent to the phone, with the emergency number.</li>
            <li>Urgent requests go to the same-day queue; booking requests go to the booking page.</li>
            <li>Anything it can't answer, and any change or cancellation, is handed to a person.</li>
            <li>Answers come from the clinic's own content (hours, prices, team languages), so they stay in sync with the site.</li>
          </ul>
          <p className="small">Common questions (hours, prices, insurance, directions) get fixed answers built from the clinic's data, so figures are always exact. Questions the rules don't cover go to an AI model (Llama 3.1 8B on Cloudflare Workers AI) that may only use the clinic's information; answers from it carry an “AI” tag. Symptoms, urgent requests and changes never reach the AI. If the AI can't answer or is unavailable, the message goes to a person. On a local preview without the API, the same rules run in the browser.</p>
        </div>
        <ReceptionistChat inline clinic={clinic} lang="en" languages={languages} treatments={treatments} />
      </div>
    </div>
  );
}
