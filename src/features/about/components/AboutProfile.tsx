import Image from "next/image";
import { formatMessage, Messages } from "@/core/i18n/messages";
import { site } from "@/core/site/site";
import StudioCard from "@/core/components/studio/StudioCard";
import ContactList from "./ContactList";

type AboutProfileProps = { aboutMessages: Messages["about"] };

export default function AboutProfile({ aboutMessages }: AboutProfileProps) {
  return (
    <section className="section container about">
      <div className="about-media">
        <Image
          src={site.owner.photo.src}
          alt={site.owner.name}
          width={site.owner.photo.width}
          height={site.owner.photo.height}
          priority
        />
      </div>
      <div className="about-text">
        <p className="eyebrow">{aboutMessages.eyebrow}</p>
        <h1>{formatMessage(aboutMessages.heading, { ownerName: site.owner.name })}</h1>
        <p className="lead">{aboutMessages.introduction}</p>
        {aboutMessages.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        <StudioCard label={aboutMessages.studioLabel} description={aboutMessages.studioDescription} />

        <h2 id="contact">{aboutMessages.contactHeading}</h2>
        <ContactList
          emailLabel={aboutMessages.emailLabel}
          studioEmailLabel={aboutMessages.studioEmailLabel}
        />
      </div>
    </section>
  );
}
