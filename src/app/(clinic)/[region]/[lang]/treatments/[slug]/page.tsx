import Link from "next/link";
import { notFound } from "next/navigation";
import { getTreatment, getTreatments } from "@/content";
import { isLocaleOf, isRegion } from "@/i18n/config";
import { fill } from "@/i18n/messages";
import { formatDuration, formatPrice } from "@/lib/clinic/format";
import { clinicPath } from "@/components/paths";
import { Photo } from "@/components/Photo";
import { usPriceLabel } from "@/components/usPrice";
import { paramsFor, resolve } from "../../params";

type P = Promise<{ region: string; lang: string; slug: string }>;

export const dynamicParams = false;
export const generateStaticParams = () =>
  paramsFor().flatMap((p) => getTreatments().map((t) => ({ ...p, slug: t.slug })));

export async function generateMetadata({ params }: { params: P }) {
  const { region, lang, slug } = await params;
  const t = getTreatment(slug);
  if (!t || !isRegion(region) || !isLocaleOf(region, lang)) return {};
  return { title: t.name[lang] };
}

export default async function TreatmentPage({ params }: { params: P }) {
  const { slug } = await params;
  const { region, lang, msg } = await resolve(params);
  const t = getTreatment(slug);
  if (!t) notFound();
  return (
    <div className="wrap">
      <div className="page-head">
        <p className="small">
          <Link href={clinicPath(region, lang, "treatments")}>← {msg.nav.treatments}</Link>
        </p>
        <h1>{t.name[lang]}</h1>
        <p>{t.summary[lang]}</p>
      </div>
      <div className="hero" style={{ paddingTop: 16 }}>
        <div className="prose">
          <p>{t.body[lang]}</p>
          <p>
            <span className="tag">{formatDuration(t.minutes, lang)}</span>
            <strong>{region === "es" ? fill(msg.from, { p: formatPrice(t.priceFrom, region, lang) }) : usPriceLabel(t, lang)}</strong>
          </p>
        </div>
        <div className="card">
          {t.bookable ? (
            <Link className="btn" href={clinicPath(region, lang, "book")}>{msg.book.cta}</Link>
          ) : (
            <Link className="btn" href={clinicPath(region, lang, "emergency")}>{msg.emergency.take}</Link>
          )}
        </div>
      </div>
      <Photo src={`/images/treatments/${t.slug}.jpg`} alt={fill(msg.photoAlt.treatment, { name: t.name[lang] })} label={msg.aiLabel} />
    </div>
  );
}
