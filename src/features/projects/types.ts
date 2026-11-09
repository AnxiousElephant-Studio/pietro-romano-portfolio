import type { LocalizedText } from "@/core/i18n/config";

export type Category = {
  slug: string;
  label: LocalizedText;
  description: LocalizedText;
};

export type ProjectDetails = { about: LocalizedText; role: LocalizedText; challenges: LocalizedText };

export type ProjectLink = { label: string; url: string; icon?: string };

export type Project = {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  categories: string[];
  year: string;
  cover: string;
  technologies: string[];
  featured?: boolean;
  publishedByStudio?: boolean;
  links?: ProjectLink[];
  details: ProjectDetails;
};
