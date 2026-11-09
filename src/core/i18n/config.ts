export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

type LocaleDisplay = {
  shortLabel: string;
  fullName: string;
  flagIcon: string;
  flagZoom: string;
  flagFocus: string;
};

export const localeDisplay: Record<Locale, LocaleDisplay> = {
  pt: {
    shortLabel: "PT",
    fullName: "Português",
    flagIcon: "/icons/flags/br.svg",
    flagZoom: "160%",
    flagFocus: "50% 50%",
  },
  en: {
    shortLabel: "EN",
    fullName: "English",
    flagIcon: "/icons/flags/us.svg",
    flagZoom: "190%",
    flagFocus: "0% 0%",
  },
};

export type LocalizedText = Record<Locale, string>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localizedPath(locale: Locale, path = "/") {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
