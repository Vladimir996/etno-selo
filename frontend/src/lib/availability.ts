// Sav pristup dostupnosti termina ide kroz ove funkcije. `fetchCabinAvailability`
// zove Next.js API rutu (src/app/api/cabins/[slug]/availability/route.ts), koja
// dalje prosleđuje zahtev ka Node.js/MySQL backend-u (backend/).

export type DateRange = {
  start: string;
  end: string;
};

export async function fetchCabinAvailability(slug: string): Promise<DateRange[]> {
  const res = await fetch(`/api/cabins/${slug}/availability`);
  if (!res.ok) throw new Error("Neuspešno učitavanje dostupnosti termina.");
  return res.json();
}

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function buildUnavailableDateSet(ranges: DateRange[]): Set<string> {
  const set = new Set<string>();
  for (const range of ranges) {
    let cursor = parseDateKey(range.start);
    const end = parseDateKey(range.end);
    while (cursor < end) {
      set.add(formatDateKey(cursor));
      cursor = addDays(cursor, 1);
    }
  }
  return set;
}

export function isDateUnavailable(unavailable: Set<string>, date: Date): boolean {
  return unavailable.has(formatDateKey(date));
}

export function rangeHasUnavailableDate(
  unavailable: Set<string>,
  checkIn: Date,
  checkOut: Date,
): boolean {
  let cursor = checkIn;
  while (cursor < checkOut) {
    if (unavailable.has(formatDateKey(cursor))) return true;
    cursor = addDays(cursor, 1);
  }
  return false;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const diff = parseDateKey(checkOut).getTime() - parseDateKey(checkIn).getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}
