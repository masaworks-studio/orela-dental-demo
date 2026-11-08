import { describe, expect, it } from "vitest";
import { CLINICS, FAQS, TEAM, TREATMENTS, TRUST } from "./data";
import { fromHHMM, fromSanityDocuments, toHHMM, toSanityDocuments } from "./sanity-map";

const local = { clinics: CLINICS, treatments: TREATMENTS, team: TEAM, faqs: FAQS, trust: TRUST };

describe("sanity-map", () => {
  it("site data -> Sanity documents -> site data gives back the original", () => {
    // Sanity returns JSON, so pass it through JSON before converting back
    const docs = JSON.parse(JSON.stringify(toSanityDocuments(local)));
    expect(fromSanityDocuments(docs)).toEqual(local);
  });

  it("document _ids do not overlap", () => {
    const ids = toSanityDocuments(local).map((d) => d._id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("sort order is decided by order (not by the order Sanity returns)", () => {
    const docs = JSON.parse(JSON.stringify(toSanityDocuments(local))).reverse();
    expect(fromSanityDocuments(docs).treatments.map((t) => t.slug)).toEqual(TREATMENTS.map((t) => t.slug));
  });

  it("time \"09:30\" <-> 570 minutes", () => {
    expect(toHHMM(570)).toBe("09:30");
    expect(fromHHMM("09:30")).toBe(570);
    expect(fromHHMM("20:00")).toBe(1200);
  });

  it("throws when clinic settings are missing, instead of silently leaving them empty", () => {
    const docs = toSanityDocuments(local).filter((d) => d._id !== "clinic-us");
    expect(() => fromSanityDocuments(docs)).toThrow(/clinic/);
  });
});
