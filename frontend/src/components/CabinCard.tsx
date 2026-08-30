import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { LocalizedCabin } from "@/data/cabins";
import { pluralBedrooms, pluralGuests } from "@/lib/i18n-format";
import type { Locale } from "@/i18n/routing";

export default function CabinCard({ cabin }: { cabin: LocalizedCabin }) {
  const t = useTranslations("Cabin");
  const locale = useLocale() as Locale;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-wood-700/15 bg-cream-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={cabin.images[0]}
          alt={cabin.name}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-cream-100/95 px-3 py-1 text-xs font-semibold text-forest-900">
          {cabin.price}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-1 font-serif text-xl font-semibold text-forest-950">{cabin.name}</h3>
        <p className="mt-2 line-clamp-3 min-h-[4.3rem] text-sm leading-relaxed text-forest-900/70">
          {cabin.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-forest-900/60">
          <span>
            {cabin.capacity} {pluralGuests(cabin.capacity, locale)}
          </span>
          <span>
            {cabin.bedrooms} {pluralBedrooms(cabin.bedrooms, locale)}
          </span>
          <span>{cabin.size}</span>
        </div>

        <div className="mt-5 flex items-center gap-3 pt-1">
          <Link
            href={`/smestaj/${cabin.slug}`}
            className="text-sm font-semibold text-forest-800 underline decoration-terracotta-600/40 decoration-2 underline-offset-4 hover:text-terracotta-600"
          >
            {t("detail")}
          </Link>
          <Link
            href={`/rezervacija?brvnara=${cabin.slug}`}
            className="ml-auto rounded-full bg-forest-800 px-4 py-2 text-xs font-semibold text-cream-100 hover:bg-forest-700"
          >
            {t("book")}
          </Link>
        </div>
      </div>
    </div>
  );
}
