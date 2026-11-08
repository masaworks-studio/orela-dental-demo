import Link from "next/link";
import { getTreatments } from "@/content";
import { fill } from "@/i18n/messages";
import { formatDuration, formatPrice } from "@/lib/clinic/format";
import { PageHead, pageTitle } from "@/components/PageHead";
import { clinicPath } from "@/components/paths";
import { usPriceLabel } from "@/components/usPrice";
import { paramsFor, resolve, type PageParams } from "../params";

export const dynamicParams = false;
export const generateStaticParams = () => paramsFor();
export async function generateMetadata({ params }: { params: PageParams }) {
  return { title: pageTitle("treatments", (await params).lang as "en") };
}

export default async function Treatments({ params }: { params: PageParams }) {
  const { region, lang, msg } = await resolve(params);
  return (
    <div className="wrap">
      <PageHead page="treatments" lang={lang} />
      <div className="grid">
        {getTreatments().map((t) => (
          <Link key={t.slug} className="card" style={{ textDecoration: "none" }} href={clinicPath(region, lang, `treatments/${t.slug}`)}>
            <h3>{t.name[lang]}</h3>
            <p className="muted">{t.summary[lang]}</p>
            <p>
              <span className="tag">{formatDuration(t.minutes, lang)}</span>
              <strong>{region === "es" ? fill(msg.from, { p: formatPrice(t.priceFrom, region, lang) }) : usPriceLabel(t, lang)}</strong>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
