"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { GalleryCategory } from "@/data/gallery";
import Lightbox from "@/components/Lightbox";
import Reveal from "@/components/Reveal";

export default function GalleryGrid({ images }: { images: { src: string; alt: string; category: string }[] }) {
  const t = useTranslations("Gallery");
  const [active, setActive] = useState<GalleryCategory>("sve");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const tabs: { value: GalleryCategory; label: string }[] = [
    { value: "sve", label: t("tabAll") },
    { value: "eksterijer", label: t("tabExterior") },
    { value: "enterijer", label: t("tabInterior") },
    { value: "priroda", label: t("tabNature") },
  ];

  const filtered = active === "sve" ? images : images.filter((img) => img.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              setActive(tab.value);
              setLightboxIndex(null);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === tab.value
                ? "bg-forest-800 text-cream-100"
                : "bg-cream-100 text-forest-900/70 hover:bg-cream-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((image, i) => (
          <Reveal key={image.src} delay={(i % 6) * 60} className="mb-4 block">
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="block w-full overflow-hidden rounded-2xl"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={600}
                className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </button>
          </Reveal>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
