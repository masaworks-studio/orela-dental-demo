import { describe, expect, it } from "vitest";
import { buildBookingPayload, maskPhone, normalizePhone, zonedIso } from "./booking-payload";

const base = {
  clinicKey: "orela-bcn",
  timeZone: "Europe/Madrid",
  date: "2026-11-10",
  start: 600,
  minutes: 45,
  treatment: "checkup",
  name: "  Test Patient ",
  phone: "+34 600 00 00 00",
  lang: "es",
  channel: "web" as const,
};

describe("booking payload", () => {
  it("writes times with the local offset (Madrid +01:00 in winter, +02:00 in summer; Houston -06:00 in winter)", () => {
    expect(zonedIso("2026-11-10", 600, "Europe/Madrid")).toBe("2026-11-10T10:00:00+01:00");
    expect(zonedIso("2026-07-01", 570, "Europe/Madrid")).toBe("2026-07-01T09:30:00+02:00");
    expect(zonedIso("2026-11-10", 480, "America/Chicago")).toBe("2026-11-10T08:00:00-06:00");
  });

  it("the same booking always gets the same idempotencyKey (so two deliveries become one record)", () => {
    expect(buildBookingPayload(base).idempotencyKey).toBe(buildBookingPayload({ ...base, name: "Other" }).idempotencyKey);
    expect(buildBookingPayload(base).idempotencyKey).not.toBe(buildBookingPayload({ ...base, start: 630 }).idempotencyKey);
  });

  it("matches patients by phone number, and spaces or symbols do not create a different person", () => {
    expect(normalizePhone("+34 600-00 00 00")).toBe("+34600000000");
    expect(buildBookingPayload(base).patient.phone).toBe(buildBookingPayload({ ...base, phone: "+34 600-000-000" }).patient.phone);
  });

  it("includes no health data, and stops follow-ups once a booking is made", () => {
    const p = buildBookingPayload(base);
    expect(p.containsHealthData).toBe(false);
    expect(JSON.stringify(p)).not.toMatch(/symptom|pain|dolor/i);
    expect(p.crm.stopFollowUps).toContain("waitlist-offer");
    expect(p.patient.name).toBe("Test Patient");
  });

  it("hides most of the phone number on screen", () => {
    expect(maskPhone("+34 600 00 12 34")).toBe("••••••••1234"); // only the last 4 of the 12 characters in +34600001234
  });
});
