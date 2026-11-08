// Answer text and requests shared by the AI front desk chat and the WhatsApp / SMS simulator.
// Routing (which answer to give) is in src/lib/clinic/receptionist.ts; this file only builds the text.

import type { Clinic, Treatment } from "@/content/types";
import { LOCALE_NAMES, type Locale } from "@/i18n/config";
import { fill, MESSAGES } from "@/i18n/messages";
import { formatPrice, formatTime, weekdayShort } from "@/lib/clinic/format";
import { route, type Intent, type Route } from "@/lib/clinic/receptionist";
import { clinicPath } from "./paths";

// Answer text (4 languages). {x} is filled with the clinic's data
export const ANSWERS: Record<Exclude<Intent, "unknown">, Record<Locale, string>> & { unknown: Record<Locale, string> } = {
  symptom: {
    en: "I can't assess symptoms here. Please call us on {phone} so the team can help you today. If it's severe, call {sos}.",
    es: "Aquí no puedo valorar síntomas. Llámanos al {phone} y el equipo te ayudará hoy. Si es grave, llama al {sos}.",
    ca: "Aquí no puc valorar símptomes. Truca'ns al {phone} i l'equip t'ajudarà avui. Si és greu, truca al {sos}.",
    fr: "Je ne peux pas évaluer de symptômes ici. Appelez-nous au {phone} pour que l'équipe vous aide aujourd'hui. Si c'est grave, appelez le {sos}.",
  },
  emergency: {
    en: "You can take a place in today's emergency queue online.",
    es: "Puedes pedir turno en línea en la lista de urgencias de hoy.",
    ca: "Pots agafar número a la cua d'urgències d'avui en línia.",
    fr: "Vous pouvez prendre un ticket dans la file d'urgences du jour en ligne.",
  },
  hours: { en: "Our hours:\n{hours}", es: "Nuestro horario:\n{hours}", ca: "El nostre horari:\n{hours}", fr: "Nos horaires :\n{hours}" },
  location: { en: "We're at {address}.", es: "Estamos en {address}.", ca: "Som a {address}.", fr: "Nous sommes au {address}." },
  prices: {
    en: "Starting prices:\n{prices}\nYou get a written quote before any treatment.",
    es: "Precios de partida:\n{prices}\nRecibes un presupuesto por escrito antes de empezar.",
    ca: "Preus de partida:\n{prices}\nReps un pressupost per escrit abans de començar.",
    fr: "Prix de départ :\n{prices}\nVous recevez un devis écrit avant tout soin.",
  },
  insurance: {
    en: "We accept most PPO plans and check your coverage before your visit. Monthly payment plans are available.",
    es: "Aceptamos la mayoría de los planes PPO y revisamos tu cobertura antes de la visita. Hay planes de pago mensual.",
    ca: "Acceptem la majoria de plans PPO i revisem la cobertura abans de la visita.",
    fr: "Nous acceptons la plupart des plans PPO et vérifions votre couverture avant la visite.",
  },
  booking: {
    en: "You can pick a free time online. It takes under a minute.",
    es: "Puedes elegir una hora libre en línea. Se tarda menos de un minuto.",
    ca: "Pots triar una hora lliure en línia. Es triga menys d'un minut.",
    fr: "Vous pouvez choisir un créneau libre en ligne. Cela prend moins d'une minute.",
  },
  cancel: {
    en: "I'll pass this to the front desk so they can change it for you. (Demo: nothing is sent.)",
    es: "Paso tu mensaje a recepción para que te la cambien. (Demo: no se envía nada.)",
    ca: "Passo el teu missatge a recepció perquè te la canviïn. (Demo: no s'envia res.)",
    fr: "Je transmets à l'accueil pour qu'ils modifient votre rendez-vous. (Démo : rien n'est envoyé.)",
  },
  languages: { en: "Our team speaks {langs}.", es: "Nuestro equipo habla {langs}.", ca: "El nostre equip parla {langs}.", fr: "Notre équipe parle {langs}." },
  human: {
    en: "I'll pass you to a person at the front desk. (Demo: nothing is sent.)",
    es: "Te paso con una persona de recepción. (Demo: no se envía nada.)",
    ca: "Et passo amb una persona de recepció. (Demo: no s'envia res.)",
    fr: "Je vous mets en relation avec une personne de l'accueil. (Démo : rien n'est envoyé.)",
  },
  greeting: { en: "Hi! How can I help?", es: "¡Hola! ¿En qué te ayudo?", ca: "Hola! En què t'ajudo?", fr: "Bonjour ! Comment puis-je vous aider ?" },
  unknown: {
    en: "I'm not sure about that one, so I'll pass it to the front desk. (Demo: nothing is sent.)",
    es: "No estoy seguro de eso, así que lo paso a recepción. (Demo: no se envía nada.)",
    ca: "No n'estic segur, així que ho passo a recepció. (Demo: no s'envia res.)",
    fr: "Je ne suis pas sûr, je transmets donc à l'accueil. (Démo : rien n'est envoyé.)",
  },
};

export const SUGGESTIONS: Record<Locale, string[]> = {
  // Price (fixed answer), duration (answered by AI from the clinic's information), symptom (sent to the phone), handoff
  en: ["How much is a cleaning?", "How long does a cleaning take?", "My tooth hurts", "Talk to a person"],
  es: ["¿Cuánto cuesta una limpieza?", "¿Cuánto dura una limpieza?", "Me duele una muela", "Hablar con una persona"],
  ca: ["Quant costa una neteja?", "Quant dura una neteja?", "Em fa mal una dent", "Parlar amb una persona"],
  fr: ["Combien coûte un détartrage ?", "Combien de temps dure un détartrage ?", "J'ai mal aux dents", "Parler à quelqu'un"],
};

export type AssistantContext = {
  clinic: Clinic;
  lang: Locale;
  treatments: Pick<Treatment, "name" | "priceFrom" | "slug">[];
  languages: Locale[];
};

export type AnswerLine = { text: string; link?: { href: string; label: string }; ai?: boolean };

/** Opening hours, one line per day of the week */
export function hoursText(clinic: Clinic, lang: Locale): string {
  const msg = MESSAGES[lang];
  return [1, 2, 3, 4, 5, 6, 0]
    .map((d) => {
      const iv = clinic.schedule.weekly[d as 0] ?? [];
      const span = iv.length ? iv.map((i) => `${formatTime(i.start, clinic.region, lang)}–${formatTime(i.end, clinic.region, lang)}`).join(", ") : msg.closedDay;
      return `${weekdayShort(d, clinic.region, lang, true)} ${span}`;
    })
    .join("\n");
}

/**
 * First ask the API (/api/receptionist, Netlify Functions) for the routing.
 * Where there is no API (e.g. testing on this computer) or the call fails, use the same rules in the browser.
 */
export async function decide(text: string, lang: Locale, region: Clinic["region"]): Promise<{ route: Route; reply?: string }> {
  try {
    const res = await fetch("/api/receptionist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: text.slice(0, 500), lang, region }),
      // Allow time for the AI to build an answer. If it is too slow, answer with the rules below
      signal: AbortSignal.timeout(9000),
    });
    if (res.ok) {
      const body = (await res.json()) as { intent: Intent; action: Route["action"]; reply?: string };
      if (body.intent && body.action) return { route: { intent: body.intent, action: body.action }, reply: body.reply };
    }
  } catch {
    /* If the API cannot be reached, answer with the rules below */
  }
  return { route: route(text) };
}

/** Turns the routing result into answer text filled with the clinic's data */
export function answerLine(r: Route, ctx: AssistantContext, reply?: string): AnswerLine {
  const { clinic, lang, treatments, languages } = ctx;
  const msg = MESSAGES[lang];
  const values = {
    phone: clinic.phone,
    sos: clinic.sos,
    address: clinic.address,
    hours: hoursText(clinic, lang),
    prices: treatments.filter((t) => t.slug !== "emergency").slice(0, 4).map((t) => `· ${t.name[lang]}: ${formatPrice(t.priceFrom, clinic.region, lang)}`).join("\n"),
    langs: languages.map((l) => LOCALE_NAMES[l]).join(", "),
  };
  // In the US version, a question about prices gets the insurance answer (the price list is only in the Spain version)
  const effective: Intent = r.intent === "prices" && clinic.region === "us" ? "insurance" : r.intent;
  const line: AnswerLine = reply ? { text: reply, ai: true } : { text: fill(ANSWERS[effective][lang], values) };
  if (r.action === "open-booking") line.link = { href: clinicPath(clinic.region, lang, "book"), label: msg.book.cta };
  if (r.action === "open-emergency") line.link = { href: clinicPath(clinic.region, lang, "emergency"), label: msg.emergency.take };
  if (r.action === "redirect-phone") line.link = { href: clinic.phoneHref, label: `${msg.call} ${clinic.phone}` };
  return line;
}
