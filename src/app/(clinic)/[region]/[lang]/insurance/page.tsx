import { getTreatments } from "@/content";
import { PageHead, pageTitle } from "@/components/PageHead";
import { usPriceLabel } from "@/components/usPrice";
import { paramsFor, resolve, type PageParams } from "../params";

// The insurance page is only in the US version
export const dynamicParams = false;
export const generateStaticParams = () => paramsFor(["us"]);
export async function generateMetadata({ params }: { params: PageParams }) {
  return { title: pageTitle("insurance", (await params).lang as "en") };
}

const PLANS = {
  en: ["Most PPO dental plans", "Texas Medicaid and CHIP for children (sample)", "In-house membership plan for patients without insurance", "Monthly payment plans through third-party financing"],
  es: ["La mayoría de los planes dentales PPO", "Medicaid de Texas y CHIP para niños (ejemplo)", "Plan de membresía propio para pacientes sin seguro", "Pagos mensuales con financiación externa"],
};

export default async function Insurance({ params }: { params: PageParams }) {
  const { lang } = await resolve(params);
  const plans = PLANS[lang === "es" ? "es" : "en"];
  return (
    <div className="wrap">
      <PageHead page="insurance" lang={lang} />
      <ul className="prose">{plans.map((p) => <li key={p}>{p}</li>)}</ul>
      <section className="block">
        <div className="rows">
          {getTreatments().map((t) => (
            <div key={t.slug} className="row">
              <span>{t.name[lang]}</span>
              <span>{usPriceLabel(t, lang)}</span>
            </div>
          ))}
        </div>
        <p className="small">{lang === "es" ? "Importes de ejemplo para esta demo." : "Sample amounts for this demo."}</p>
      </section>
    </div>
  );
}
