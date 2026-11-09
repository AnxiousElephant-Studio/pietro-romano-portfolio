"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealDirection = "up" | "left" | "right";

const VISIBILITY_THRESHOLD = 0.15;
const BOTTOM_TRIGGER_OFFSET_MARGIN = "0px 0px -40px 0px";

type RevealProps = {
  children: ReactNode;
  direction?: RevealDirection;
  delayMs?: number;
  className?: string;
};

export default function Reveal({ children, direction = "up", delayMs = 0, className }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: VISIBILITY_THRESHOLD, rootMargin: BOTTOM_TRIGGER_OFFSET_MARGIN },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const classNames = ["reveal", `reveal-${direction}`, isVisible ? "is-visible" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
  const delayStyle: CSSProperties = { transitionDelay: `${delayMs}ms` };

  return (
    <div ref={elementRef} className={classNames} style={delayStyle}>
      {children}
    </div>
  );
}
