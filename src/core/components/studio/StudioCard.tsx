import Image from "next/image";
import { site } from "@/core/site/site";

type StudioCardProps = { label: string; description: string };

export default function StudioCard({ label, description }: StudioCardProps) {
  return (
    <a href={site.studio.url} target="_blank" rel="noreferrer" className="studio-card">
      <Image src={site.studio.logo} alt="" width={64} height={64} />
      <div>
        <span className="studio-card-label">{label}</span>
        <strong>{site.studio.name}</strong>
        <p>{description}</p>
      </div>
    </a>
  );
}
