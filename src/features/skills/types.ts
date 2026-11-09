import type { LocalizedText } from "@/core/i18n/config";

export type Skill = { name: string | LocalizedText; level: number; visible: boolean };

export type SkillGroup = { id: string; label: LocalizedText; skills: Skill[] };

export type SkillsCarouselLabels = { previous: LocalizedText; next: LocalizedText };

export type SkillsContent = {
  title: LocalizedText;
  lead: LocalizedText;
  carousel: SkillsCarouselLabels;
  groups: SkillGroup[];
};
