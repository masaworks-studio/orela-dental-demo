import { EmergencyQueue } from "@/components/EmergencyQueue";
import { PageHead, pageTitle } from "@/components/PageHead";
import { paramsFor, resolve, type PageParams } from "../params";

export const dynamicParams = false;
export const generateStaticParams = () => paramsFor();
export async function generateMetadata({ params }: { params: PageParams }) {
  return { title: pageTitle("emergency", (await params).lang as "en") };
}

export default async function Emergency({ params }: { params: PageParams }) {
  const { lang, clinic } = await resolve(params);
  return (
    <div className="wrap">
      <PageHead page="emergency" lang={lang} />
      <div style={{ maxWidth: 560 }}>
        <EmergencyQueue clinic={clinic} lang={lang} />
      </div>
    </div>
  );
}
