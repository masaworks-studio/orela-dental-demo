// The part that has AI (Cloudflare Workers AI) write the reply text for the AI front desk.
// Approach:
// - Only questions without a fixed rule-based answer go to the AI (symptoms, urgent cases, booking changes and handoffs to a person do not; decided in receptionist-api.ts)
// - The AI answers only from the "clinic facts" (ai-facts.ts). If it does not know, it returns HANDOFF and we hand over to the front desk
// - If the AI answer contains numbers not in the clinic facts (prices, times, phone numbers, etc.), we do not use it (prevents made-up answers)
// - On failure, timeout or when the free quota is used up, return null and fall back to the fixed rule-based answer
// Netlify functions also import this file, so do not use "@/..." imports.

import type { ReceptionistRequest, ReplyProvider } from "./receptionist-api";

export const HANDOFF = "HANDOFF";
export const MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8-fast";
export const MAX_REPLY_LENGTH = 600;

const LANGUAGE_NAMES = { en: "English", es: "Spanish", ca: "Catalan", fr: "French" } as const;

/** Instructions and question passed to the AI */
export function buildPrompt(req: ReceptionistRequest, facts: string): { role: "system" | "user"; content: string }[] {
  const region = req.region ?? "es";
  const register =
    req.lang === "es" ? (region === "us" ? " Use the formal 'usted' form." : " Use the informal 'tú' form, as clinics in Spain do.") : "";
  const english = req.lang === "en" ? (region === "us" ? " Use American English." : " Use British English.") : "";
  const system = [
    "You are the front-desk assistant on the website of a small dental clinic. The clinic is a fictional demo.",
    `Reply in ${LANGUAGE_NAMES[req.lang]}.${register}${english}`,
    "Use ONLY the clinic information below. Never invent prices, times, phone numbers, services, names or policies.",
    `If the answer is not in the clinic information, reply with exactly: ${HANDOFF}`,
    "Never give medical advice, never assess symptoms and never say whether a treatment is suitable for someone. If asked, reply with exactly: " + HANDOFF,
    "Do not ask for or repeat personal data. Keep the reply to at most 3 short sentences, plain text, no lists, no markdown.",
    "",
    "Clinic information:",
    facts,
  ].join("\n");
  return [
    { role: "system", content: system },
    { role: "user", content: req.message },
  ];
}

/** Groups of digits ("9:30" → ["9", "30"], "€45" → ["45"]) */
const numbers = (text: string) => text.match(/\d+/g) ?? [];

/**
 * Checks the AI answer. Returns null if the answer cannot be used.
 * - Do not use HANDOFF, empty or overly long answers
 * - Do not use it if it contains numbers not in the clinic facts
 */
export function checkReply(reply: string | null | undefined, facts: string): string | null {
  const text = (reply ?? "").trim();
  if (!text || text.includes(HANDOFF) || text.length > MAX_REPLY_LENGTH) return null;
  const known = new Set(numbers(facts));
  if (numbers(text).some((n) => !known.has(n))) return null;
  return text;
}

type FetchLike = (url: string, init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal }) => Promise<{
  ok: boolean;
  json: () => Promise<unknown>;
}>;

/**
 * ReplyProvider that writes answers with Cloudflare Workers AI.
 * factsFor returns the clinic facts for each version and language (JSON built at build time).
 */
export function cloudflareProvider(opts: {
  accountId: string;
  token: string;
  factsFor: (region: "es" | "us", lang: ReceptionistRequest["lang"]) => string | undefined;
  fetch?: FetchLike;
  timeoutMs?: number;
}): ReplyProvider {
  const doFetch = opts.fetch ?? (fetch as unknown as FetchLike);
  return async (req) => {
    const facts = opts.factsFor(req.region ?? "es", req.lang);
    if (!facts) return null;
    const res = await doFetch(`https://api.cloudflare.com/client/v4/accounts/${opts.accountId}/ai/run/${MODEL}`, {
      method: "POST",
      headers: { authorization: `Bearer ${opts.token}`, "content-type": "application/json" },
      body: JSON.stringify({ messages: buildPrompt(req, facts), max_tokens: 200, temperature: 0.2 }),
      signal: AbortSignal.timeout(opts.timeoutMs ?? 6000),
    });
    // When the free quota is used up or on error, fall back to the fixed rule-based answer
    if (!res.ok) return null;
    const body = (await res.json()) as { result?: { response?: string } };
    return checkReply(body.result?.response, facts);
  };
}
