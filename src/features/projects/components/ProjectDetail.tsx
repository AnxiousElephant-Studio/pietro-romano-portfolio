import Image from "next/image";
import Link from "next/link";
import { Locale, localizedPath } from "@/core/i18n/config";
import Icon from "@/core/components/Icon";
import { formatMessage, Messages } from "@/core/i18n/messages";
import StudioMark from "@/core/components/studio/StudioMark";
import { placeholderImageUrl } from "@/core/lib/placeholderImage";
import { getCategoryLabel, PROJECT_COVER_SIZE } from "../projects";
import type { Project } from "../types";

type ProjectDetailProps = {
  project: Project;
  locale: Locale;
  projectMessages: Messages["projects"];
};

const GALLERY_IMAGE_NUMBERS = [1, 2, 3];
const GALLERY_IMAGE_SIZE = { width: 800, height: 450 };

export default function ProjectDetail({ project, locale, projectMessages }: ProjectDetailProps) {
  return (
    <article className="section container project">
      <Link href={localizedPath(locale, "/projects")} className="more">
        {projectMessages.backLink}
      </Link>
      <header className="project-head">
        <div className="card-meta">
          {project.categories.map((categorySlug) => (
            <Link
              key={categorySlug}
              href={localizedPath(locale, `/projects/category/${categorySlug}`)}
              className="chip"
            >
              {getCategoryLabel(categorySlug, locale)}
            </Link>
          ))}
          <span className="year">{project.year}</span>
        </div>
        <h1>{project.title[locale]}</h1>
        <p className="lead">{project.summary[locale]}</p>
        {project.links && (
          <div className="actions">
            {project.links.map((link) => (
              <a key={link.url} href={link.url} className="btn btn-ghost icon-link" target="_blank" rel="noreferrer">
                {link.icon && <Icon src={link.icon} />}
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </header>

      <div className="project-cover">
        <Image src={project.cover} alt="" width={PROJECT_COVER_SIZE.width} height={PROJECT_COVER_SIZE.height} priority />
      </div>

      <div className="project-body">
        <div className="prose">
          <h2>{projectMessages.aboutHeading}</h2>
          <p>{project.details.about[locale]}</p>
          <h2>{projectMessages.roleHeading}</h2>
          <p>{project.details.role[locale]}</p>
          <h2>{projectMessages.challengesHeading}</h2>
          <p>{project.details.challenges[locale]}</p>
        </div>
        <aside className="project-aside">
          <h3>{projectMessages.technologiesHeading}</h3>
          <ul className="tags">
            {project.technologies.map((technology) => (
              <li key={technology} className="chip chip-tech">
                {technology}
              </li>
            ))}
          </ul>
          {project.publishedByStudio && (
            <>
              <h3 className="aside-sub">{projectMessages.publishedByHeading}</h3>
              <StudioMark logoSize={30} />
            </>
          )}
        </aside>
      </div>

      <div className="gallery">
        {GALLERY_IMAGE_NUMBERS.map((imageNumber) => (
          <Image
            key={imageNumber}
            src={placeholderImageUrl({
              text: formatMessage(projectMessages.galleryImageLabel, { number: imageNumber }),
              ...GALLERY_IMAGE_SIZE,
            })}
            alt=""
            width={GALLERY_IMAGE_SIZE.width}
            height={GALLERY_IMAGE_SIZE.height}
          />
        ))}
      </div>
    </article>
  );
}
