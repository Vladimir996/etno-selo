import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import HeroSlideshow from "@/components/HeroSlideshow";

export default function Hero() {
  const t = useTranslations("Home");

  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden">
      <HeroSlideshow />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/40 to-forest-950/10" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-32 text-cream-100">
        <p className="animate-hero-in text-sm font-semibold uppercase tracking-[0.2em] text-terracotta-600 [animation-delay:0ms]">
          {t("heroWelcome")}
        </p>
        <h1 className="animate-hero-in mt-3 max-w-2xl font-serif text-4xl font-semibold leading-tight sm:text-6xl [animation-delay:120ms]">
          {t("heroTitle")}
        </h1>
        <p className="animate-hero-in mt-5 max-w-xl text-base leading-relaxed text-cream-100/85 sm:text-lg [animation-delay:240ms]">
          {t("heroDescription")}
        </p>

        <div className="animate-hero-in mt-8 flex flex-wrap gap-4 [animation-delay:360ms]">
          <Link
            href="/smestaj"
            className="rounded-full bg-terracotta-600 px-6 py-3 text-sm font-semibold text-cream-100 transition-colors hover:bg-terracotta-700"
          >
            {t("heroCtaAccommodation")}
          </Link>
          <Link
            href="/rezervacija"
            className="rounded-full border border-cream-100/40 bg-cream-100/10 px-6 py-3 text-sm font-semibold text-cream-100 backdrop-blur transition-colors hover:bg-cream-100/20"
          >
            {t("heroCtaBooking")}
          </Link>
        </div>
      </div>
    </section>
  );
}
