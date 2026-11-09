import Icon from "@/core/components/Icon";
import type { Messages } from "@/core/i18n/messages";
import { site } from "@/core/site/site";
import StudioMark from "@/core/components/studio/StudioMark";
import CurrentYear from "./CurrentYear";

type FooterProps = { footerMessages: Messages["footer"]; emailLabel: string };

export default function Footer({ footerMessages, emailLabel }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <p>
            © <CurrentYear /> {site.owner.name}
          </p>
          <p className="footer-studio">
            {footerMessages.publishedUnder} <StudioMark logoSize={24} />
          </p>
        </div>
        <ul className="footer-links">
          {site.socialLinks.map((socialLink) => (
            <li key={socialLink.id}>
              <a href={socialLink.url} target="_blank" rel="noreferrer" className="icon-link">
                <Icon src={socialLink.icon} />
                {socialLink.label}
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${site.owner.email}`} className="icon-link">
              <Icon src={site.owner.emailIcon} />
              {emailLabel}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
