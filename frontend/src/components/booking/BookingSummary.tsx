import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import type { LocalizedCabin } from "@/data/cabins";
import { nightsBetween, parseDateKey } from "@/lib/availability";
import { pluralNights } from "@/lib/i18n-format";
import type { Locale } from "@/i18n/routing";
import type { DateRangeValue } from "@/components/AvailabilityCalendar";

type BookingSummaryProps = {
  cabin: LocalizedCabin | undefined;
  range: DateRangeValue;
  guests: number;
};

export default function BookingSummary({ cabin, range, guests }: BookingSummaryProps) {
  const t = useTranslations("Booking");
  const locale = useLocale() as Locale;
  const nights = range.checkIn && range.checkOut ? nightsBetween(range.checkIn, range.checkOut) : 0;
  const estimatedTotal = cabin && nights > 0 ? cabin.priceFromEur * nights : null;

  function formatDisplay(key: string): string {
    const date = parseDateKey(key);
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}.`;
  }

  return (
    <aside className="h-fit rounded-2xl border border-wood-700/15 bg-cream-100 p-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-forest-900/50">
        {t("summaryTitle")}
      </p>

      {cabin ? (
        <div className="mt-4 flex gap-3">
          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl">
            <Image src={cabin.images[0]} alt={cabin.name} fill className="object-cover" />
          </div>
          <div>
            <p className="font-serif text-base font-semibold text-forest-950">{cabin.name}</p>
            <p className="text-xs text-forest-900/60">{cabin.price}</p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-forest-900/50">{t("summaryNoCabin")}</p>
      )}

      <dl className="mt-5 space-y-3 border-t border-wood-700/10 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-forest-900/60">{t("summaryCheckIn")}</dt>
          <dd className="font-medium text-forest-950">
            {range.checkIn ? formatDisplay(range.checkIn) : "—"}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-forest-900/60">{t("summaryCheckOut")}</dt>
          <dd className="font-medium text-forest-950">
            {range.checkOut ? formatDisplay(range.checkOut) : "—"}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-forest-900/60">{t("summaryNights")}</dt>
          <dd className="font-medium text-forest-950">
            {nights > 0 ? `${nights} ${pluralNights(nights, locale)}` : "—"}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-forest-900/60">{t("summaryGuests")}</dt>
          <dd className="font-medium text-forest-950">{guests}</dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-wood-700/10 pt-4">
        <div className="flex justify-between">
          <span className="text-sm font-semibold text-forest-950">{t("summaryEstimatedPrice")}</span>
          <span className="text-lg font-semibold text-forest-950">
            {estimatedTotal !== null ? `${estimatedTotal} €` : "—"}
          </span>
        </div>
        <p className="mt-1 text-xs text-forest-900/50">{t("summaryPriceNote")}</p>
      </div>
    </aside>
  );
}
