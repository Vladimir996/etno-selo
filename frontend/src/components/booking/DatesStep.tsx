import { useTranslations, useLocale } from "next-intl";
import type { LocalizedCabin } from "@/data/cabins";
import { pluralGuests } from "@/lib/i18n-format";
import type { Locale } from "@/i18n/routing";
import AvailabilityCalendar, { type DateRangeValue } from "@/components/AvailabilityCalendar";

type DatesStepProps = {
  cabin: LocalizedCabin;
  unavailable: Set<string>;
  loadingAvailability: boolean;
  range: DateRangeValue;
  onRangeChange: (range: DateRangeValue) => void;
  guests: number;
  onGuestsChange: (guests: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function DatesStep({
  cabin,
  unavailable,
  loadingAvailability,
  range,
  onRangeChange,
  guests,
  onGuestsChange,
  onBack,
  onNext,
}: DatesStepProps) {
  const t = useTranslations("Booking");
  const locale = useLocale() as Locale;
  const canProceed = Boolean(range.checkIn && range.checkOut);

  return (
    <div>
      <h2 className="font-serif text-xl font-semibold text-forest-950">{t("datesStepTitle")}</h2>
      <p className="mt-1 text-sm text-forest-900/60">
        {t.rich("datesStepDescription", {
          cabin: cabin.name,
          b: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>

      <div className="mt-6 max-w-sm">
        {loadingAvailability ? (
          <p className="rounded-2xl border border-wood-700/15 bg-cream-100 px-4 py-6 text-center text-sm text-forest-900/50">
            {t("loadingAvailability")}
          </p>
        ) : (
          <AvailabilityCalendar unavailable={unavailable} value={range} onChange={onRangeChange} />
        )}
      </div>

      <div className="mt-6 max-w-xs">
        <label htmlFor="brojGostiju" className="mb-1.5 block text-sm font-medium text-forest-900/80">
          {t("guestsLabel")}
        </label>
        <input
          id="brojGostiju"
          type="number"
          min={1}
          max={cabin.capacity}
          value={guests}
          onChange={(e) => onGuestsChange(Math.min(cabin.capacity, Math.max(1, Number(e.target.value))))}
          className="form-input"
        />
        <p className="mt-1 text-xs text-forest-900/50">
          {t("guestsMax", { count: cabin.capacity, guestsWord: pluralGuests(cabin.capacity, locale) })}
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-wood-700/20 px-6 py-3.5 text-sm font-semibold text-forest-900 hover:bg-cream-300"
        >
          {t("back")}
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={onNext}
          className="flex-1 rounded-full bg-forest-800 px-6 py-3.5 text-sm font-semibold text-cream-100 transition-colors hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-10"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
