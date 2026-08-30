import type { Locale } from "@/i18n/routing";
import type { LocalizedText } from "@/data/cabins";

export type GalleryCategory = "sve" | "eksterijer" | "enterijer" | "priroda";

export type GalleryImage = {
  src: string;
  alt: LocalizedText;
  category: Exclude<GalleryCategory, "sve">;
};

export const galleryImages: GalleryImage[] = [
  {
    src: "/images/cabins/exterior-1.jpg",
    alt: { me: 'Brvnara "Bor" u borovoj šumi', en: '"Bor" cabin in the pine forest' },
    category: "eksterijer",
  },
  {
    src: "/images/cabins/exterior-2.jpg",
    alt: { me: 'Brvnara "Javor" okružena zelenilom', en: '"Javor" cabin surrounded by greenery' },
    category: "eksterijer",
  },
  {
    src: "/images/cabins/exterior-3.jpg",
    alt: { me: 'Brvnara "Smreka", moderna A-frame kućica', en: '"Smreka", a modern A-frame cabin' },
    category: "eksterijer",
  },
  {
    src: "/images/cabins/exterior-4.jpg",
    alt: { me: 'Brvnara "Jela" u šumi', en: '"Jela" cabin in the forest' },
    category: "eksterijer",
  },
  {
    src: "/images/cabins/interior-1.jpg",
    alt: { me: "Udobna spavaća soba sa pogledom na šumu", en: "Cosy bedroom with a forest view" },
    category: "enterijer",
  },
  {
    src: "/images/cabins/interior-2.jpg",
    alt: { me: "Enterijer brvnare sa drvenim detaljima", en: "Cabin interior with wooden details" },
    category: "enterijer",
  },
  {
    src: "/images/cabins/interior-3.jpg",
    alt: { me: "Spavaća soba u brvnari", en: "Bedroom inside the cabin" },
    category: "enterijer",
  },
  {
    src: "/images/cabins/landscape-1.jpg",
    alt: { me: "Drvena kuća u planini", en: "Wooden house in the mountains" },
    category: "priroda",
  },
  {
    src: "/images/cabins/landscape-2.jpg",
    alt: { me: "Kuća okružena drvećem i planinama", en: "House surrounded by trees and mountains" },
    category: "priroda",
  },
  {
    src: "/images/cabins/winter-1.jpg",
    alt: { me: "Brvnara pod snijegom okružena borovima", en: "Snow-covered cabin surrounded by pines" },
    category: "priroda",
  },
];

export function localizeGalleryImage(image: GalleryImage, locale: Locale) {
  return { src: image.src, alt: image.alt[locale], category: image.category };
}
