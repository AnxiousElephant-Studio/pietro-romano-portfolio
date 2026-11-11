import type { Locale } from "@/core/i18n/config";
import categoriesData from "./data/categories.json";
import projectsData from "./data/projects.json";
import type { Category, Project } from "./types";

export const categories: Category[] = categoriesData;
export const projects: Project[] = projectsData;

export const featuredProjects = projects.filter((project) => project.featured);

export function findProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function findCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function projectsInCategory(categorySlug: string) {
  return projects.filter((project) => project.categories.includes(categorySlug));
}

export function getCategoryLabel(categorySlug: string, locale: Locale) {
  return findCategory(categorySlug)?.label[locale] ?? categorySlug;
}
