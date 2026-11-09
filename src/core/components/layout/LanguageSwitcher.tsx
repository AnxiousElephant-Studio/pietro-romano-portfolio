"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale, localeDisplay, locales, LOCALE_COOKIE_NAME } from "@/core/i18n/config";

type LanguageSwitcherProps = { currentLocale: Locale; groupLabel: string };

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
const LOCALE_PREFIX_PATTERN = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

export default function LanguageSwitcher({ currentLocale, groupLabel }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(LOCALE_PREFIX_PATTERN, "");

  const rememberLocale = (locale: Locale) => {
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
  };

  return (
    <div className="lang-switch" role="group" aria-label={groupLabel}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${pathWithoutLocale}`}
          hrefLang={locale}
          lang={locale}
          title={localeDisplay[locale].fullName}
          onClick={() => rememberLocale(locale)}
          className={locale === currentLocale ? "lang active" : "lang"}
          style={
            {
              "--flag-image": `url(${localeDisplay[locale].flagIcon})`,
              "--flag-zoom": localeDisplay[locale].flagZoom,
              "--flag-focus": localeDisplay[locale].flagFocus,
            } as CSSProperties
          }
          aria-current={locale === currentLocale ? "true" : undefined}
        >
          {localeDisplay[locale].shortLabel}
        </Link>
      ))}
    </div>
  );
}
