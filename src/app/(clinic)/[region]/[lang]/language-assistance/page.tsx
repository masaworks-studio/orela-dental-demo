import { TAGLINE_NOTE, TAGLINES } from "@/i18n/legal";
import { PageHead, pageTitle } from "@/components/PageHead";
import { paramsFor, resolve, type PageParams } from "../params";

export const dynamicParams = false;
export const generateStaticParams = () => paramsFor(["us"]);
export async function generateMetadata({ params }: { params: PageParams }) {
  return { title: pageTitle("language-assistance", (await params).lang as "en") };
}

export default async function Page({ params }: { params: PageParams }) {
  const { lang, clinic } = await resolve(params);
  return (
    <div className="wrap">
      <PageHead page="language-assistance" lang={lang} />
      <div className="rows prose">
        {TAGLINES.filter((t) => t.lang !== lang).map((t) => (
          <p key={t.lang} className="row" lang={t.lang} dir={t.dir}>
            <span>{t.text}</span>
            <span>{t.name}</span>
          </p>
        ))}
      </div>
      <p style={{ marginTop: 24 }}>
        <a className="btn btn-inline" href={clinic.phoneHref}>{clinic.phone}</a>
      </p>
      <p className="small prose">{TAGLINE_NOTE[lang === "es" ? "es" : "en"]}</p>
    </div>
  );
}
