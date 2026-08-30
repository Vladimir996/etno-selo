"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cabins, getCabinBySlug, localizeCabin } from "@/data/cabins";
import { buildUnavailableDateSet, fetchCabinAvailability } from "@/lib/availability";
import type { Locale } from "@/i18n/routing";
import type { DateRangeValue } from "@/components/AvailabilityCalendar";
import StepIndicator from "@/components/booking/StepIndicator";
import CabinStep from "@/components/booking/CabinStep";
import DatesStep from "@/components/booking/DatesStep";
import DetailsStep from "@/components/booking/DetailsStep";
import BookingSummary from "@/components/booking/BookingSummary";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function BookingForm() {
  const t = useTranslations("Booking");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();

  const [cabinSlug, setCabinSlug] = useState(searchParams.get("brvnara") ?? "");
  const [range, setRange] = useState<DateRangeValue>({
    checkIn: searchParams.get("dolazak"),
    checkOut: searchParams.get("odlazak"),
  });
  const [guests, setGuests] = useState(2);

  const cabin = getCabinBySlug(cabinSlug);
  const localizedCabin = cabin ? localizeCabin(cabin, locale) : undefined;
  const localizedCabins = cabins.map((c) => localizeCabin(c, locale));

  const maxUnlocked = !cabin ? 1 : !range.checkIn || !range.checkOut ? 2 : 3;
  const [step, setStep] = useState(maxUnlocked);

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const [availability, setAvailability] = useState<{ slug: string; unavailable: Set<string> } | null>(
    null,
  );
  const loadingAvailability = Boolean(cabinSlug) && availability?.slug !== cabinSlug;
  const unavailable = availability?.slug === cabinSlug ? availability.unavailable : new Set<string>();

  useEffect(() => {
    if (!cabinSlug) return;
    let cancelled = false;
    fetchCabinAvailability(cabinSlug)
      .then((ranges) => {
        if (!cancelled) setAvailability({ slug: cabinSlug, unavailable: buildUnavailableDateSet(ranges) });
      })
      .catch(() => {
        if (!cancelled) setError(t("errorAvailability"));
      });
    return () => {
      cancelled = true;
    };
  }, [cabinSlug, t]);

  function handleCabinChange(slug: string) {
    setCabinSlug(slug);
    setRange({ checkIn: null, checkOut: null });
  }

  async function handleFinalSubmit(details: {
    ime: string;
    email: string;
    telefon: string;
    napomena: string;
  }) {
    setError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/rezervacija", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...details,
          brvnara: cabinSlug,
          datumDolaska: range.checkIn,
          datumOdlaska: range.checkOut,
          brojGostiju: guests,
        }),
      });
      if (!res.ok) {
        await res.json().catch(() => ({}));
        throw new Error(t("errorGeneric"));
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setError(t("errorGeneric"));
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-forest-700/20 bg-forest-800/5 p-8 text-center">
        <h3 className="font-serif text-xl font-semibold text-forest-950">{t("successTitle")}</h3>
        <p className="mt-2 text-sm leading-relaxed text-forest-900/70">{t("successMessage")}</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setCabinSlug("");
            setRange({ checkIn: null, checkOut: null });
            setGuests(2);
            setStep(1);
          }}
          className="mt-5 text-sm font-semibold text-forest-800 underline decoration-terracotta-600/40 decoration-2 underline-offset-4 hover:text-terracotta-600"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <StepIndicator current={step} maxUnlocked={maxUnlocked} onStepClick={setStep} />

        <div className="mt-8">
          {step === 1 && (
            <CabinStep
              cabins={localizedCabins}
              value={cabinSlug}
              onChange={handleCabinChange}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && localizedCabin && (
            <DatesStep
              cabin={localizedCabin}
              unavailable={unavailable}
              loadingAvailability={loadingAvailability}
              range={range}
              onRangeChange={setRange}
              guests={guests}
              onGuestsChange={setGuests}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <DetailsStep
              submitting={status === "submitting"}
              error={error}
              onBack={() => setStep(2)}
              onSubmit={handleFinalSubmit}
            />
          )}
        </div>
      </div>

      <BookingSummary cabin={localizedCabin} range={range} guests={guests} />
    </div>
  );
}
