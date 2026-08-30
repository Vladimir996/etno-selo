import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["me", "en"],
  defaultLocale: "me",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
