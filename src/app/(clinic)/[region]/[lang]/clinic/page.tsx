import Link from "next/link";
import { PageHead, pageTitle } from "@/components/PageHead";
import { Photo } from "@/components/Photo";
import { clinicPath } from "@/components/paths";
import { CLINIC_POINTS, CLINIC_TEXT } from "@/i18n/clinicPage";
import { paramsFor, resolve, type PageParams } from "../params";

export const dynamicParams = false;
export const generateStaticParams = () => paramsFor();
export async function generateMetadata({ params }: { params: PageParams }) {
  return { title: pageTitle("clinic", (await params).lang as "en") };
}

/** Clinic introduction: photos of the room and front desk (AI-generated, the same as on other pages) and how the clinic works */
export default async function ClinicPage({ params }: { params: PageParams }) {
  const { region, lang, msg } = await resolve(params);
  return (
    <div className="wrap">
      <PageHead page="clinic" lang={lang} />
      <h2 className="visually-hidden">{CLINIC_TEXT.spaceTitle[lang]}</h2>
      <div className="clinic-photos">
        <Photo src={`/images/hero-${region}.jpg`} alt={CLINIC_TEXT.roomAlt[lang]} label={msg.aiLabel} />
        <Photo src="/images/treatments/emergency.jpg" alt={CLINIC_TEXT.receptionAlt[lang]} label={msg.aiLabel} />
      </div>
      <h2>{CLINIC_TEXT.whyTitle[lang]}</h2>
      <ul className="clinic-points">
        {CLINIC_POINTS[region].map((pt) => (
          <li key={pt.h.en}>
            <h3>{pt.h[lang]}</h3>
            <p>{pt.p[lang]}</p>
          </li>
        ))}
      </ul>
      <p style={{ marginBottom: 48 }}>
        <Link href={clinicPath(region, lang, "team")}>{CLINIC_TEXT.meetTeam[lang]} →</Link>
      </p>
    </div>
  );
}
