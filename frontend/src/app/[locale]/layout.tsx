import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { bodyFont, headingFont } from "@/lib/fonts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "Home" });
  const path = locale === routing.defaultLocale ? "/" : `/${locale}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: t("heroTitle"),
    description: t("welcomeDescription"),
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, loc === routing.defaultLocale ? "/" : `/${loc}`]),
      ),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream-200 text-forest-950">
        <NextIntlClientProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
