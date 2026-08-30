"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  formatDateKey,
  isDateUnavailable,
  nightsBetween,
  parseDateKey,
  rangeHasUnavailableDate,
  startOfToday,
} from "@/lib/availability";
import { pluralNights } from "@/lib/i18n-format";
import type { Locale } from "@/i18n/routing";

export type DateRangeValue = {
  checkIn: string | null;
  checkOut: string | null;
};

type AvailabilityCalendarProps = {
  unavailable: Set<string>;
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
};

export default function AvailabilityCalendar({
  unavailable,
  value,
  onChange,
}: AvailabilityCalendarProps) {
  const t = useTranslations("Calendar");
  const locale = useLocale() as Locale;
  const weekdays = t.raw("weekdays") as string[];
  const months = t.raw("months") as string[];

  const today = useMemo(() => startOfToday(), []);
  const [monthCursor, setMonthCursor] = useState(() => {
    const base = value.checkIn ? parseDateKey(value.checkIn) : today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const isSameMonthAsToday =
    monthCursor.getFullYear() === today.getFullYear() && monthCursor.getMonth() === today.getMonth();

  const days = useMemo(() => {
    const firstOfMonth = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
    const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < leadingBlanks; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(monthCursor.getFullYear(), monthCursor.getMonth(), d));
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [monthCursor]);

  function handleDayClick(date: Date) {
    const key = formatDateKey(date);
    const { checkIn, checkOut } = value;

    if (!checkIn || checkOut) {
      onChange({ checkIn: key, checkOut: null });
      return;
    }

    const checkInDate = parseDateKey(checkIn);
    if (date <= checkInDate) {
      onChange({ checkIn: key, checkOut: null });
      return;
    }

    if (rangeHasUnavailableDate(unavailable, checkInDate, date)) {
      onChange({ checkIn: key, checkOut: null });
      return;
    }

    onChange({ checkIn, checkOut: key });
  }

  const checkInDate = value.checkIn ? parseDateKey(value.checkIn) : null;
  const checkOutDate = value.checkOut ? parseDateKey(value.checkOut) : null;

  function formatDisplay(key: string): string {
    const date = parseDateKey(key);
    if (locale === "en") {
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}.`;
  }

  return (
    <div className="rounded-2xl border border-wood-700/15 bg-cream-100 p-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label={t("prevMonth")}
          disabled={isSameMonthAsToday}
          onClick={() => setMonthCursor((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full text-forest-800 hover:bg-cream-300 disabled:opacity-30"
        >
          ‹
        </button>
        <p className="text-sm font-semibold text-forest-950">
          {months[monthCursor.getMonth()]} {monthCursor.getFullYear()}
        </p>
        <button
          type="button"
          aria-label={t("nextMonth")}
          onClick={() => setMonthCursor((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full text-forest-800 hover:bg-cream-300"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-forest-900/50">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          if (!date) return <div key={`blank-${i}`} />;

          const key = formatDateKey(date);
          const isPast = date < today;
          const isUnavailable = isDateUnavailable(unavailable, date);
          const isCheckIn = value.checkIn === key;
          const isCheckOut = value.checkOut === key;
          const isInRange =
            checkInDate && checkOutDate && date > checkInDate && date < checkOutDate;
          const disabled = isPast || (isUnavailable && !isCheckIn);

          return (
            <button
              key={key}
              type="button"
              data-calendar-day={key}
              disabled={disabled}
              onClick={() => handleDayClick(date)}
              className={[
                "aspect-square rounded-full text-sm transition-colors",
                disabled && !isCheckIn ? "cursor-not-allowed text-forest-900/25" : "",
                isUnavailable && !isPast && !isCheckIn ? "line-through" : "",
                isInRange ? "bg-terracotta-600/15 text-forest-950" : "",
                isCheckIn || isCheckOut ? "bg-forest-800 text-cream-100 font-semibold" : "",
                !disabled && !isCheckIn && !isCheckOut && !isInRange
                  ? "text-forest-900 hover:bg-cream-300"
                  : "",
              ].join(" ")}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-wood-700/10 pt-4 text-xs text-forest-900/60">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-cream-300 ring-1 ring-wood-700/30" /> {t("available")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-forest-900/15" /> {t("unavailable")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-forest-800" /> {t("selected")}
        </span>
      </div>

      {value.checkIn && (
        <p className="mt-4 text-sm text-forest-900/80">
          {value.checkOut ? (
            <>
              <strong className="font-semibold text-forest-950">{formatDisplay(value.checkIn)}</strong>
              {" → "}
              <strong className="font-semibold text-forest-950">{formatDisplay(value.checkOut)}</strong>
              {" "}
              ({nightsBetween(value.checkIn, value.checkOut)} {pluralNights(nightsBetween(value.checkIn, value.checkOut), locale)})
            </>
          ) : (
            t("checkInPrompt", { date: formatDisplay(value.checkIn) })
          )}
        </p>
      )}
    </div>
  );
}
