import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cabins } from "@/data/cabins";
import StatusActions from "@/components/admin/StatusActions";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata: Metadata = { title: "Admin — Rezervacije", robots: { index: false } };

const API_URL = process.env.API_URL ?? "http://localhost:4000/api";

type Status = "na_cekanju" | "potvrdjena" | "odbijena" | "otkazana";

type Booking = {
  id: number;
  cabin: string;
  guest_name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  note: string | null;
  status: Status;
  created_at: string;
};

const STATUS_LABELS: Record<Status, string> = {
  na_cekanju: "Na čekanju",
  potvrdjena: "Potvrđena",
  odbijena: "Odbijena",
  otkazana: "Otkazana",
};

const STATUS_STYLES: Record<Status, string> = {
  na_cekanju: "bg-terracotta-600/15 text-terracotta-700",
  potvrdjena: "bg-forest-800/10 text-forest-800",
  odbijena: "bg-red-100 text-red-700",
  otkazana: "bg-forest-900/10 text-forest-900/50",
};

export default async function AdminPage() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) redirect("/admin/login");

  const res = await fetch(`${API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 401) redirect("/admin/login");
  if (!res.ok) {
    return <p className="mx-auto max-w-6xl px-5 py-16 text-red-700">Greška pri učitavanju rezervacija.</p>;
  }

  const bookings: Booking[] = await res.json();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta-600">Admin</p>
          <h1 className="mt-1 font-serif text-2xl font-semibold text-forest-950">Rezervacije</h1>
        </div>
        <LogoutButton />
      </div>

      {bookings.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-wood-700/15 bg-cream-100 px-5 py-8 text-center text-sm text-forest-900/60">
          Trenutno nema poslatih upita za rezervaciju.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-wood-700/15 bg-cream-100">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-wood-700/15 text-xs uppercase tracking-wide text-forest-900/50">
                <th className="px-4 py-3 font-semibold">Brvnara</th>
                <th className="px-4 py-3 font-semibold">Gost</th>
                <th className="px-4 py-3 font-semibold">Kontakt</th>
                <th className="px-4 py-3 font-semibold">Termin</th>
                <th className="px-4 py-3 font-semibold">Gostiju</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Poslato</th>
                <th className="px-4 py-3 font-semibold">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-wood-700/10 align-top last:border-0">
                  <td className="px-4 py-3 font-medium text-forest-950">
                    {cabins.find((c) => c.slug === booking.cabin)?.name.me ?? booking.cabin}
                  </td>
                  <td className="px-4 py-3">
                    {booking.guest_name}
                    {booking.note && (
                      <p className="mt-1 max-w-[220px] text-xs text-forest-900/50">{booking.note}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-forest-900/70">
                    <div>{booking.email}</div>
                    <div>{booking.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-forest-900/70">
                    {formatDate(booking.check_in)} → {formatDate(booking.check_out)}
                  </td>
                  <td className="px-4 py-3 text-forest-900/70">{booking.guests_count}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[booking.status]}`}
                    >
                      {STATUS_LABELS[booking.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-forest-900/50">
                    {formatDateTime(booking.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusActions id={booking.id} status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}.`;
}

function formatDateTime(value: string): string {
  const [datePart, timePart] = value.split(" ");
  return `${formatDate(datePart)} ${timePart?.slice(0, 5) ?? ""}`;
}
