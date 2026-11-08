import { describe, expect, it } from "vitest";
import { clinicFacts, type FactsInput } from "./ai-facts";
import { buildPrompt, checkReply, cloudflareProvider, HANDOFF, MODEL } from "./ai-reply";

const L = (en: string) => ({ en, es: `${en} (es)`, ca: `${en} (ca)`, fr: `${en} (fr)` });

const input: FactsInput = {
  clinic: {
    region: "es",
    name: "Orela Dental",
    area: "Gràcia, Barcelona",
    address: "Carrer de l'Exemple 00, 08012 Barcelona",
    phone: "+34 000 000 000",
    sos: "112",
    schedule: { weekly: { 1: [{ start: 540, end: 1200 }], 6: [{ start: 600, end: 840 }] } },
  },
  treatments: [{ name: L("Cleaning"), summary: L("Scale and polish."), minutes: 45, priceFrom: 60, us: { kind: "covered" } }],
  languages: ["es", "ca", "en"],
  faqs: [{ question: L("Do you have parking?"), answer: L("There is a public car park 2 minutes away.") }],
};

describe("clinic facts (passed to the AI)", () => {
  it("includes address, phone, hours, prices and FAQs in that language", () => {
    const facts = clinicFacts(input, "en");
    expect(facts).toContain("Carrer de l'Exemple 00");
    expect(facts).toContain("+34 000 000 000");
    expect(facts).toContain("9:00-20:00");
    expect(facts).toMatch(/Sun: closed/);
    expect(facts).toContain("Cleaning (45 min, from €60)");
    expect(facts).toContain("public car park 2 minutes away");
    expect(clinicFacts(input, "es")).toContain("Scale and polish. (es)");
  });

  it("US version includes how insurance is shown instead of prices", () => {
    const us = clinicFacts({ ...input, clinic: { ...input.clinic, region: "us" } }, "en");
    expect(us).toContain("$0 with most plans");
    expect(us).toContain("PPO");
  });
});

describe("instructions to the AI", () => {
  it("tells it to answer only from the clinic facts and return HANDOFF if it does not know", () => {
    const [system, user] = buildPrompt({ message: "Do you treat children?", lang: "en" }, "FACTS");
    expect(system.content).toContain("Use ONLY the clinic information");
    expect(system.content).toContain(HANDOFF);
    expect(system.content).toContain("Never give medical advice");
    expect(system.content).toContain("FACTS");
    expect(user).toEqual({ role: "user", content: "Do you treat children?" });
  });

  it("English is British in the EU version and American in the US version; Spanish uses usted in the US version", () => {
    expect(buildPrompt({ message: "x", lang: "en", region: "es" }, "")[0].content).toContain("British English");
    expect(buildPrompt({ message: "x", lang: "en", region: "us" }, "")[0].content).toContain("American English");
    expect(buildPrompt({ message: "x", lang: "es", region: "us" }, "")[0].content).toContain("usted");
    expect(buildPrompt({ message: "x", lang: "es", region: "es" }, "")[0].content).toContain("'tú'");
  });
});

describe("checking the AI answer", () => {
  const facts = clinicFacts(input, "en");
  it("uses it if it only has numbers from the clinic facts", () => {
    expect(checkReply("A cleaning starts at €60 and takes 45 min.", facts)).toBe("A cleaning starts at €60 and takes 45 min.");
  });
  it("does not use it if it has numbers not in the clinic facts (such as made-up prices)", () => {
    expect(checkReply("A cleaning costs €75.", facts)).toBeNull();
    expect(checkReply("Call us on 555 1234.", facts)).toBeNull();
  });
  it("does not use HANDOFF, empty or overly long answers", () => {
    expect(checkReply(HANDOFF, facts)).toBeNull();
    expect(checkReply("  ", facts)).toBeNull();
    expect(checkReply(undefined, facts)).toBeNull();
    expect(checkReply("a".repeat(601), facts)).toBeNull();
  });
});

describe("Cloudflare Workers AI connection", () => {
  const facts = clinicFacts(input, "en");
  const fakeFetch = (reply: { ok: boolean; body?: unknown }) => {
    const calls: { url: string; init: { headers: Record<string, string>; body: string } }[] = [];
    const fn = async (url: string, init: { method: string; headers: Record<string, string>; body: string }) => {
      calls.push({ url, init });
      return { ok: reply.ok, json: async () => reply.body };
    };
    return { fn, calls };
  };

  it("calls with the model URL and token, and returns the checked answer", async () => {
    const f = fakeFetch({ ok: true, body: { result: { response: "There is a public car park 2 minutes away." } } });
    const provider = cloudflareProvider({ accountId: "acc", token: "tok", factsFor: () => facts, fetch: f.fn });
    const out = await provider({ message: "Is there parking?", lang: "en" }, { intent: "unknown", action: "handoff" });
    expect(out).toBe("There is a public car park 2 minutes away.");
    expect(f.calls[0].url).toBe(`https://api.cloudflare.com/client/v4/accounts/acc/ai/run/${MODEL}`);
    expect(f.calls[0].init.headers.authorization).toBe("Bearer tok");
    expect(JSON.parse(f.calls[0].init.body).messages[1].content).toBe("Is there parking?");
  });

  it("returns null when the free quota is used up, on error, or with no clinic facts (falls back to the rule-based answer)", async () => {
    const limit = cloudflareProvider({ accountId: "a", token: "t", factsFor: () => facts, fetch: fakeFetch({ ok: false }).fn });
    expect(await limit({ message: "x", lang: "en" }, { intent: "unknown", action: "handoff" })).toBeNull();
    const f = fakeFetch({ ok: true, body: { result: { response: "hi" } } });
    const noFacts = cloudflareProvider({ accountId: "a", token: "t", factsFor: () => undefined, fetch: f.fn });
    expect(await noFacts({ message: "x", lang: "en" }, { intent: "unknown", action: "handoff" })).toBeNull();
    expect(f.calls).toHaveLength(0);
  });
});
