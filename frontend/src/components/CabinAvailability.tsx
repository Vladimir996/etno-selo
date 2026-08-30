"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buildUnavailableDateSet, fetchCabinAvailability } from "@/lib/availability";
import AvailabilityCalendar, { type DateRangeValue } from "@/components/AvailabilityCalendar";

export default function CabinAvailability({ slug }: { slug: string }) {
  const t = useTranslations("Booking");
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [range, setRange] = useState<DateRangeValue>({ checkIn: null, checkOut: null });

  useEffect(() => {
    let cancelled = false;
    fetchCabinAvailability(slug)
      .then((ranges) => {
        if (!cancelled) setUnavailable(buildUnavailableDateSet(ranges));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const bookingHref =
    range.checkIn && range.checkOut
      ? `/rezervacija?brvnara=${slug}&dolazak=${range.checkIn}&odlazak=${range.checkOut}`
      : `/rezervacija?brvnara=${slug}`;

  if (loading) {
    return (
      <p className="rounded-2xl border border-wood-700/15 bg-cream-100 px-4 py-6 text-center text-sm text-forest-900/50">
        {t("loadingAvailability")}
      </p>
    );
  }

  if (error) {
    return (
      <p className="rounded-2xl border border-wood-700/15 bg-cream-100 px-4 py-6 text-center text-sm text-forest-900/50">
        {t("errorAvailability")}
      </p>
    );
  }

  return (
    <div>
      <AvailabilityCalendar unavailable={unavailable} value={range} onChange={setRange} />

      <Link
        href={bookingHref}
        className="mt-4 block rounded-full bg-forest-800 px-5 py-3 text-center text-sm font-semibold text-cream-100 hover:bg-forest-700"
      >
        {range.checkIn && range.checkOut ? t("sendForDates") : t("sendRequest")}
      </Link>
    </div>
  );
}
