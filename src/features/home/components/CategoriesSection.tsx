import Link from "next/link";
import Reveal from "@/core/components/Reveal";
import { Locale, localizedPath } from "@/core/i18n/config";
import { formatMessage, Messages } from "@/core/i18n/messages";
import { categories, projectsInCategory } from "@/features/projects/projects";

type CategoriesSectionProps = { locale: Locale; homeMessages: Messages["home"] };

export default function CategoriesSection({ locale, homeMessages }: CategoriesSectionProps) {
  return (
    <section id="areas" className="section container home-section">
      <Reveal direction="left">
        <h2>{homeMessages.areasTitle}</h2>
      </Reveal>
      <Reveal direction="up" delayMs={120}>
        <div className="areas">
          {categories.map((category) => {
            const projectCount = projectsInCategory(category.slug).length;
            const projectCountLabel =
              projectCount === 1
                ? homeMessages.projectCountOne
                : formatMessage(homeMessages.projectCountOther, { count: projectCount });

            return (
              <Link
                key={category.slug}
                href={localizedPath(locale, `/projects/category/${category.slug}`)}
                className="area"
              >
                <h3>{category.label[locale]}</h3>
                <p>{category.description[locale]}</p>
                <span className="count">{projectCountLabel}</span>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
