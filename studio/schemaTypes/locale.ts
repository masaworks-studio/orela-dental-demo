import { defineType } from "sanity";

// Text in four languages. The EU version uses es, ca, en and fr; the US version uses en and es
const langs = [
  { name: "en", title: "English" },
  { name: "es", title: "Español" },
  { name: "ca", title: "Català" },
  { name: "fr", title: "Français" },
];

export const localeString = defineType({
  name: "localeString",
  title: "Text (4 languages)",
  type: "object",
  fields: langs.map((l) => ({ ...l, type: "string" })),
});

export const localeText = defineType({
  name: "localeText",
  title: "Long text (4 languages)",
  type: "object",
  fields: langs.map((l) => ({ ...l, type: "text", rows: 3 })),
});
