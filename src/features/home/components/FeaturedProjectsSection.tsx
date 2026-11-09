import Link from "next/link";
import Reveal from "@/core/components/Reveal";
import { Locale, localizedPath } from "@/core/i18n/config";
import type { Messages } from "@/core/i18n/messages";
import ProjectCard from "@/features/projects/components/ProjectCard";
import { featuredProjects } from "@/features/projects/projects";
import ComingSoonCard from "./ComingSoonCard";

type FeaturedProjectsSectionProps = { locale: Locale; homeMessages: Messages["home"] };

const FEATURED_SLOT_COUNT = 3;

export default function FeaturedProjectsSection({ locale, homeMessages }: FeaturedProjectsSectionProps) {
  const comingSoonSlotIds = Array.from(
    { length: Math.max(FEATURED_SLOT_COUNT - featuredProjects.length, 0) },
    (_, slotIndex) => `coming-soon-${slotIndex}`,
  );

  return (
    <section id="featured" className="section container home-section">
      <Reveal direction="left">
        <div className="section-head">
          <h2>{homeMessages.featuredTitle}</h2>
          <Link href={localizedPath(locale, "/projects")} className="more">
            {homeMessages.allProjectsLink}
          </Link>
        </div>
      </Reveal>
      <Reveal direction="up" delayMs={120}>
        <div className="grid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
          {comingSoonSlotIds.map((slotId) => (
            <ComingSoonCard
              key={slotId}
              label={homeMessages.comingSoonLabel}
              title={homeMessages.comingSoonTitle}
              text={homeMessages.comingSoonText}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
