import skillsData from "./data/skills.json";
import type { Locale } from "@/core/i18n/config";
import type { Skill, SkillGroup, SkillsContent } from "./types";

export const MAX_SKILL_LEVEL = 10;

const skillsContent: SkillsContent = skillsData;

export const skillsTitle = skillsContent.title;
export const skillsLead = skillsContent.lead;
export const skillsCarouselLabels = skillsContent.carousel;

export const visibleSkillGroups: SkillGroup[] = skillsContent.groups
  .map((group) => ({ ...group, skills: group.skills.filter((skill) => skill.visible) }))
  .filter((group) => group.skills.length > 0);

export function getSkillName(skill: Skill, locale: Locale) {
  return typeof skill.name === "string" ? skill.name : skill.name[locale];
}
