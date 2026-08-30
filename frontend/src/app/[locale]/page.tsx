import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import FeatureCard from "@/components/FeatureCard";
import CabinCard from "@/components/CabinCard";
import Reveal from "@/components/Reveal";
import { cabins, localizeCabin } from "@/data/cabins";
import { galleryImages, localizeGalleryImage } from "@/data/gallery";

const FEATURE_ICONS = {
  nature: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l6 10H6l6-10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 21l6-10 6 10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  food: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 3v8a3 3 0 006 0V3M8 3v8M19 3c-2 1-2 4-2 6a2 2 0 002 2v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  tradition: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 11l9-7 9 7M5 10v10h14V10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  peace: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12a8 8 0 1116 0 8 8 0 01-16 0z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
} as const;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("Home");

  const features = [
    { key: "nature", title: t("featureNatureTitle"), description: t("featureNatureDescription") },
    { key: "food", title: t("featureFoodTitle"), description: t("featureFoodDescription") },
    { key: "tradition", title: t("featureTraditionTitle"), description: t("featureTraditionDescription") },
    { key: "peace", title: t("featurePeaceTitle"), description: t("featurePeaceDescription") },
  ] as const;

  const localizedCabins = cabins.map((cabin) => localizeCabin(cabin, locale as Locale));
  const previewImages = galleryImages
    .slice(0, 6)
    .map((image) => localizeGalleryImage(image, locale as Locale));

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <SectionHeading
            eyebrow={t("welcomeEyebrow")}
            title={t("welcomeTitle")}
            description={t("welcomeDescription")}
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Reveal key={feature.key} delay={i * 90}>
              <FeatureCard icon={FEATURE_ICONS[feature.key]} title={feature.title} description={feature.description} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-forest-900/[0.03] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionHeading
              eyebrow={t("cabinsEyebrow")}
              title={t("cabinsTitle")}
              description={t("cabinsDescription")}
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {localizedCabins.map((cabin, i) => (
              <Reveal key={cabin.slug} delay={i * 90} className="h-full">
                <CabinCard cabin={cabin} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={t("galleryEyebrow")} title={t("galleryTitle")} />
            <Link
              href="/galerija"
              className="text-sm font-semibold text-forest-800 underline decoration-terracotta-600/40 decoration-2 underline-offset-4 hover:text-terracotta-600"
            >
              {t("galleryLink")}
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {previewImages.map((image, i) => (
            <Reveal key={image.src} delay={i * 60} className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 16vw, 33vw"
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <Image
          src="/images/cabins/winter-1.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-forest-950/75" />
        <Reveal className="relative mx-auto max-w-2xl px-5 text-center text-cream-100">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">{t("ctaTitle")}</h2>
          <p className="mt-4 text-base leading-relaxed text-cream-100/85">{t("ctaDescription")}</p>
          <Link
            href="/rezervacija"
            className="mt-8 inline-block rounded-full bg-terracotta-600 px-7 py-3 text-sm font-semibold text-cream-100 transition-colors hover:bg-terracotta-700"
          >
            {t("ctaButton")}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
