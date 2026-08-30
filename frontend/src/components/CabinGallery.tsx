"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Lightbox, { type LightboxImage } from "@/components/Lightbox";

export default function CabinGallery({ images, cabinName }: { images: string[]; cabinName: string }) {
  const t = useTranslations("CabinDetail");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxImages: LightboxImage[] = images.map((src, i) => ({
    src,
    alt: `${cabinName} — ${t("photo")} ${i + 1}`,
  }));

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className={`group relative overflow-hidden rounded-2xl ${
              i === 0 ? "aspect-[4/3] sm:col-span-2 sm:row-span-2" : "aspect-[4/3] sm:aspect-auto"
            }`}
          >
            <Image
              src={src}
              alt={`${cabinName} — ${t("photo")} ${i + 1}`}
              fill
              sizes="(min-width: 640px) 60vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={i === 0}
            />
            <span className="absolute inset-0 flex items-center justify-center bg-forest-950/0 opacity-0 transition-all duration-300 group-hover:bg-forest-950/20 group-hover:opacity-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-100/90 text-forest-900">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M8 3H4a1 1 0 00-1 1v4M17 8V4a1 1 0 00-1-1h-4M12 17h4a1 1 0 001-1v-4M3 12v4a1 1 0 001 1h4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  );
}
