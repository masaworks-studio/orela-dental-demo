import { defineField, defineType } from "sanity";

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const openingHours = defineType({
  name: "openingHours",
  title: "Opening hours",
  type: "object",
  fields: [
    defineField({
      name: "day",
      type: "number",
      options: {
        list: [
          { title: "Monday", value: 1 },
          { title: "Tuesday", value: 2 },
          { title: "Wednesday", value: 3 },
          { title: "Thursday", value: 4 },
          { title: "Friday", value: 5 },
          { title: "Saturday", value: 6 },
          { title: "Sunday", value: 0 },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "start", type: "string", description: "24-hour time, e.g. 09:00", validation: (r) => r.required().regex(HHMM) }),
    defineField({ name: "end", type: "string", description: "24-hour time, e.g. 14:00", validation: (r) => r.required().regex(HHMM) }),
  ],
  preview: {
    select: { day: "day", start: "start", end: "end" },
    prepare: ({ day, start, end }) => ({
      title: `${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day ?? 0]} ${start}–${end}`,
    }),
  },
});

export const clinic = defineType({
  name: "clinic",
  title: "Clinic",
  type: "document",
  description: "Fictional clinic. Do not enter a real address or phone number.",
  fields: [
    defineField({ name: "region", type: "string", options: { list: ["es", "us"] }, readOnly: true }),
    defineField({ name: "key", type: "string", readOnly: true, description: "Used to generate stable demo data (free times, queue)." }),
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "area", type: "string" }),
    defineField({ name: "address", type: "string", description: "Fictional address." }),
    defineField({ name: "phone", type: "string", description: "Fictional number. US: use the 555-01xx range." }),
    defineField({ name: "phoneHref", type: "string", description: "tel: link, e.g. tel:+17135550142" }),
    defineField({ name: "sos", type: "string", title: "Emergency number", description: "112 (Spain) / 911 (US)" }),
    defineField({ name: "messaging", type: "string", options: { list: ["whatsapp", "sms"] } }),
    defineField({ name: "timeZone", type: "string", description: "IANA time zone, e.g. Europe/Madrid" }),
    defineField({ name: "hours", type: "array", of: [{ type: "openingHours" }] }),
    defineField({ name: "closedDates", type: "array", of: [{ type: "date" }], description: "Public holidays and other closed days." }),
  ],
  preview: { select: { title: "name", subtitle: "area" } },
});
