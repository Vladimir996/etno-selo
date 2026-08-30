import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { cabins, getCabinBySlug, localizeCabin } from "@/data/cabins";
import { pluralGuests } from "@/lib/i18n-format";
import type { Locale } from "@/i18n/routing";
import CabinAvailability from "@/components/CabinAvailability";
import CabinGallery from "@/components/CabinGallery";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return cabins.map((cabin) => ({ slug: cabin.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const cabin = getCabinBySlug(slug);
  if (!cabin) return {};
  const localized = localizeCabin(cabin, locale as Locale);
  return {
    title: `${localized.name} — Etno selo Raonica`,
    description: localized.shortDescription,
  };
}

export default async function CabinPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const cabin = getCabinBySlug(slug);
  if (!cabin) notFound();

  const localized = localizeCabin(cabin, locale as Locale);
  const t = await getTranslations("CabinDetail");

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Link href="/smestaj" className="text-sm font-medium text-forest-800 hover:text-terracotta-600">
        {t("back")}
      </Link>

      <div className="mt-6">
        <CabinGallery images={localized.images} cabinName={localized.name} />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <h1 className="font-serif text-3xl font-semibold text-forest-950 sm:text-4xl">
            {localized.name}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-forest-900/75">{localized.description}</p>

          <h2 className="mt-10 font-serif text-xl font-semibold text-forest-950">{t("amenitiesTitle")}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {localized.amenities.map((amenity) => (
              <li
                key={amenity}
                className="rounded-lg border border-wood-700/15 bg-cream-100 px-3 py-2 text-sm text-forest-900/80"
              >
                {amenity}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-serif text-xl font-semibold text-forest-950">
            {t("availabilityTitle")}
          </h2>
          <p className="mt-2 text-sm text-forest-900/70">{t("availabilityDescription")}</p>
          <div className="mt-4 max-w-sm">
            <CabinAvailability slug={cabin.slug} />
          </div>
        </Reveal>

        <aside className="h-fit rounded-2xl border border-wood-700/15 bg-cream-100 p-6">
          <p className="text-2xl font-semibold text-forest-950">{localized.price}</p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between border-b border-wood-700/10 pb-3">
              <dt className="text-forest-900/60">{t("capacity")}</dt>
              <dd className="font-medium text-forest-950">
                {localized.capacity} {pluralGuests(localized.capacity, locale as Locale)}
              </dd>
            </div>
            <div className="flex justify-between border-b border-wood-700/10 pb-3">
              <dt className="text-forest-900/60">{t("bedrooms")}</dt>
              <dd className="font-medium text-forest-950">{localized.bedrooms}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-forest-900/60">{t("size")}</dt>
              <dd className="font-medium text-forest-950">{localized.size}</dd>
            </div>
          </dl>

          <Link
            href={`/rezervacija?brvnara=${cabin.slug}`}
            className="mt-6 block rounded-full bg-forest-800 px-5 py-3 text-center text-sm font-semibold text-cream-100 hover:bg-forest-700"
          >
            {t("bookRequest")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
