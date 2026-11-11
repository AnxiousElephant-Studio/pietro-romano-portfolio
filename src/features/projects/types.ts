import type { LocalizedText } from "@/core/i18n/config";

export type Category = {
  slug: string;
  label: LocalizedText;
  description: LocalizedText;
};

export type ProjectImage = { src: string; width: number; height: number };

export type ProjectGalleryImage = ProjectImage & { caption: LocalizedText };

export type ProjectVideo = { src: string; poster: string; width: number; height: number; caption: LocalizedText };

export type ProjectMedia = { videos?: ProjectVideo[]; images?: ProjectGalleryImage[] };

export type ProjectSection = { heading: LocalizedText; text: LocalizedText };

export type ProjectModulePart = { name: LocalizedText; description: LocalizedText };

export type ProjectModule = { name: LocalizedText; description: LocalizedText; parts?: ProjectModulePart[] };

export type ProjectDetails = {
  about: LocalizedText;
  modules?: ProjectModule[];
  sections?: ProjectSection[];
  role?: LocalizedText;
  challenges?: LocalizedText;
};

export type ProjectLink = { label: string; url: string; icon?: string };

export type Project = {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  categories: string[];
  year: string;
  cover: ProjectImage;
  technologies: string[];
  featured?: boolean;
  publishedByStudio?: boolean;
  links?: ProjectLink[];
  details: ProjectDetails;
  media?: ProjectMedia;
};
