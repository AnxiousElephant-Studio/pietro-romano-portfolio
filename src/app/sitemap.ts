import type { MetadataRoute } from "next";
import { locales } from "@/core/i18n/config";
import { siteUrl } from "@/core/site/siteUrl";
import { categories, projects } from "@/features/projects/projects";

const STATIC_PATHS = ["", "/projects", "/about", "/resume"];

export default function sitemap(): MetadataRoute.Sitemap {
  const pagePaths = [
    ...STATIC_PATHS,
    ...projects.map((project) => `/projects/${project.slug}`),
    ...categories.map((category) => `/projects/category/${category.slug}`),
  ];
  const lastModified = new Date();

  return pagePaths.flatMap((pagePath) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${pagePath}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: pagePath === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alternateLocale) => [
            alternateLocale === "pt" ? "pt-BR" : alternateLocale,
            `${siteUrl}/${alternateLocale}${pagePath}`,
          ]),
        ),
      },
    })),
  );
}
