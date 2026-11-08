import { AreaMap } from "@/components/AreaMap";
import { PageHead, pageTitle } from "@/components/PageHead";
import { HoursTable } from "@/components/SiteChrome";
import { CLINIC_TEXT } from "@/i18n/clinicPage";
import { paramsFor, resolve, type PageParams } from "../params";

export const dynamicParams = false;
export const generateStaticParams = () => paramsFor();
export async function generateMetadata({ params }: { params: PageParams }) {
  return { title: pageTitle("contact", (await params).lang as "en") };
}

const EMAIL = { es: "hola@orela.example", us: "hello@orela.example" } as const;

/** Contact: address, phone, email, opening hours and a map of the area (shown as is) */
export default async function Contact({ params }: { params: PageParams }) {
  const { lang, clinic, msg } = await resolve(params);
  return (
    <div className="wrap">
      <PageHead page="contact" lang={lang} />
      <div className="contact-grid">
        <div className="prose">
          <h2>{msg.footer.address}</h2>
          <p>{clinic.name}<br />{clinic.address}<br />{clinic.area}</p>
          <h2>{msg.footer.phone}</h2>
          <p><a href={clinic.phoneHref}>{clinic.phone}</a></p>
          <h2>{CLINIC_TEXT.email[lang]}</h2>
          <p><a href={`mailto:${EMAIL[clinic.region]}`}>{EMAIL[clinic.region]}</a></p>
          <h2>{msg.footer.hours}</h2>
          <HoursTable clinic={clinic} lang={lang} />
        </div>
        <AreaMap lang={lang} region={clinic.region} />
      </div>
    </div>
  );
}
