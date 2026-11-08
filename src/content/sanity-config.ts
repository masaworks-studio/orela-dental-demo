// Sanity connection settings. The project ID and dataset are safe to make public (the data is public, and no key is needed to read it).
// The write key (API token) is never stored in this repository or on the site.
export const SANITY = {
  projectId: "w7b2l6xq",
  dataset: "production",
  apiVersion: "2025-02-19",
} as const;

export const CONTENT_TYPES = ["clinic", "treatment", "teamMember", "faq", "trustNumbers"] as const;

/** URL for reading public data (via the CDN, no key) */
export function sanityQueryUrl(query: string): string {
  const { projectId, dataset, apiVersion } = SANITY;
  return `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
}

/** Where the snapshot is stored (created at build time, not committed to git) */
export const SNAPSHOT_PATH = "src/content/.generated/snapshot.json";
