import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "Contact" });
  return { title: `${t("title")} — Etno selo Raonica`, description: t("description") };
}

export default async function KontaktPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("Contact");
  const tFooter = await getTranslations("Footer");

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <Reveal delay={0} className="rounded-2xl border border-wood-700/15 bg-cream-100 p-6">
            <p className="text-sm font-semibold text-forest-900/60">{t("address")}</p>
            <p className="mt-1 text-lg text-forest-950">{tFooter("address")}</p>
          </Reveal>
          <Reveal delay={80} className="rounded-2xl border border-wood-700/15 bg-cream-100 p-6">
            <p className="text-sm font-semibold text-forest-900/60">{t("phone")}</p>
            <p className="mt-1 text-lg text-forest-950">+382 60 000 000</p>
          </Reveal>
          <Reveal delay={160} className="rounded-2xl border border-wood-700/15 bg-cream-100 p-6">
            <p className="text-sm font-semibold text-forest-900/60">{t("email")}</p>
            <p className="mt-1 text-lg text-forest-950">info@etnoseloraonica.me</p>
          </Reveal>
        </div>

        <Reveal delay={120} className="overflow-hidden rounded-2xl border border-wood-700/15">
          <iframe
            title={t("mapTitle")}
            src="https://www.google.com/maps?q=Raonica%2C%20Crna%20Gora&output=embed"
            className="h-full min-h-[340px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </div>
  );
}
