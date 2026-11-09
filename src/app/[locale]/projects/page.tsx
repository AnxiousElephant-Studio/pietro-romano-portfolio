import type { Metadata } from "next";
import type { Locale } from "@/core/i18n/config";
import { getMessages } from "@/core/i18n/messages";
import CategoryFilter from "@/features/projects/components/CategoryFilter";
import ProjectGrid from "@/features/projects/components/ProjectGrid";
import { projects } from "@/features/projects/projects";

type ProjectsPageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;

  return { title: getMessages(locale).projects.title };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const projectMessages = getMessages(locale).projects;

  return (
    <section className="section container">
      <h1>{projectMessages.title}</h1>
      <p className="lead">{projectMessages.lead}</p>
      <CategoryFilter locale={locale} allCategoriesLabel={projectMessages.allCategories} />
      <ProjectGrid
        projects={projects}
        locale={locale}
        emptyStateMessages={{ title: projectMessages.emptyTitle, text: projectMessages.emptyText }}
      />
    </section>
  );
}
