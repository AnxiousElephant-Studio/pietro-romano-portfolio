"use client";

import { useEffect, useRef } from "react";
import { getFrameDeltaSeconds } from "@/core/lib/frameTime";
import { approachExponentially } from "@/core/lib/math";

const FINE_POINTER_QUERY = "(pointer: fine)";
const INTERACTIVE_SELECTOR = "a, button, [role='button'], label, summary, .card, .area";
const RING_FOLLOW_RATE_PER_SECOND = 15;
const RING_SETTLE_DISTANCE_PX = 0.1;
const OFFSCREEN_POSITION_PX = -100;

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring || !window.matchMedia(FINE_POINTER_QUERY).matches) {
      return;
    }

    const rootElement = document.documentElement;
    const pointerPosition = { x: OFFSCREEN_POSITION_PX, y: OFFSCREEN_POSITION_PX };
    const ringPosition = { x: OFFSCREEN_POSITION_PX, y: OFFSCREEN_POSITION_PX };
    let animationFrameId = 0;
    let lastFrameTime = 0;

    const moveRing = (frameTime: number) => {
      const deltaSeconds = getFrameDeltaSeconds(lastFrameTime, frameTime);
      lastFrameTime = frameTime;

      ringPosition.x = approachExponentially(ringPosition.x, pointerPosition.x, RING_FOLLOW_RATE_PER_SECOND, deltaSeconds);
      ringPosition.y = approachExponentially(ringPosition.y, pointerPosition.y, RING_FOLLOW_RATE_PER_SECOND, deltaSeconds);
      ring.style.transform = `translate3d(${ringPosition.x}px, ${ringPosition.y}px, 0)`;

      const isSettled =
        Math.abs(pointerPosition.x - ringPosition.x) < RING_SETTLE_DISTANCE_PX &&
        Math.abs(pointerPosition.y - ringPosition.y) < RING_SETTLE_DISTANCE_PX;

      if (isSettled) {
        animationFrameId = 0;
        lastFrameTime = 0;
        return;
      }

      animationFrameId = requestAnimationFrame(moveRing);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      pointerPosition.x = event.clientX;
      pointerPosition.y = event.clientY;
      dot.style.transform = `translate3d(${pointerPosition.x}px, ${pointerPosition.y}px, 0)`;
      rootElement.classList.add("cursor-visible");

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(moveRing);
      }
    };

    const handlePointerOver = (event: PointerEvent) => {
      const isOverInteractive = Boolean((event.target as Element).closest(INTERACTIVE_SELECTOR));
      rootElement.classList.toggle("cursor-hovering", isOverInteractive);
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        rootElement.classList.remove("cursor-visible");
      }
    };

    const handlePointerDown = () => rootElement.classList.add("cursor-pressed");
    const handlePointerUp = () => rootElement.classList.remove("cursor-pressed");

    rootElement.classList.add("has-custom-cursor");
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      rootElement.classList.remove("has-custom-cursor", "cursor-visible", "cursor-hovering", "cursor-pressed");
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <div className="custom-cursor" aria-hidden="true">
      <div ref={ringRef} className="custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </div>
  );
}
