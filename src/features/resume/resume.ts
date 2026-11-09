import type { Locale } from "@/core/i18n/config";
import resumeData from "./data/resume.json";
import type { ResumeContent } from "./types";

const resumeByLocale: Record<Locale, ResumeContent> = resumeData;

export function getResume(locale: Locale): ResumeContent {
  return resumeByLocale[locale];
}
