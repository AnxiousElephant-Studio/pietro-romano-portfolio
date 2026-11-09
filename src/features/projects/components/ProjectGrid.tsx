import EmptyState from "@/core/components/EmptyState";
import type { Locale } from "@/core/i18n/config";
import type { Project } from "../types";
import ProjectCard from "./ProjectCard";

type EmptyStateMessages = { title: string; text: string };

type ProjectGridProps = { projects: Project[]; locale: Locale; emptyStateMessages?: EmptyStateMessages };

export default function ProjectGrid({ projects, locale, emptyStateMessages }: ProjectGridProps) {
  if (projects.length === 0 && emptyStateMessages) {
    return <EmptyState title={emptyStateMessages.title} text={emptyStateMessages.text} />;
  }

  return (
    <div className="grid">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} locale={locale} />
      ))}
    </div>
  );
}
