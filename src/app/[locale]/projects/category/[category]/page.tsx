import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/core/i18n/config";
import { formatMessage, getMessages } from "@/core/i18n/messages";
import CategoryFilter from "@/features/projects/components/CategoryFilter";
import ProjectGrid from "@/features/projects/components/ProjectGrid";
import { categories, findCategory, projectsInCategory } from "@/features/projects/projects";

type CategoryPageProps = { params: Promise<{ locale: Locale; category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;
  const category = findCategory(categorySlug);
  const projectMessages = getMessages(locale).projects;

  return {
    title: category
      ? formatMessage(projectMessages.categoryTitle, { category: category.label[locale] })
      : projectMessages.title,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category: categorySlug } = await params;
  const category = findCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const projectMessages = getMessages(locale).projects;

  return (
    <section className="section container">
      <h1>{category.label[locale]}</h1>
      <p className="lead">{category.description[locale]}</p>
      <CategoryFilter
        locale={locale}
        allCategoriesLabel={projectMessages.allCategories}
        activeCategorySlug={category.slug}
      />
      <ProjectGrid
        projects={projectsInCategory(category.slug)}
        locale={locale}
        emptyStateMessages={{ title: projectMessages.emptyTitle, text: projectMessages.emptyText }}
      />
    </section>
  );
}
