import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SectionHeading from "@/components/SectionHeading";
import CabinCard from "@/components/CabinCard";
import Reveal from "@/components/Reveal";
import { cabins, localizeCabin } from "@/data/cabins";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "Smestaj" });
  return { title: `${t("title")} — Etno selo Raonica`, description: t("description") };
}

export default async function SmestajPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("Smestaj");
  const localizedCabins = cabins.map((cabin) => localizeCabin(cabin, locale as Locale));

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {localizedCabins.map((cabin, i) => (
          <Reveal key={cabin.slug} delay={i * 90} className="h-full">
            <CabinCard cabin={cabin} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
