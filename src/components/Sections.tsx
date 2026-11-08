import type { Section } from "@/i18n/legal";

export function Sections({ sections }: { sections: Section[] }) {
  return (
    <div className="prose">
      {sections.map((s) => (
        <section key={s.h} className="block" style={{ paddingTop: 16, paddingBottom: 16 }}>
          <h2>{s.h}</h2>
          <ul>
            {s.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
