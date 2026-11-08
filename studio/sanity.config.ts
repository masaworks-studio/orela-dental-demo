import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

// The project ID and dataset are safe to make public (reading is public data, no key needed)
export default defineConfig({
  name: "default",
  title: "Orela Dental (demo)",
  projectId: "w7b2l6xq",
  dataset: "production",
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});
