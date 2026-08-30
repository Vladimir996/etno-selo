import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "About" });
  return { title: `${t("title")} — Etno selo Raonica`, description: t("description") };
}

export default async function ONamaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("About");

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src="/images/cabins/landscape-1.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
        <Reveal delay={150} className="space-y-4 text-base leading-relaxed text-forest-900/75">
          <p>{t("paragraph1")}</p>
          <p>{t("paragraph2")}</p>
        </Reveal>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Reveal delay={0} className="rounded-2xl border border-wood-700/15 bg-cream-100 p-6 text-center">
          <p className="font-serif text-3xl font-semibold text-forest-950">
            <CountUp end={4} />
          </p>
          <p className="mt-1 text-sm text-forest-900/70">{t("statCabins")}</p>
        </Reveal>
        <Reveal delay={100} className="rounded-2xl border border-wood-700/15 bg-cream-100 p-6 text-center">
          <p className="font-serif text-3xl font-semibold text-forest-950">
            <CountUp end={100} suffix="%" />
          </p>
          <p className="mt-1 text-sm text-forest-900/70">{t("statHandmade")}</p>
        </Reveal>
        <Reveal delay={200} className="rounded-2xl border border-wood-700/15 bg-cream-100 p-6 text-center">
          <p className="font-serif text-3xl font-semibold text-forest-950">
            <CountUp end={365} />
          </p>
          <p className="mt-1 text-sm text-forest-900/70">{t("statDays")}</p>
        </Reveal>
      </div>
    </div>
  );
}
