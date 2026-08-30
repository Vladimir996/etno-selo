import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import type { LocalizedCabin } from "@/data/cabins";
import { pluralGuests } from "@/lib/i18n-format";
import type { Locale } from "@/i18n/routing";

type CabinStepProps = {
  cabins: LocalizedCabin[];
  value: string;
  onChange: (slug: string) => void;
  onNext: () => void;
};

export default function CabinStep({ cabins, value, onChange, onNext }: CabinStepProps) {
  const t = useTranslations("Booking");
  const locale = useLocale() as Locale;

  return (
    <div>
      <h2 className="font-serif text-xl font-semibold text-forest-950">{t("cabinStepTitle")}</h2>
      <p className="mt-1 text-sm text-forest-900/60">{t("cabinStepDescription")}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cabins.map((cabin) => {
          const selected = cabin.slug === value;
          return (
            <button
              key={cabin.slug}
              type="button"
              onClick={() => onChange(cabin.slug)}
              className={[
                "flex gap-4 rounded-2xl border p-3 text-left transition-colors",
                selected
                  ? "border-forest-800 bg-forest-800/5 ring-1 ring-forest-800"
                  : "border-wood-700/15 bg-cream-100 hover:border-wood-700/30",
              ].join(" ")}
            >
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                <Image src={cabin.images[0]} alt={cabin.name} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-serif text-base font-semibold text-forest-950">{cabin.name}</p>
                <p className="mt-0.5 text-xs text-forest-900/60">
                  {cabin.capacity} {pluralGuests(cabin.capacity, locale)} · {cabin.size}
                </p>
                <p className="mt-1 text-sm font-medium text-terracotta-700">{cabin.price}</p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!value}
        onClick={onNext}
        className="mt-6 w-full rounded-full bg-forest-800 px-6 py-3.5 text-sm font-semibold text-cream-100 transition-colors hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10"
      >
        {t("next")}
      </button>
    </div>
  );
}
