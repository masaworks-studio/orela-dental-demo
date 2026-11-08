import { getFaqs } from "@/content";
import { PageHead, pageTitle } from "@/components/PageHead";
import { paramsFor, resolve, type PageParams } from "../params";

export const dynamicParams = false;
export const generateStaticParams = () => paramsFor();
export async function generateMetadata({ params }: { params: PageParams }) {
  return { title: pageTitle("faq", (await params).lang as "en") };
}

export default async function Faq({ params }: { params: PageParams }) {
  const { region, lang } = await resolve(params);
  return (
    <div className="wrap">
      <PageHead page="faq" lang={lang} />
      <div className="prose">
        {getFaqs(region).map((f) => (
          <details key={f.topic}>
            <summary>{f.question[lang]}</summary>
            <p>{f.answer[lang]}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
