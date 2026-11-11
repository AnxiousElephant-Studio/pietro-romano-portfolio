import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { Locale, localizedPath } from "@/core/i18n/config";
import Icon from "@/core/components/Icon";
import RichText from "@/core/components/RichText";
import type { Messages } from "@/core/i18n/messages";
import StudioMark from "@/core/components/studio/StudioMark";
import { getCategoryLabel } from "../projects";
import type { Project } from "../types";
import ProjectGallery from "./ProjectGallery";

type ProjectDetailProps = {
  project: Project;
  locale: Locale;
  projectMessages: Messages["projects"];
};

export default function ProjectDetail({ project, locale, projectMessages }: ProjectDetailProps) {
  const { details } = project;

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
        <Image
          src={project.cover.src}
          alt=""
          width={project.cover.width}
          height={project.cover.height}
          priority
        />
      </div>

      <div className="project-body">
        <div className="prose">
          <h2>{projectMessages.aboutHeading}</h2>
          <RichText text={details.about[locale]} />
          {details.modules && (
            <>
              <h2>{projectMessages.modulesHeading}</h2>
              <div className="project-modules">
                {details.modules.map((projectModule) => (
                  <section key={projectModule.name.en} className="project-module">
                    <h3>{projectModule.name[locale]}</h3>
                    <RichText text={projectModule.description[locale]} />
                    {projectModule.parts && (
                      <dl className="project-module-parts">
                        {projectModule.parts.map((part) => (
                          <Fragment key={part.name.en}>
                            <dt>{part.name[locale]}</dt>
                            <dd>
                              <RichText text={part.description[locale]} />
                            </dd>
                          </Fragment>
                        ))}
                      </dl>
                    )}
                  </section>
                ))}
              </div>
            </>
          )}
          {details.sections?.map((section) => (
            <Fragment key={section.heading.en}>
              <h2>{section.heading[locale]}</h2>
              <RichText text={section.text[locale]} />
            </Fragment>
          ))}
          {details.role && (
            <>
              <h2>{projectMessages.roleHeading}</h2>
              <RichText text={details.role[locale]} />
            </>
          )}
          {details.challenges && (
            <>
              <h2>{projectMessages.challengesHeading}</h2>
              <RichText text={details.challenges[locale]} />
            </>
          )}
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

      {project.media && (
        <ProjectGallery
          media={project.media}
          locale={locale}
          labels={{
            heading: projectMessages.galleryHeading,
            close: projectMessages.galleryClose,
            previous: projectMessages.galleryPrevious,
            next: projectMessages.galleryNext,
          }}
        />
      )}
    </article>
  );
}
