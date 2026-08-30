import type { Locale } from "@/i18n/routing";

export function pluralNights(n: number, locale: Locale): string {
  if (locale === "en") return n === 1 ? "night" : "nights";
  return n === 1 ? "noćenje" : "noćenja";
}

export function pluralBedrooms(n: number, locale: Locale): string {
  if (locale === "en") return n === 1 ? "bedroom" : "bedrooms";
  return n === 1 ? "spavaća soba" : "spavaće sobe";
}

export function pluralGuests(n: number, locale: Locale): string {
  if (locale === "en") return n === 1 ? "guest" : "guests";
  if (n === 1) return "gost";
  if (n >= 2 && n <= 4) return "gosta";
  return "gostiju";
}
