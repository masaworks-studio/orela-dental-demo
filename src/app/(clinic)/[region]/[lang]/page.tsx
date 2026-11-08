import Link from "next/link";
import { getTreatments, getTrust, languageCount } from "@/content";
import { fill } from "@/i18n/messages";
import { formatPrice } from "@/lib/clinic/format";
import { clinicPath } from "@/components/paths";
import { HeroMedia } from "@/components/HeroMedia";
import { SlotPicker } from "@/components/SlotPicker";
import { usPriceLabel } from "@/components/usPrice";
import { paramsFor, resolve, type PageParams } from "./params";

export const dynamicParams = false;
export const generateStaticParams = () => paramsFor();

export default async function Home({ params }: { params: PageParams }) {
  const { region, lang, clinic, msg } = await resolve(params);
  const trust = getTrust();
  const treatments = getTreatments().filter((t) => t.bookable).slice(0, 4);

  return (
    <div className="wrap">
      <div className="hero">
        <div>
          <h1>{msg.hero.title}</h1>
          <p className="lede">{msg.hero.lede}</p>
        </div>
        <SlotPicker clinic={clinic} lang={lang} />
      </div>

      <HeroMedia region={region} alt={msg.photoAlt.hero} label={msg.aiLabel} videoLabel={msg.aiVideoLabel} pause={msg.motion.pause} play={msg.motion.play} />

      <div className="facts">
        <div>
          <b>{trust.rating}</b>
          <span>{msg.facts.rating}</span>
        </div>
        <div>
          <b>{trust.years}</b>
          <span>{msg.facts.years}</span>
        </div>
        <div>
          <b>{languageCount(region)}</b>
          <span>{msg.facts.languages}</span>
        </div>
      </div>

      <section className="block">
        <h2>{region === "es" ? msg.sections.prices : msg.sections.insurance}</h2>
        <div className="rows">
          {treatments.map((t) => (
            <Link key={t.slug} className="row" href={clinicPath(region, lang, `treatments/${t.slug}`)}>
              <span>{t.name[lang]}</span>
              <span>{region === "es" ? fill(msg.from, { p: formatPrice(t.priceFrom, region, lang) }) : usPriceLabel(t, lang)}</span>
            </Link>
          ))}
        </div>
        <p>
          <Link href={clinicPath(region, lang, "treatments")}>{msg.sections.seeAll} →</Link>
        </p>
      </section>
      <p className="small">{clinic.area}</p>
    </div>
  );
}
