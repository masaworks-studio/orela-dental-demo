// Routing for the AI front desk chat (currently returns fixed answers).
// Approach: never ask about or diagnose symptoms. If symptoms come up, point to the phone or same-day emergency.
// Questions that match nothing are handed over to a person (front desk staff).
// Even when swapped for a real AI, keep this "stop symptom talk first" part.

export type Intent =
  | "symptom"
  | "emergency"
  | "hours"
  | "location"
  | "prices"
  | "insurance"
  | "booking"
  | "cancel"
  | "languages"
  | "human"
  | "greeting"
  | "unknown";

export type Route = {
  intent: Intent;
  /** Next action to take */
  action: "answer" | "redirect-phone" | "open-emergency" | "open-booking" | "handoff";
};

/** Lower-cases and strips accents ("Dolor" → "dolor", "très" → "tres") */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s'·-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Keyword lists combined across languages (en, es, ca, fr). Checked in order from the top.
const RULES: { intent: Intent; words: string[] }[] = [
  {
    intent: "emergency",
    words: ["emergency", "urgent", "same day", "same-day", "urgencia", "urgente", "urgencies", "urgence"],
  },
  {
    intent: "symptom",
    words: [
      "pain", "hurt", "ache", "bleed", "swell", "broken", "chipped", "infection", "fever", "abscess",
      "dolor", "duele", "sangr", "hinch", "roto", "rota", "infeccion", "fiebre", "flemon",
      "mal", "fa mal", "inflam", "trencat", "trencada",
      "douleur", "saign", "gonfl", "casse", "fievre",
    ],
  },
  { intent: "cancel", words: ["cancel", "reschedule", "change my", "cancelar", "cambiar", "anular", "canviar", "annuler", "deplacer"] },
  { intent: "booking", words: ["book", "appointment", "schedule", "slot", "cita", "reservar", "reserva", "rendez", "reserver"] },
  { intent: "insurance", words: ["insurance", "medicaid", "ppo", "carecredit", "financing", "payment plan", "seguro", "aseguradora", "mutua", "assurance", "mutuelle"] },
  { intent: "prices", words: ["price", "cost", "how much", "fee", "precio", "cuanto", "cuesta", "tarifa", "preu", "quant", "prix", "combien", "tarif"] },
  { intent: "hours", words: ["hour", "open", "close", "when", "horario", "abierto", "abren", "cierran", "horari", "obert", "horaire", "ouvert", "ferme"] },
  { intent: "location", words: ["where", "address", "parking", "directions", "metro", "donde", "direccion", "aparcar", "on es", "adreca", "ou est", "adresse", "garer"] },
  { intent: "languages", words: ["language", "english", "spanish", "catalan", "french", "idioma", "ingles", "frances", "llengua", "angles", "langue", "anglais", "espagnol"] },
  { intent: "human", words: ["human", "person", "staff", "receptionist", "talk to", "persona", "hablar con", "recepcion", "parlar amb", "quelqu'un", "parler a"] },
  { intent: "greeting", words: ["hello", "hi", "hey", "hola", "bon dia", "bona tarda", "bonjour", "salut", "buenas"] },
];

function hasWord(text: string, word: string): boolean {
  // Short words match as whole words, long ones as substrings (so "hi" does not match "this")
  if (word.length <= 3) return new RegExp(`(^|\\s)${word}(\\s|$)`).test(text);
  return text.includes(word);
}

// "How long does it take?" in es / ca / fr uses the same words as "how much" (cuanto, quant, combien).
// When the question is about time and names no price word, it is not a price question.
const DURATION = ["how long", "cuanto dura", "cuanto tiempo", "cuanto tarda", "quant dura", "quant de temps", "quant triga", "combien de temps", "duree", "duracion", "durada"];
const PRICE_ONLY = ["price", "cost", "fee", "precio", "cuesta", "cuestan", "preu", "costa", "prix", "coute", "tarif"];

function isDurationQuestion(text: string): boolean {
  return DURATION.some((w) => hasWord(text, w)) && !PRICE_ONLY.some((w) => hasWord(text, w));
}

export function classify(message: string): Intent {
  const text = normalize(message);
  if (!text) return "unknown";
  const duration = isDurationQuestion(text);
  // Check symptoms before other words ("I want to book, my tooth hurts" counts as symptoms)
  const symptom = RULES.find((r) => r.intent === "symptom")!;
  if (symptom.words.some((w) => hasWord(text, w))) return "symptom";
  for (const rule of RULES) {
    if (rule.intent === "symptom") continue;
    if (rule.intent === "prices" && duration) continue;
    if (rule.words.some((w) => hasWord(text, w))) return rule.intent;
  }
  return "unknown";
}

export function route(message: string): Route {
  const intent = classify(message);
  switch (intent) {
    case "symptom":
      return { intent, action: "redirect-phone" };
    case "emergency":
      return { intent, action: "open-emergency" };
    case "booking":
      return { intent, action: "open-booking" };
    case "cancel":
    case "human":
    case "unknown":
      return { intent, action: "handoff" };
    default:
      return { intent, action: "answer" };
  }
}
