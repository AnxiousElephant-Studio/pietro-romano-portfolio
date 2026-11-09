"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Locale, localizedPath } from "@/core/i18n/config";
import type { Messages } from "@/core/i18n/messages";
import { site } from "@/core/site/site";
import LanguageSwitcher from "./LanguageSwitcher";

type HeaderProps = { locale: Locale; navigationMessages: Messages["navigation"] };

export default function Header({ locale, navigationMessages }: HeaderProps) {
  const pathname = usePathname();
  const homePath = localizedPath(locale);
  const navigationItems = [
    { path: homePath, label: navigationMessages.home },
    { path: localizedPath(locale, "/projects"), label: navigationMessages.projects },
    { path: localizedPath(locale, "/about"), label: navigationMessages.about },
    { path: localizedPath(locale, "/resume"), label: navigationMessages.resume },
  ];
  const isActivePath = (path: string) =>
    path === homePath ? pathname === path : pathname.startsWith(path);
  const navigationListRef = useRef<HTMLUListElement>(null);
  const [indicatorBox, setIndicatorBox] = useState({ left: 0, top: 0, width: 0, height: 0, isVisible: false });

  const moveIndicatorTo = useCallback((linkElement: HTMLElement | null) => {
    if (!linkElement) {
      setIndicatorBox((currentBox) => ({ ...currentBox, isVisible: false }));
      return;
    }

    setIndicatorBox({
      left: linkElement.offsetLeft,
      top: linkElement.offsetTop,
      width: linkElement.offsetWidth,
      height: linkElement.offsetHeight,
      isVisible: true,
    });
  }, []);

  const moveIndicatorToActiveLink = useCallback(() => {
    moveIndicatorTo(navigationListRef.current?.querySelector<HTMLElement>(".nav-link.active") ?? null);
  }, [moveIndicatorTo]);

  useEffect(() => {
    moveIndicatorToActiveLink();
    window.addEventListener("resize", moveIndicatorToActiveLink);

    return () => window.removeEventListener("resize", moveIndicatorToActiveLink);
  }, [pathname, moveIndicatorToActiveLink]);

  const indicatorStyle = {
    width: `${indicatorBox.width}px`,
    height: `${indicatorBox.height}px`,
    transform: `translate(${indicatorBox.left}px, ${indicatorBox.top}px)`,
    opacity: indicatorBox.isVisible ? 1 : 0,
  } as CSSProperties;

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={homePath} className="logo">
          {site.owner.name}
          <span className="accent">.</span>
        </Link>
        <div className="header-right">
          <nav aria-label="Main">
            <ul ref={navigationListRef} className="nav-list" onPointerLeave={moveIndicatorToActiveLink}>
              <li className="nav-indicator" style={indicatorStyle} aria-hidden="true" />
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={isActivePath(item.path) ? "nav-link active" : "nav-link"}
                    aria-current={isActivePath(item.path) ? "page" : undefined}
                    onPointerEnter={(event) => moveIndicatorTo(event.currentTarget)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageSwitcher currentLocale={locale} groupLabel={navigationMessages.language} />
        </div>
      </div>
    </header>
  );
}
