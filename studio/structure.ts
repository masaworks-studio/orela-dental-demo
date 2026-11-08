import type { StructureResolver } from "sanity/structure";

// Order of the list on the left. Clinic settings and trust figures are shown as single ("only one") documents
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem().title("Clinic — Spain (Barcelona)").child(S.document().schemaType("clinic").documentId("clinic-es")),
      S.listItem().title("Clinic — US (Houston)").child(S.document().schemaType("clinic").documentId("clinic-us")),
      S.divider(),
      S.documentTypeListItem("treatment").title("Treatments"),
      S.documentTypeListItem("teamMember").title("Team"),
      S.documentTypeListItem("faq").title("FAQ"),
      S.divider(),
      S.listItem().title("Trust numbers").child(S.document().schemaType("trustNumbers").documentId("trust")),
    ]);
