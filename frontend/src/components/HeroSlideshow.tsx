"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { galleryImages, localizeGalleryImage } from "@/data/gallery";
import type { Locale } from "@/i18n/routing";

const SLIDE_SRCS = [
  "/images/cabins/exterior-1.jpg",
  "/images/cabins/exterior-3.jpg",
  "/images/cabins/landscape-1.jpg",
  "/images/cabins/winter-1.jpg",
];

export default function HeroSlideshow() {
  const locale = useLocale() as Locale;
  const t = useTranslations("Home");
  const SLIDES = SLIDE_SRCS.map((src) => {
    const image = galleryImages.find((img) => img.src === src)!;
    return localizeGalleryImage(image, locale);
  });
  const [index, setIndex] = useState(0);
  const [readyCount, setReadyCount] = useState(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDE_SRCS.length), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (readyCount >= SLIDE_SRCS.length) return;
    // Stagger loading the remaining slides so they don't compete with the
    // first (LCP) image for bandwidth on initial page load.
    const id = setTimeout(() => setReadyCount((c) => c + 1), 2000);
    return () => clearTimeout(id);
  }, [readyCount]);

  return (
    <div className="absolute inset-0">
      {SLIDES.map((slide, i) =>
        i < readyCount ? (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              preload={i === 0}
              sizes="100vw"
              className={`object-cover ${i === index ? "animate-kenburns" : ""}`}
            />
          </div>
        ) : null,
      )}

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={t("heroSlide", { n: i + 1 })}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-cream-100" : "w-1.5 bg-cream-100/40 hover:bg-cream-100/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
