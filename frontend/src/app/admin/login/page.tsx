"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

// Napomena: metadata (robots: noindex) ne može iz client komponente — vidi layout.tsx.

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const data = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.get("username"),
          password: data.get("password"),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Prijava neuspešna.");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prijava neuspešna.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-terracotta-600">Admin</p>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-forest-950">Prijava</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-forest-900/80">
            Korisničko ime
          </label>
          <input id="username" name="username" type="text" required className="form-input" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-forest-900/80">
            Lozinka
          </label>
          <input id="password" name="password" type="password" required className="form-input" />
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-forest-800 px-6 py-3 text-sm font-semibold text-cream-100 transition-colors hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Prijavljivanje..." : "Prijavi se"}
        </button>
      </form>
    </div>
  );
}
