import { describe, expect, it } from "vitest";
import { handleReceptionist, MAX_MESSAGE_LENGTH } from "./receptionist-api";

describe("receptionist API", () => {
  it("routes by the rules and returns the result", async () => {
    expect(await handleReceptionist({ message: "How much is a cleaning?", lang: "en" })).toEqual({
      status: 200,
      body: { intent: "prices", action: "answer", source: "rules" },
    });
  });

  it("returns 400 for invalid input", async () => {
    expect((await handleReceptionist(null)).status).toBe(400);
    expect((await handleReceptionist({ message: "", lang: "en" })).status).toBe(400);
    expect((await handleReceptionist({ message: "hi", lang: "de" })).status).toBe(400);
    expect((await handleReceptionist({ message: "x".repeat(MAX_MESSAGE_LENGTH + 1), lang: "en" })).status).toBe(400);
    expect((await handleReceptionist({ message: "hi", lang: "en", region: "fr" })).status).toBe(400);
    // US version has English and Spanish only
    expect((await handleReceptionist({ message: "hi", lang: "ca", region: "us" })).status).toBe(400);
  });

  it("even with AI connected, symptoms, booking changes and handoffs are not passed to the AI", async () => {
    let calls = 0;
    const provider = async () => {
      calls++;
      return "AI answer";
    };
    expect((await handleReceptionist({ message: "Me duele una muela", lang: "es" }, provider)).body).toEqual({
      intent: "symptom",
      action: "redirect-phone",
      source: "rules",
    });
    expect((await handleReceptionist({ message: "I need to cancel", lang: "en" }, provider)).body).toMatchObject({ action: "handoff", source: "rules" });
    expect((await handleReceptionist({ message: "Talk to a person", lang: "en" }, provider)).body).toMatchObject({ action: "handoff", source: "rules" });
    expect(calls).toBe(0);
  });

  it("questions the clinic data can answer get the exact rule-based answer, even with AI", async () => {
    const r = await handleReceptionist({ message: "What are your hours?", lang: "en" }, async () => "We open at 9.");
    expect(r.body).toEqual({ intent: "hours", action: "answer", source: "rules" });
  });

  it("questions the rules cannot answer are answered by the AI, as an answer rather than a handoff", async () => {
    let seen: unknown;
    const r = await handleReceptionist({ message: "Do you treat children?", lang: "en", region: "us" }, async (req) => {
      seen = req;
      return "Yes, we see patients of all ages.";
    });
    expect(r.body).toEqual({ intent: "unknown", action: "answer", source: "ai", reply: "Yes, we see patients of all ages." });
    expect(seen).toEqual({ message: "Do you treat children?", lang: "en", region: "us" });
  });

  it("if the AI cannot answer or fails, hands over to the front desk as before", async () => {
    const none = await handleReceptionist({ message: "Do you treat children?", lang: "en" }, async () => null);
    expect(none.body).toEqual({ intent: "unknown", action: "handoff", source: "rules" });
    const failed = await handleReceptionist({ message: "Do you treat children?", lang: "en" }, async () => {
      throw new Error("timeout");
    });
    expect(failed.body).toEqual({ intent: "unknown", action: "handoff", source: "rules" });
  });
});
