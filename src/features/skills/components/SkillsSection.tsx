import type { CSSProperties } from "react";
import Reveal from "@/core/components/Reveal";
import type { Locale } from "@/core/i18n/config";
import {
  getSkillName,
  MAX_SKILL_LEVEL,
  skillsCarouselLabels,
  skillsLead,
  skillsTitle,
  visibleSkillGroups,
} from "../skills";
import SkillsCarousel from "./SkillsCarousel";

type SkillsSectionProps = { locale: Locale };

export default function SkillsSection({ locale }: SkillsSectionProps) {
  return (
    <section id="skills" className="section container home-section">
      <Reveal direction="left">
        <h2>{skillsTitle[locale]}</h2>
        <p className="lead section-lead">{skillsLead[locale]}</p>
      </Reveal>
      <Reveal direction="right" delayMs={120}>
        <SkillsCarousel
          previousLabel={skillsCarouselLabels.previous[locale]}
          nextLabel={skillsCarouselLabels.next[locale]}
        >
          {visibleSkillGroups.map((group) => (
            <div key={group.id} className="skill-group">
              <h3>{group.label[locale]}</h3>
              <ul>
                {group.skills.map((skill) => {
                  const skillName = getSkillName(skill, locale);
                  const fillStyle = {
                    "--skill-fill": `${(skill.level / MAX_SKILL_LEVEL) * 100}%`,
                  } as CSSProperties;
                  return (
                    <li key={skillName} className="skill">
                      <div className="skill-head">
                        <span>{skillName}</span>
                        <span className="skill-level">
                          {skill.level}/{MAX_SKILL_LEVEL}
                        </span>
                      </div>
                      <div
                        className="skill-bar"
                        role="meter"
                        aria-label={skillName}
                        aria-valuemin={0}
                        aria-valuemax={MAX_SKILL_LEVEL}
                        aria-valuenow={skill.level}
                      >
                        <span className="skill-bar-fill" style={fillStyle} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </SkillsCarousel>
      </Reveal>
    </section>
  );
}
