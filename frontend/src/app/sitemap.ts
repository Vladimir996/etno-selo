import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { cabins } from "@/data/cabins";
import { SITE_URL } from "@/lib/site";

function urlFor(path: string, locale: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

function languageAlternates(path: string) {
  return Object.fromEntries(routing.locales.map((locale) => [locale, urlFor(path, locale)]));
}

type StaticEntry = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

const staticEntries: StaticEntry[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/smestaj", changeFrequency: "weekly", priority: 0.8 },
  { path: "/galerija", changeFrequency: "monthly", priority: 0.5 },
  { path: "/o-nama", changeFrequency: "monthly", priority: 0.4 },
  { path: "/kontakt", changeFrequency: "monthly", priority: 0.4 },
  { path: "/rezervacija", changeFrequency: "weekly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticUrls = staticEntries.flatMap((entry) =>
    routing.locales.map((locale) => ({
      url: urlFor(entry.path, locale),
      lastModified: now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: { languages: languageAlternates(entry.path) },
    })),
  );

  const cabinUrls = cabins.flatMap((cabin) =>
    routing.locales.map((locale) => ({
      url: urlFor(`/smestaj/${cabin.slug}`, locale),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: { languages: languageAlternates(`/smestaj/${cabin.slug}`) },
    })),
  );

  return [...staticUrls, ...cabinUrls];
}
