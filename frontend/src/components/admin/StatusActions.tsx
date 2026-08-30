"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Status = "na_cekanju" | "potvrdjena" | "odbijena" | "otkazana";

const ACTIONS: Record<Status, { label: string; nextStatus: Status }[]> = {
  na_cekanju: [
    { label: "Potvrdi", nextStatus: "potvrdjena" },
    { label: "Odbij", nextStatus: "odbijena" },
  ],
  potvrdjena: [{ label: "Otkaži", nextStatus: "otkazana" }],
  odbijena: [{ label: "Vrati na čekanje", nextStatus: "na_cekanju" }],
  otkazana: [{ label: "Vrati na čekanje", nextStatus: "na_cekanju" }],
};

export default function StatusActions({ id, status }: { id: number; status: Status }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function updateStatus(nextStatus: Status) {
    setPending(true);
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ACTIONS[status].map((action) => (
        <button
          key={action.nextStatus}
          type="button"
          disabled={pending}
          onClick={() => updateStatus(action.nextStatus)}
          className="rounded-full border border-wood-700/20 bg-cream-100 px-3 py-1.5 text-xs font-semibold text-forest-900 hover:bg-cream-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
