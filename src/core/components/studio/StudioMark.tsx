import Image from "next/image";
import { site } from "@/core/site/site";

type StudioMarkProps = { logoSize?: number };

export default function StudioMark({ logoSize = 20 }: StudioMarkProps) {
  return (
    <a href={site.studio.url} target="_blank" rel="noreferrer" className="studio-mark">
      <Image src={site.studio.logo} alt="" width={logoSize} height={logoSize} />
      <span>{site.studio.name}</span>
    </a>
  );
}
