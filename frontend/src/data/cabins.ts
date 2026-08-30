import type { Locale } from "@/i18n/routing";

export type LocalizedText = { me: string; en: string };

export type AmenityId =
  | "kamin"
  | "pec"
  | "terasa"
  | "terasa-lezaljke"
  | "kupatilo"
  | "kuhinja"
  | "mini-kuhinja"
  | "panoramski-krov"
  | "wifi"
  | "parking";

export const amenityLabels: Record<AmenityId, LocalizedText> = {
  kamin: { me: "Kamin na drva", en: "Wood-burning fireplace" },
  pec: { me: "Peć na drva", en: "Wood stove" },
  terasa: { me: "Terasa", en: "Terrace" },
  "terasa-lezaljke": { me: "Terasa sa ležaljkama", en: "Terrace with sun loungers" },
  kupatilo: { me: "Kupatilo sa tuš kabinom", en: "Bathroom with shower" },
  kuhinja: { me: "Kuhinja", en: "Kitchen" },
  "mini-kuhinja": { me: "Mini kuhinja", en: "Mini kitchen" },
  "panoramski-krov": { me: "Panoramski krov", en: "Panoramic roof window" },
  wifi: { me: "Besplatan Wi-Fi", en: "Free Wi-Fi" },
  parking: { me: "Parking", en: "Parking" },
};

export type Cabin = {
  slug: string;
  name: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  capacity: number;
  bedrooms: number;
  sizeM2: number;
  priceFromEur: number;
  amenities: AmenityId[];
  images: string[];
};

export const cabins: Cabin[] = [
  {
    slug: "brvnara-bor",
    name: { me: 'Brvnara "Bor"', en: '"Bor" Cabin' },
    shortDescription: {
      me: "Prostrana brvnara sa pogledom na borovu šumu, idealna za porodice.",
      en: "A spacious cabin overlooking the pine forest, ideal for families.",
    },
    description: {
      me: 'Brvnara "Bor" je naša najprostranija A-frame kućica, smještena na ivici borove šume. Enterijer kombinuje grubo obrađeno drvo sa mekim tekstilom u toplim tonovima, a velika staklena fasada uvodi prirodnu svjetlost i pogled na okolne krošnje u svaki kutak dnevnog boravka.',
      en: '"Bor" is our most spacious A-frame cabin, set at the edge of a pine forest. The interior pairs rough-hewn wood with soft textiles in warm tones, while a large glass facade brings natural light and forest views into every corner of the living room.',
    },
    capacity: 4,
    bedrooms: 2,
    sizeM2: 42,
    priceFromEur: 65,
    amenities: ["kamin", "terasa-lezaljke", "kupatilo", "kuhinja", "wifi", "parking"],
    images: [
      "/images/cabins/exterior-1.jpg",
      "/images/cabins/interior-1.jpg",
      "/images/cabins/interior-3.jpg",
    ],
  },
  {
    slug: "brvnara-javor",
    name: { me: 'Brvnara "Javor"', en: '"Javor" Cabin' },
    shortDescription: {
      me: "Romantična brvnara za dvoje, okružena zelenilom i tišinom.",
      en: "A romantic cabin for two, surrounded by greenery and quiet.",
    },
    description: {
      me: 'Brvnara "Javor" je zamišljena za parove koji traže mir – manja, intimna A-frame kućica sa udobnim ležajem na sprat, malom trpezarijom i pogledom koji se pruža pravo na livadu. Jutra ovdje počinju mirisom kafe i cvrkutom ptica.',
      en: '"Javor" was designed for couples seeking peace and quiet — a smaller, intimate A-frame cabin with a cosy loft bed, a small dining nook and a view straight onto the meadow. Mornings here begin with the smell of coffee and birdsong.',
    },
    capacity: 2,
    bedrooms: 1,
    sizeM2: 28,
    priceFromEur: 50,
    amenities: ["kamin", "terasa", "kupatilo", "mini-kuhinja", "wifi", "parking"],
    images: [
      "/images/cabins/exterior-2.jpg",
      "/images/cabins/interior-2.jpg",
      "/images/cabins/landscape-1.jpg",
    ],
  },
  {
    slug: "brvnara-smreka",
    name: { me: 'Brvnara "Smreka"', en: '"Smreka" Cabin' },
    shortDescription: {
      me: "Moderna A-frame kućica sa panoramskim staklenim krovom.",
      en: "A modern A-frame cabin with a panoramic glass roof.",
    },
    description: {
      me: 'Brvnara "Smreka" spaja tradicionalni oblik brvnare sa savremenim detaljima – panoramski stakleni zabat pruža pogled na zvjezdano nebo direktno iz kreveta. Zimi, okružena snijegom, postaje omiljeno mjesto naših gostiju za bjekstvo od gradske vreve.',
      en: '"Smreka" pairs the traditional cabin shape with modern touches — a panoramic glass gable lets you watch the stars right from bed. In winter, surrounded by snow, it becomes our guests\' favourite escape from city life.',
    },
    capacity: 3,
    bedrooms: 1,
    sizeM2: 32,
    priceFromEur: 55,
    amenities: ["kamin", "panoramski-krov", "terasa", "kupatilo", "wifi", "parking"],
    images: [
      "/images/cabins/exterior-3.jpg",
      "/images/cabins/interior-1.jpg",
      "/images/cabins/winter-1.jpg",
    ],
  },
  {
    slug: "brvnara-jela",
    name: { me: 'Brvnara "Jela"', en: '"Jela" Cabin' },
    shortDescription: {
      me: "Kompaktna i udobna brvnara, savršena za kratak odmor.",
      en: "A compact, comfortable cabin, perfect for a short getaway.",
    },
    description: {
      me: 'Brvnara "Jela" je naša najkompaktnija A-frame kućica, ali ne i najskromnija po udobnosti. Sa pažljivo biranim detaljima od domaćeg drveta i tekstila, ova brvnara je idealan izbor za goste koji dolaze na kraći odmor i žele jednostavnost bez kompromisa.',
      en: '"Jela" is our most compact A-frame cabin, though by no means the plainest in comfort. With carefully chosen local wood and textile details, it\'s the ideal choice for guests on a shorter stay who want simplicity without compromise.',
    },
    capacity: 2,
    bedrooms: 1,
    sizeM2: 24,
    priceFromEur: 45,
    amenities: ["pec", "terasa", "kupatilo", "wifi", "parking"],
    images: [
      "/images/cabins/exterior-4.jpg",
      "/images/cabins/interior-3.jpg",
      "/images/cabins/landscape-2.jpg",
    ],
  },
];

export function getCabinBySlug(slug: string): Cabin | undefined {
  return cabins.find((cabin) => cabin.slug === slug);
}

export function formatPrice(priceFromEur: number, locale: Locale): string {
  return locale === "en" ? `from €${priceFromEur} / night` : `od ${priceFromEur} € / noć`;
}

export function localizeCabin(cabin: Cabin, locale: Locale) {
  return {
    slug: cabin.slug,
    name: cabin.name[locale],
    shortDescription: cabin.shortDescription[locale],
    description: cabin.description[locale],
    capacity: cabin.capacity,
    bedrooms: cabin.bedrooms,
    size: `${cabin.sizeM2} m²`,
    price: formatPrice(cabin.priceFromEur, locale),
    priceFromEur: cabin.priceFromEur,
    amenities: cabin.amenities.map((id) => amenityLabels[id][locale]),
    images: cabin.images,
  };
}

export type LocalizedCabin = ReturnType<typeof localizeCabin>;
