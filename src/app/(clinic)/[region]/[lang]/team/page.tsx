import { getTeam } from "@/content";
import { LOCALE_NAMES, type Locale } from "@/i18n/config";
import { fill } from "@/i18n/messages";
import { PageHead, pageTitle } from "@/components/PageHead";
import { Photo } from "@/components/Photo";
import { slugify } from "@/components/slugify";
import { paramsFor, resolve, type PageParams } from "../params";

export const dynamicParams = false;
export const generateStaticParams = () => paramsFor();
export async function generateMetadata({ params }: { params: PageParams }) {
  return { title: pageTitle("team", (await params).lang as "en") };
}

export default async function Team({ params }: { params: PageParams }) {
  const { region, lang, msg } = await resolve(params);
  return (
    <div className="wrap">
      <PageHead page="team" lang={lang} />
      <div className="grid">
        {getTeam(region).map((m) => (
          <div key={m.name} className="card">
            <Photo src={`/images/team/${slugify(m.name)}.jpg`} alt={fill(msg.photoAlt.team, { name: m.name })} label={msg.aiLabel} className="photo photo-portrait" />
            <h3>{m.name}</h3>
            <p className="muted">{m.role[lang]}</p>
            <p>{m.bio[lang]}</p>
            <p>{m.languages.map((l) => <span key={l} className="tag">{LOCALE_NAMES[l as Locale] ?? l}</span>)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
