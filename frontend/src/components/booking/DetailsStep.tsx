import type { FormEvent } from "react";
import { useTranslations } from "next-intl";

type DetailsStepProps = {
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: (details: { ime: string; email: string; telefon: string; napomena: string }) => void;
};

export default function DetailsStep({ submitting, error, onBack, onSubmit }: DetailsStepProps) {
  const t = useTranslations("Booking");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSubmit({
      ime: String(data.get("ime") ?? ""),
      email: String(data.get("email") ?? ""),
      telefon: String(data.get("telefon") ?? ""),
      napomena: String(data.get("napomena") ?? ""),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="font-serif text-xl font-semibold text-forest-950">{t("detailsStepTitle")}</h2>
      <p className="mt-1 text-sm text-forest-900/60">{t("detailsStepDescription")}</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label={t("fullName")} htmlFor="ime">
          <input id="ime" name="ime" type="text" required className="form-input" placeholder={t("fullNamePlaceholder")} />
        </Field>
        <Field label={t("email")} htmlFor="email">
          <input id="email" name="email" type="email" required className="form-input" placeholder="vas@email.com" />
        </Field>
        <Field label={t("phone")} htmlFor="telefon">
          <input id="telefon" name="telefon" type="tel" required className="form-input" placeholder="+382 6X XXX XXX" />
        </Field>
      </div>

      <div className="mt-5">
        <Field label={t("note")} htmlFor="napomena">
          <textarea
            id="napomena"
            name="napomena"
            rows={4}
            className="form-input resize-none"
            placeholder={t("notePlaceholder")}
          />
        </Field>
      </div>

      {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-wood-700/20 px-6 py-3.5 text-sm font-semibold text-forest-900 hover:bg-cream-300"
        >
          {t("back")}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-full bg-forest-800 px-6 py-3.5 text-sm font-semibold text-cream-100 transition-colors hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-10"
        >
          {submitting ? t("submitting") : t("submit")}
        </button>
      </div>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-forest-900/80">
        {label}
      </label>
      {children}
    </div>
  );
}
