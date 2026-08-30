"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");

  return (
    <footer className="border-t border-wood-700/15 bg-forest-950 text-cream-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" aria-hidden="true" className="h-10 w-10 shrink-0" />
            <p className="font-serif text-lg font-semibold text-cream-100">
              Etno selo <span className="text-terracotta-600">Raonica</span>
            </p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-cream-200/70">{t("tagline")}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-cream-100">{t("navigation")}</p>
          <ul className="mt-3 space-y-2 text-sm text-cream-200/70">
            <li><Link className="hover:text-cream-100" href="/smestaj">{tNav("accommodation")}</Link></li>
            <li><Link className="hover:text-cream-100" href="/galerija">{tNav("gallery")}</Link></li>
            <li><Link className="hover:text-cream-100" href="/o-nama">{tNav("about")}</Link></li>
            <li><Link className="hover:text-cream-100" href="/rezervacija">{tNav("book")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-cream-100">{t("contact")}</p>
          <ul className="mt-3 space-y-2 text-sm text-cream-200/70">
            <li>{t("address")}</li>
            <li>+382 60 000 000</li>
            <li>info@etnoseloraonica.me</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-cream-100">{t("checkinHours")}</p>
          <ul className="mt-3 space-y-2 text-sm text-cream-200/70">
            <li>{t("checkin")}</li>
            <li>{t("checkout")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-100/10 px-5 py-5 text-center text-xs text-cream-200/50">
        © {new Date().getFullYear()} Etno selo Raonica. {t("rights")}
      </div>
    </footer>
  );
}
