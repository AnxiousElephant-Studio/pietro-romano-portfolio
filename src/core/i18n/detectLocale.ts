import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, Locale, LOCALE_COOKIE_NAME } from "./config";

export function detectLocale(request: NextRequest): Locale {
  const savedLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;

  if (savedLocale && isLocale(savedLocale)) {
    return savedLocale;
  }

  const countryCode = request.headers.get("x-vercel-ip-country");

  if (countryCode) {
    return countryCode.toUpperCase() === "BR" ? "pt" : "en";
  }

  const preferredLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const firstLanguage = preferredLanguage.split(",")[0]?.trim() ?? "";

  if (firstLanguage.startsWith("pt")) {
    return "pt";
  }

  return defaultLocale;
}
