import type { CSSProperties } from "react";

type IconProps = { src: string; className?: string };

export default function Icon({ src, className }: IconProps) {
  const maskStyle: CSSProperties = {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
  };
  return <span aria-hidden="true" className={className ? `icon ${className}` : "icon"} style={maskStyle} />;
}
