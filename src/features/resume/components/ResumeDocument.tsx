import Image from "next/image";
import Icon from "@/core/components/Icon";
import { site } from "@/core/site/site";
import type { ResumeContent } from "../types";
import styles from "../resume.module.css";

type ResumeDocumentProps = { resume: ResumeContent };

export default function ResumeDocument({ resume }: ResumeDocumentProps) {
  const contacts = [
    { id: "email", icon: site.owner.emailIcon, label: site.owner.email, url: `mailto:${site.owner.email}` },
    ...site.socialLinks.map((socialLink) => ({
      id: socialLink.id,
      icon: socialLink.icon,
      label: socialLink.handle,
      url: socialLink.url,
    })),
  ];

  return (
    <article className={styles.page}>
      <aside className={styles.sidebar}>
        <Image
          className={styles.photo}
          src={site.owner.photo.src}
          alt={site.owner.name}
          width={site.owner.photo.width}
          height={site.owner.photo.height}
          priority
        />

        <section>
          <h2 className={styles.sidebarHeading}>{resume.headings.contact}</h2>
          <ul className={styles.contactList}>
            {contacts.map((contact) => (
              <li key={contact.id}>
                <Icon src={contact.icon} />
                <a href={contact.url}>{contact.label}</a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className={styles.sidebarHeading}>{resume.headings.skills}</h2>
          {resume.skillGroups.map((skillGroup) => (
            <div key={skillGroup.name} className={styles.skillGroup}>
              <h3>{skillGroup.name}</h3>
              <p>{skillGroup.items.join(" · ")}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className={styles.sidebarHeading}>{resume.headings.certifications}</h2>
          <ul className={styles.plainList}>
            {resume.certifications.map((certification) => (
              <li key={certification}>{certification}</li>
            ))}
          </ul>
        </section>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <h1>{site.owner.fullName}</h1>
          <p className={styles.headline}>{resume.headline}</p>
          <p className={styles.location}>{resume.location}</p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.heading}>{resume.headings.summary}</h2>
          {resume.summary.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>{resume.headings.experience}</h2>
          {resume.experience.map((experience) => (
            <div key={`${experience.company}-${experience.period}`} className={styles.entry}>
              <div className={styles.entryHead}>
                <h3>{experience.role}</h3>
                <span className={styles.period}>{experience.period}</span>
              </div>
              <p className={styles.entryMeta}>
                {experience.company} · {experience.location}
              </p>
              {experience.highlights.length > 0 && (
                <ul className={styles.highlights}>
                  {experience.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>{resume.headings.education}</h2>
          {resume.education.map((education) => (
            <div key={education.institution} className={styles.entry}>
              <div className={styles.entryHead}>
                <h3>{education.degree}</h3>
                <span className={styles.period}>{education.period}</span>
              </div>
              <p className={styles.entryMeta}>{education.institution}</p>
            </div>
          ))}
        </section>
      </div>
    </article>
  );
}
