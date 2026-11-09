import Icon from "@/core/components/Icon";
import { site } from "@/core/site/site";

type ContactListProps = { emailLabel: string; studioEmailLabel: string };

export default function ContactList({ emailLabel, studioEmailLabel }: ContactListProps) {
  const contacts = [
    {
      id: "email",
      label: emailLabel,
      icon: site.owner.emailIcon,
      url: `mailto:${site.owner.email}`,
      handle: site.owner.email,
      opensInNewTab: false,
    },
    {
      id: "studio-email",
      label: studioEmailLabel,
      icon: site.studio.emailIcon,
      url: `mailto:${site.studio.email}`,
      handle: site.studio.email,
      opensInNewTab: false,
    },
    ...site.socialLinks.map((socialLink) => ({ ...socialLink, opensInNewTab: true })),
  ];

  return (
    <ul className="contact-list">
      {contacts.map((contact) => (
        <li key={contact.id}>
          <a
            href={contact.url}
            className="contact-item"
            target={contact.opensInNewTab ? "_blank" : undefined}
            rel={contact.opensInNewTab ? "noreferrer" : undefined}
          >
            <span className="contact-label">
              <Icon src={contact.icon} />
              {contact.label}
            </span>
            <span className="contact-handle">{contact.handle}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
