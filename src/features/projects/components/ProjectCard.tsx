import Image from "next/image";
import Link from "next/link";
import { Locale, localizedPath } from "@/core/i18n/config";
import { getCategoryLabel, PROJECT_COVER_SIZE } from "../projects";
import type { Project } from "../types";

type ProjectCardProps = { project: Project; locale: Locale };

const MAX_CARD_TECHNOLOGIES = 5;

export default function ProjectCard({ project, locale }: ProjectCardProps) {
  const visibleTechnologies = project.technologies.slice(0, MAX_CARD_TECHNOLOGIES);
  const hiddenTechnologyCount = project.technologies.length - visibleTechnologies.length;

  return (
    <Link href={localizedPath(locale, `/projects/${project.slug}`)} className="card">
      <div className="card-media">
        <Image src={project.cover} alt="" width={PROJECT_COVER_SIZE.width} height={PROJECT_COVER_SIZE.height} />
      </div>
      <div className="card-body">
        <div className="card-meta">
          {project.categories.map((categorySlug) => (
            <span key={categorySlug} className="chip">
              {getCategoryLabel(categorySlug, locale)}
            </span>
          ))}
          <span className="year">{project.year}</span>
        </div>
        <h3>{project.title[locale]}</h3>
        <p>{project.summary[locale]}</p>
        {visibleTechnologies.length > 0 && (
          <ul className="tags card-tech">
            {visibleTechnologies.map((technology) => (
              <li key={technology} className="chip chip-tech">
                {technology}
              </li>
            ))}
            {hiddenTechnologyCount > 0 && <li className="chip chip-tech chip-more">+{hiddenTechnologyCount}</li>}
          </ul>
        )}
      </div>
    </Link>
  );
}
