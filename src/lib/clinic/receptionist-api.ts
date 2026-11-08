// Logic for the AI front desk API (/api/receptionist). Called from Netlify Functions.
// First routes by the fixed rules (receptionist.ts). When AI (ReplyProvider, ai-reply.ts) is connected,
// only questions the rules could not handle go to the AI (if it cannot answer, hand over to the front desk as before).
// Symptoms, urgent cases, bookings, changes and handoffs are decided here first, not by the AI (safety rules take priority over AI answers).

import { route, type Intent, type Route } from "./receptionist";

export const LANGS = ["en", "es", "ca", "fr"] as const;
export type ApiLang = (typeof LANGS)[number];
export const MAX_MESSAGE_LENGTH = 500;

export type Region = "es" | "us";
export type ReceptionistRequest = { message: string; lang: ApiLang; region?: Region };

export type ReceptionistResponse = {
  intent: Intent;
  action: Route["action"];
  /** Who wrote the reply text. For "rules", the UI builds the fixed text from the clinic data */
  source: "rules" | "ai";
  /** Answer written by the AI (only when AI is connected) */
  reply?: string;
};

/** Plug-in point for the AI. Returns null when it cannot write an answer */
export type ReplyProvider = (input: ReceptionistRequest, route: Route) => Promise<string | null>;

export type ApiResult = { status: number; body: ReceptionistResponse | { error: string } };

export function parseRequest(input: unknown): ReceptionistRequest | string {
  if (typeof input !== "object" || input === null) return "Body must be a JSON object";
  const { message, lang, region } = input as Record<string, unknown>;
  if (typeof message !== "string" || message.trim() === "") return "message is required";
  if (message.length > MAX_MESSAGE_LENGTH) return `message must be at most ${MAX_MESSAGE_LENGTH} characters`;
  if (typeof lang !== "string" || !(LANGS as readonly string[]).includes(lang)) return "lang must be one of en, es, ca, fr";
  if (region !== undefined && region !== "es" && region !== "us") return "region must be es or us";
  if (region === "us" && lang !== "en" && lang !== "es") return "lang must be en or es for the US version";
  return { message, lang: lang as ApiLang, ...(region ? { region } : {}) };
}

export async function handleReceptionist(input: unknown, provider?: ReplyProvider): Promise<ApiResult> {
  const req = parseRequest(input);
  if (typeof req === "string") return { status: 400, body: { error: req } };
  const r = route(req.message);
  // Only questions the rules could not handle (unknown) go to the AI.
  // Questions the clinic data can answer, such as hours and prices, get exact fixed answers.
  // Symptoms, urgent cases, bookings, changes and handoffs also follow fixed behaviour, even with AI.
  const toAi = r.intent === "unknown";
  if (provider && toAi) {
    try {
      const reply = await provider(req, r);
      // If the AI can answer an unknown question, return an answer rather than a handoff
      if (reply) return { status: 200, body: { intent: r.intent, action: "answer", source: "ai", reply } };
    } catch {
      /* If the AI fails, fall back to the fixed rule-based answer */
    }
  }
  return { status: 200, body: { ...r, source: "rules" } };
}
