import Image from "next/image";
import Link from "next/link";
import Icon from "@/core/components/Icon";
import Reveal from "@/core/components/Reveal";
import { Locale, localizedPath } from "@/core/i18n/config";
import type { Messages } from "@/core/i18n/messages";
import { site } from "@/core/site/site";
import HeroBackdrop from "./HeroBackdrop";

type HeroSectionProps = { locale: Locale; homeMessages: Messages["home"]; scrollHint: string };

export default function HeroSection({ locale, homeMessages, scrollHint }: HeroSectionProps) {
  return (
    <section id="hero" className="hero-band">
      <HeroBackdrop />
      <div className="hero container">
        <Reveal direction="left" className="hero-text">
          <Link href={`${localizedPath(locale, "/about")}#contact`} className="open-to-work">
            <span className="open-to-work-dot" aria-hidden="true" />
            {homeMessages.openToWork}
          </Link>
          <p className="eyebrow">{homeMessages.eyebrow}</p>
          <h1>
            {homeMessages.titleStart}
            <span className="accent">{homeMessages.titleAccent}</span>
            {homeMessages.titleEnd}
          </h1>
          <p className="lead">{homeMessages.lead}</p>
          <div className="actions">
            <Link href={localizedPath(locale, "/projects")} className="btn btn-primary">
              {homeMessages.primaryAction}
            </Link>
            <Link href={localizedPath(locale, "/resume")} className="btn btn-ghost icon-link">
              <Icon src="/icons/social/resume.svg" />
              {homeMessages.resumeAction}
            </Link>
            <Link href={localizedPath(locale, "/about")} className="btn btn-ghost">
              {homeMessages.secondaryAction}
            </Link>
          </div>
        </Reveal>
        <Reveal direction="right" delayMs={150} className="hero-media">
          <Image
            src={site.owner.photo.src}
            alt={site.owner.name}
            width={site.owner.photo.width}
            height={site.owner.photo.height}
            priority
          />
        </Reveal>
      </div>
      <a href="#featured" className="scroll-hint" aria-label={scrollHint}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
