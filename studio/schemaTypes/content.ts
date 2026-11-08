import { defineField, defineType } from "sanity";

const order = defineField({ name: "order", type: "number", description: "Lower numbers come first." });

export const treatment = defineType({
  name: "treatment",
  title: "Treatment",
  type: "document",
  fields: [
    order,
    defineField({ name: "slug", type: "slug", description: "Part of the page URL.", validation: (r) => r.required() }),
    defineField({ name: "name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "summary", type: "localeText" }),
    defineField({ name: "body", type: "localeText" }),
    defineField({ name: "minutes", type: "number", title: "Duration (minutes)" }),
    defineField({ name: "priceFrom", type: "number", title: "Spain: starting price (EUR)", description: "Sample price for the demo." }),
    defineField({
      name: "usKind",
      title: "US: how the price is shown",
      type: "string",
      options: { list: [{ title: "Covered by most plans", value: "covered" }, { title: "Monthly payment", value: "monthly" }, { title: "Fixed fee", value: "fee" }] },
    }),
    defineField({ name: "usAmount", title: "US: amount (USD)", type: "number", description: "Monthly amount or fixed fee. Not used for 'covered'." }),
    defineField({ name: "bookable", type: "boolean", description: "Off for same-day emergencies (they use the queue)." }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name.en", subtitle: "slug.current" } },
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  description: "Fictional people only.",
  fields: [
    order,
    defineField({ name: "region", type: "string", options: { list: ["es", "us"] }, validation: (r) => r.required() }),
    defineField({ name: "name", type: "string", validation: (r) => r.required(), description: "Photo file: public/images/team/<name-as-slug>.jpg" }),
    defineField({ name: "role", type: "localeString" }),
    defineField({ name: "bio", type: "localeText" }),
    defineField({ name: "hygienist", type: "boolean", description: "Shown as the patient's own hygienist." }),
    defineField({ name: "languages", type: "array", of: [{ type: "string" }], options: { list: ["en", "es", "ca", "fr"] } }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "region" } },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    order,
    defineField({ name: "region", type: "string", options: { list: ["es", "us", "both"] }, validation: (r) => r.required() }),
    defineField({ name: "topic", type: "string", description: "Short ID, e.g. booking, cancel." }),
    defineField({ name: "question", type: "localeString" }),
    defineField({ name: "answer", type: "localeText" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question.en", subtitle: "region" } },
});

export const trustNumbers = defineType({
  name: "trustNumbers",
  title: "Trust numbers",
  type: "document",
  description: "One place for figures shown across the site, so pages never disagree. Sample values.",
  fields: [
    defineField({ name: "rating", type: "number", validation: (r) => r.min(0).max(5) }),
    defineField({ name: "years", type: "number", title: "Years in the area" }),
  ],
});
