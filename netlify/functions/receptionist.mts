// Netlify Functions：POST /api/receptionist
// Received messages are neither stored nor logged. This is a clinic demo, so it assumes no patient information is handled.
// If the environment variables CF_ACCOUNT_ID and CF_AI_TOKEN are set, normal questions are answered by Cloudflare Workers AI.
// If not (or if the AI fails or the free quota is used up), it answers with fixed rules.
import facts from "../../src/content/.generated/ai-facts.json";
import { cloudflareProvider } from "../../src/lib/clinic/ai-reply";
import { handleReceptionist } from "../../src/lib/clinic/receptionist-api";

export const config = { path: "/api/receptionist" };

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" },
  });

const FACTS = facts as Record<string, Record<string, string>>;
const accountId = process.env.CF_ACCOUNT_ID;
const token = process.env.CF_AI_TOKEN;
const provider =
  accountId && token ? cloudflareProvider({ accountId, token, factsFor: (region, lang) => FACTS[region]?.[lang] }) : undefined;

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return json(405, { error: "Use POST" });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Body must be JSON" });
  }
  const result = await handleReceptionist(body, provider);
  return json(result.status, result.body);
};
