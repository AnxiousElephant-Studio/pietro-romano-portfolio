import type { Locale } from "@/core/i18n/config";
import sectionsData from "./data/sections.json";

export const HOME_SECTION_IDS = ["hero", "featured", "skills", "areas"] as const;
export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

export type HomeSectionsContent = {
  navigatorLabel: string;
  scrollHint: string;
  sections: Record<HomeSectionId, string>;
};

const sectionsByLocale: Record<Locale, HomeSectionsContent> = sectionsData;

export function getHomeSections(locale: Locale): HomeSectionsContent {
  return sectionsByLocale[locale];
}
