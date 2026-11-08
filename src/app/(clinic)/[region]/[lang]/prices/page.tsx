import Link from "next/link";
import { getTreatments } from "@/content";
import { fill } from "@/i18n/messages";
import { formatPrice } from "@/lib/clinic/format";
import { PageHead, pageTitle } from "@/components/PageHead";
import { clinicPath } from "@/components/paths";
import { paramsFor, resolve, type PageParams } from "../params";

// The price list is only in the EU version (the US version has the insurance page)
export const dynamicParams = false;
export const generateStaticParams = () => paramsFor(["es"]);
export async function generateMetadata({ params }: { params: PageParams }) {
  return { title: pageTitle("prices", (await params).lang as "en") };
}

export default async function Prices({ params }: { params: PageParams }) {
  const { region, lang, msg } = await resolve(params);
  return (
    <div className="wrap">
      <PageHead page="prices" lang={lang} />
      <div className="rows">
        {getTreatments().map((t) => (
          <Link key={t.slug} className="row" href={clinicPath(region, lang, `treatments/${t.slug}`)}>
            <span>{t.name[lang]}</span>
            <span>{fill(msg.from, { p: formatPrice(t.priceFrom, region, lang) })}</span>
          </Link>
        ))}
      </div>
      <p className="small">{msg.book.sample.split(".")[0]}.</p>
    </div>
  );
}
