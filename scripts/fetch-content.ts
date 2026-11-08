// Before the build, reads Sanity's public data and saves it as a snapshot (runs automatically in prebuild of npm run build).
// If it cannot be read or the content is empty, the snapshot is deleted, a warning is shown,
// and the site is built from the fictional sample data in src/content/data.ts (the build does not stop).
// With CONTENT_SOURCE=local, Sanity is not read and the site is built from the fictional sample data.
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { CONTENT_TYPES, SNAPSHOT_PATH, sanityQueryUrl } from "../src/content/sanity-config";
import { fromSanityDocuments } from "../src/content/sanity-map";

function fallback(reason: string): void {
  rmSync(SNAPSHOT_PATH, { force: true });
  console.warn(`\n⚠ Content: using local fallback data (src/content/data.ts). Reason: ${reason}\n`);
}

async function main(): Promise<void> {
  if (process.env.CONTENT_SOURCE === "local") return fallback("CONTENT_SOURCE=local");
  const query = `*[_type in ${JSON.stringify(CONTENT_TYPES)} && !(_id in path("drafts.**"))]`;
  let docs: unknown[];
  try {
    const res = await fetch(sanityQueryUrl(query), { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) return fallback(`Sanity responded ${res.status}`);
    docs = ((await res.json()) as { result?: unknown[] }).result ?? [];
  } catch (e) {
    return fallback(`could not reach Sanity (${(e as Error).message})`);
  }
  if (docs.length === 0) {
    return fallback("Sanity returned no documents. Import the seed (studio: npm run import-seed) and check the dataset is Public.");
  }
  try {
    const content = fromSanityDocuments(docs as Record<string, unknown>[]);
    mkdirSync(dirname(SNAPSHOT_PATH), { recursive: true });
    writeFileSync(SNAPSHOT_PATH, JSON.stringify({ fetchedAt: new Date().toISOString(), content }, null, 2));
    console.log(`✓ Content: loaded ${docs.length} documents from Sanity`);
  } catch (e) {
    fallback(`Sanity data is incomplete (${(e as Error).message})`);
  }
}

void main();
