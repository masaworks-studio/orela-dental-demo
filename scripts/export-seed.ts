// Writes the current fictional sample data (src/content/data.ts) in a format that can be imported into Sanity (NDJSON).
// Run: npm run seed:export -> studio/seed/content.ndjson
import { writeFileSync } from "node:fs";
import { CLINICS, FAQS, TEAM, TREATMENTS, TRUST } from "../src/content/data";
import { toSanityDocuments } from "../src/content/sanity-map";

const docs = toSanityDocuments({ clinics: CLINICS, treatments: TREATMENTS, team: TEAM, faqs: FAQS, trust: TRUST });
writeFileSync("studio/seed/content.ndjson", docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
console.log(`Wrote ${docs.length} documents to studio/seed/content.ndjson`);
