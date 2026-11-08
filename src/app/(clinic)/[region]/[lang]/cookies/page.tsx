import { COOKIES } from "@/i18n/legal";
import { PageHead, pageTitle } from "@/components/PageHead";
import { Sections } from "@/components/Sections";
import { paramsFor, resolve, type PageParams } from "../params";

export const dynamicParams = false;
export const generateStaticParams = () => paramsFor(["es"]);
export async function generateMetadata({ params }: { params: PageParams }) {
  return { title: pageTitle("cookies", (await params).lang as "en") };
}

export default async function Page({ params }: { params: PageParams }) {
  const { lang } = await resolve(params);
  return (
    <div className="wrap">
      <PageHead page="cookies" lang={lang} />
      <Sections sections={COOKIES[lang]} />
    </div>
  );
}
