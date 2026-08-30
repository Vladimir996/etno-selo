"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export type LightboxImage = { src: string; alt: string };

type LightboxProps = {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export default function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const t = useTranslations("Lightbox");
  const image = images[index];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, images.length, onClose, onIndexChange]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/90 p-5"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-cream-100/10 text-cream-100 hover:bg-cream-100/20"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label={t("previous")}
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index - 1 + images.length) % images.length);
            }}
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream-100/10 text-cream-100 hover:bg-cream-100/20 sm:left-6"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={t("next")}
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index + 1) % images.length);
            }}
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream-100/10 text-cream-100 hover:bg-cream-100/20 sm:right-6"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      <div className="relative max-h-[85vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          width={1600}
          height={1200}
          className="h-auto max-h-[85vh] w-full animate-fade-in rounded-xl object-contain"
        />
        <p className="mt-3 text-center text-sm text-cream-100/80">{image.alt}</p>
        {hasMultiple && (
          <p className="mt-1 text-center text-xs text-cream-100/50">
            {index + 1} / {images.length}
          </p>
        )}
      </div>
    </div>
  );
}
