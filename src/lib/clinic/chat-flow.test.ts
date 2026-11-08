import { describe, expect, it } from "vitest";
import { step, type FlowContext, type FlowState } from "./chat-flow";
import type { ClinicSchedule } from "./types";

const h = (hh: number) => hh * 60;
const schedule: ClinicSchedule = {
  timeZone: "Europe/Madrid",
  weekly: { 1: [{ start: h(9), end: h(14) }], 2: [{ start: h(9), end: h(14) }], 3: [{ start: h(9), end: h(14) }] },
  closedDates: [],
};
const ctx: FlowContext = {
  clinicKey: "t",
  schedule,
  now: { date: "2026-11-09", weekday: 1, minutes: h(10) },
  treatments: ["checkup", "cleaning"],
};

describe("chat flow", () => {
  it("starts with a greeting and the menu", () => {
    expect(step({ step: "menu" }, { type: "start" }, ctx).replies.map((r) => r.kind)).toEqual(["welcome", "menu"]);
  });

  it("booking from the menu: treatment → 3 free slots → name → booked (demo)", () => {
    let s: FlowState = { step: "menu" };
    let out = step(s, { type: "menu", id: "book" }, ctx);
    expect(out.replies[0]).toEqual({ kind: "treatments", options: ["checkup", "cleaning"] });
    out = step(out.state, { type: "treatment", slug: "cleaning" }, ctx);
    const slots = out.replies[0].kind === "slots" ? out.replies[0].slots : [];
    expect(slots).toHaveLength(3);
    out = step(out.state, { type: "slot", slot: slots[0] }, ctx);
    expect(out.replies[0].kind).toBe("askName");
    out = step(out.state, { type: "text", text: "  Ana  " }, ctx);
    expect(out.replies[0]).toEqual({ kind: "booked", treatment: "cleaning", slot: slots[0], name: "Ana" });
    s = out.state;
    expect(s.step).toBe("menu");
  });

  it("even mid-booking, stops symptom talk first and points to the phone, keeping the booking step", () => {
    const asking: FlowState = { step: "askName", treatment: "checkup", slot: { date: "2026-11-09", weekday: 1, start: h(12) } };
    const out = step(asking, { type: "text", text: "me duele mucho una muela" }, ctx);
    expect(out.replies).toEqual([{ kind: "answer", route: { intent: "symptom", action: "redirect-phone" } }]);
    expect(out.state).toEqual(asking);
  });

  it("passes booking changes and cancellations to a person (no automatic changes)", () => {
    expect(step({ step: "menu" }, { type: "menu", id: "change" }, ctx).replies).toEqual([{ kind: "handoff", reason: "change" }]);
    expect(step({ step: "menu" }, { type: "text", text: "Quiero cancelar mi cita" }, ctx).replies).toEqual([{ kind: "handoff", reason: "change" }]);
  });

  it("free text uses the same routing as the AI front desk (prices, booking, same-day emergency)", () => {
    expect(step({ step: "menu" }, { type: "text", text: "¿Cuánto cuesta una limpieza?" }, ctx).replies[0]).toEqual({
      kind: "answer",
      route: { intent: "prices", action: "answer" },
    });
    expect(step({ step: "menu" }, { type: "text", text: "Je voudrais un rendez-vous" }, ctx).state).toEqual({ step: "pickTreatment" });
    expect(step({ step: "menu" }, { type: "text", text: "urgencia" }, ctx).replies[0].kind).toBe("queue");
  });

  it("uses the routing returned by the API if there is one", () => {
    const out = step({ step: "menu" }, { type: "text", text: "anything", route: { intent: "hours", action: "answer" } }, ctx);
    expect(out.replies[0]).toEqual({ kind: "answer", route: { intent: "hours", action: "answer" } });
  });

  it("goes back to treatment choice for an unknown treatment", () => {
    expect(step({ step: "pickTreatment" }, { type: "treatment", slug: "unknown" }, ctx).state).toEqual({ step: "pickTreatment" });
  });
});
