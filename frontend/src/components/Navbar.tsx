"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function Navbar() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("home") },
    { href: "/smestaj", label: t("accommodation") },
    { href: "/galerija", label: t("gallery") },
    { href: "/o-nama", label: t("about") },
    { href: "/kontakt", label: t("contact") },
  ] as const;

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-wood-700/15 bg-cream-100/90 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "shadow-sm shadow-wood-900/5" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" aria-hidden="true" className="h-10 w-10 shrink-0" />
          <span className="font-serif text-xl font-semibold tracking-tight text-forest-900">
            Etno selo <span className="text-terracotta-600">Raonica</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-forest-800 transition-colors hover:text-terracotta-600"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/rezervacija"
            className="rounded-full bg-forest-800 px-5 py-2.5 text-sm font-semibold text-cream-100 transition-colors hover:bg-forest-700"
          >
            {t("book")}
          </Link>
          <LocaleSwitcher locale={locale} pathname={pathname} />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LocaleSwitcher locale={locale} pathname={pathname} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t("openMenu")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-wood-700/25"
          >
            <span className="sr-only">{t("openMenu")}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-wood-700/15 bg-cream-100 px-5 py-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-forest-800 hover:bg-cream-300"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/rezervacija"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-forest-800 px-5 py-2.5 text-center text-sm font-semibold text-cream-100"
          >
            {t("book")}
          </Link>
        </nav>
      )}
    </header>
  );
}

function LocaleSwitcher({ locale, pathname }: { locale: string; pathname: string }) {
  return (
    <div className="flex items-center rounded-full border border-wood-700/20 p-0.5 text-xs font-semibold">
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            loc === locale ? "bg-forest-800 text-cream-100" : "text-forest-800 hover:bg-cream-300"
          }`}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}
