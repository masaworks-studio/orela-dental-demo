import { PRIVACY } from "@/i18n/legal";
import { PageHead, pageTitle } from "@/components/PageHead";
import { Sections } from "@/components/Sections";
import { paramsFor, resolve, type PageParams } from "../params";

export const dynamicParams = false;
export const generateStaticParams = () => paramsFor();
export async function generateMetadata({ params }: { params: PageParams }) {
  return { title: pageTitle("privacy", (await params).lang as "en") };
}

export default async function Page({ params }: { params: PageParams }) {
  const { lang } = await resolve(params);
  return (
    <div className="wrap">
      <PageHead page="privacy" lang={lang} />
      <Sections sections={PRIVACY[lang]} />
    </div>
  );
}
