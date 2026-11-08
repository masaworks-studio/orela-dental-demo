// WhatsApp/SMS conversation flow (menu-based). Independent of the UI; handles only state and replies.
// Free-text routing uses the same receptionist.ts (route) as the AI front desk. Symptom talk is stopped first, even mid-booking.
// Built so this function can be used as is when connected to real WhatsApp (webhook).

import { nextFreeSlots } from "./slots";
import { emergencyQueue, type QueueStatus } from "./queue";
import { route as routeText, type Route } from "./receptionist";
import type { ClinicSchedule, LocalTime, Slot } from "./types";

export type MenuId = "book" | "change" | "emergency" | "location" | "human";
export const MENU: MenuId[] = ["book", "change", "emergency", "location", "human"];

export type FlowState =
  | { step: "menu" }
  | { step: "pickTreatment" }
  | { step: "pickSlot"; treatment: string }
  | { step: "askName"; treatment: string; slot: Slot };

export type FlowEvent =
  | { type: "start" }
  | { type: "menu"; id: MenuId }
  | { type: "treatment"; slug: string }
  | { type: "slot"; slot: Slot }
  | { type: "text"; text: string; route?: Route };

export type Reply =
  | { kind: "welcome" }
  | { kind: "menu" }
  | { kind: "treatments"; options: string[] }
  | { kind: "slots"; treatment: string; slots: Slot[] }
  | { kind: "noSlots" }
  | { kind: "askName"; treatment: string; slot: Slot }
  | { kind: "booked"; treatment: string; slot: Slot; name: string }
  | { kind: "queue"; status: QueueStatus }
  | { kind: "location" }
  | { kind: "handoff"; reason: "change" | "human" | "unknown" }
  | { kind: "answer"; route: Route };

export type FlowContext = {
  clinicKey: string;
  schedule: ClinicSchedule;
  now: LocalTime;
  /** Bookable treatments (in display order) */
  treatments: string[];
};

const MAX_NAME = 60;

function startBooking(ctx: FlowContext): { state: FlowState; replies: Reply[] } {
  return { state: { step: "pickTreatment" }, replies: [{ kind: "treatments", options: ctx.treatments }] };
}

function offerSlots(ctx: FlowContext, treatment: string): { state: FlowState; replies: Reply[] } {
  const slots = nextFreeSlots(ctx.clinicKey, ctx.schedule, ctx.now, { count: 3 });
  if (slots.length === 0) return { state: { step: "menu" }, replies: [{ kind: "noSlots" }, { kind: "menu" }] };
  return { state: { step: "pickSlot", treatment }, replies: [{ kind: "slots", treatment, slots }] };
}

export function step(state: FlowState, event: FlowEvent, ctx: FlowContext): { state: FlowState; replies: Reply[] } {
  switch (event.type) {
    case "start":
      return { state: { step: "menu" }, replies: [{ kind: "welcome" }, { kind: "menu" }] };

    case "menu":
      switch (event.id) {
        case "book":
          return startBooking(ctx);
        case "change":
          return { state: { step: "menu" }, replies: [{ kind: "handoff", reason: "change" }] };
        case "emergency":
          return { state: { step: "menu" }, replies: [{ kind: "queue", status: emergencyQueue(ctx.clinicKey, ctx.schedule, ctx.now) }] };
        case "location":
          return { state: { step: "menu" }, replies: [{ kind: "location" }] };
        case "human":
          return { state: { step: "menu" }, replies: [{ kind: "handoff", reason: "human" }] };
      }
      break;

    case "treatment":
      if (!ctx.treatments.includes(event.slug)) return startBooking(ctx);
      return offerSlots(ctx, event.slug);

    case "slot":
      if (state.step !== "pickSlot") return { state, replies: [{ kind: "menu" }] };
      return { state: { step: "askName", treatment: state.treatment, slot: event.slot }, replies: [{ kind: "askName", treatment: state.treatment, slot: event.slot }] };

    case "text": {
      const r = event.route ?? routeText(event.text);
      // Symptom talk is stopped first at any step and pointed to the phone (even mid-booking)
      if (r.intent === "symptom") return { state, replies: [{ kind: "answer", route: r }] };
      // While asking for a name, take the input as the name
      if (state.step === "askName") {
        const name = event.text.trim().slice(0, MAX_NAME);
        if (!name) return { state, replies: [{ kind: "askName", treatment: state.treatment, slot: state.slot }] };
        return { state: { step: "menu" }, replies: [{ kind: "booked", treatment: state.treatment, slot: state.slot, name }, { kind: "menu" }] };
      }
      switch (r.action) {
        case "open-booking":
          return startBooking(ctx);
        case "open-emergency":
          return { state: { step: "menu" }, replies: [{ kind: "queue", status: emergencyQueue(ctx.clinicKey, ctx.schedule, ctx.now) }] };
        case "handoff":
          return { state: { step: "menu" }, replies: [{ kind: "handoff", reason: r.intent === "cancel" ? "change" : r.intent === "human" ? "human" : "unknown" }] };
        case "answer":
          if (r.intent === "greeting") return { state: { step: "menu" }, replies: [{ kind: "welcome" }, { kind: "menu" }] };
          if (r.intent === "location") return { state, replies: [{ kind: "location" }] };
          return { state, replies: [{ kind: "answer", route: r }] };
        default:
          return { state, replies: [{ kind: "answer", route: r }] };
      }
    }
  }
  return { state, replies: [{ kind: "menu" }] };
}
