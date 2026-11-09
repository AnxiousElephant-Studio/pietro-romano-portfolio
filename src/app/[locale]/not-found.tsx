"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale, localizedPath } from "@/core/i18n/config";
import { getMessages } from "@/core/i18n/messages";

export default function NotFound() {
  const locale: Locale = usePathname().startsWith("/pt") ? "pt" : "en";
  const notFoundMessages = getMessages(locale).notFound;

  return (
    <section className="section container">
      <p className="eyebrow">404</p>
      <h1>{notFoundMessages.title}</h1>
      <div className="actions">
        <Link href={localizedPath(locale)} className="btn btn-primary">
          {notFoundMessages.backLink}
        </Link>
      </div>
    </section>
  );
}
