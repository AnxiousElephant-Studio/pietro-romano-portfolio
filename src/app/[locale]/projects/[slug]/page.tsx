import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/core/i18n/config";
import { getMessages } from "@/core/i18n/messages";
import ProjectDetail from "@/features/projects/components/ProjectDetail";
import { findProject, projects } from "@/features/projects/projects";

type ProjectPageProps = { params: Promise<{ locale: Locale; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = findProject(slug);

  if (!project) {
    notFound();
  }

  return {
    title: project.title[locale],
    description: project.summary[locale],
    alternates: {
      canonical: `/${locale}/projects/${project.slug}`,
      languages: { "pt-BR": `/pt/projects/${project.slug}`, en: `/en/projects/${project.slug}` },
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  const project = findProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <ProjectDetail project={project} locale={locale} projectMessages={getMessages(locale).projects} />
  );
}
