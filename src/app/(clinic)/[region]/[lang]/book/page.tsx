import { Suspense } from "react";
import { getTreatments } from "@/content";
import { BookingFlow } from "@/components/BookingFlow";
import { PageHead, pageTitle } from "@/components/PageHead";
import { paramsFor, resolve, type PageParams } from "../params";

export const dynamicParams = false;
export const generateStaticParams = () => paramsFor();
export async function generateMetadata({ params }: { params: PageParams }) {
  return { title: pageTitle("book", (await params).lang as "en") };
}

export default async function Book({ params }: { params: PageParams }) {
  const { lang, clinic } = await resolve(params);
  const treatments = getTreatments().map(({ slug, name, bookable, minutes }) => ({ slug, name, bookable, minutes }));
  return (
    <div className="wrap">
      <PageHead page="book" lang={lang} />
      <div style={{ maxWidth: 560 }}>
        <Suspense>
          <BookingFlow clinic={clinic} lang={lang} treatments={treatments} />
        </Suspense>
      </div>
    </div>
  );
}
