"use client";

import { useEffect, useState } from "react";
import type { HomeSectionId } from "../sections";

type NavigatorItem = { id: HomeSectionId; label: string };

type SectionNavigatorProps = { items: NavigatorItem[]; ariaLabel: string };

const ACTIVE_BAND_ROOT_MARGIN = "-40% 0px -50% 0px";
const VISIBILITY_THRESHOLDS = [0, 0.25, 0.5, 1];

export default function SectionNavigator({ items, ariaLabel }: SectionNavigatorProps) {
  const [activeSectionId, setActiveSectionId] = useState<HomeSectionId>(items[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSectionId(visibleEntry.target.id as HomeSectionId);
        }
      },
      { rootMargin: ACTIVE_BAND_ROOT_MARGIN, threshold: VISIBILITY_THRESHOLDS },
    );

    items.forEach((item) => {
      const sectionElement = document.getElementById(item.id);

      if (sectionElement) {
        observer.observe(sectionElement);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (sectionId: HomeSectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${sectionId}`);
  };

  return (
    <nav className="section-navigator" aria-label={ariaLabel}>
      <ul>
        {items.map((item) => {
          const isActive = item.id === activeSectionId;
          return (
            <li key={item.id}>
              <button
                type="button"
                className={isActive ? "section-dot active" : "section-dot"}
                aria-current={isActive ? "true" : undefined}
                onClick={() => scrollToSection(item.id)}
              >
                <span className="section-dot-label">{item.label}</span>
                <span className="section-dot-marker" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
