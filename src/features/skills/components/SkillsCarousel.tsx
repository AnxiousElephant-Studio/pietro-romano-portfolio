"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

type SkillsCarouselProps = { children: ReactNode; previousLabel: string; nextLabel: string };

type ScrollDirection = 1 | -1;

const DRAG_THRESHOLD_PX = 6;
const SCROLL_EDGE_TOLERANCE_PX = 4;
const PAGE_SCROLL_RATIO = 0.85;
const PRIMARY_MOUSE_BUTTON = 0;

export default function SkillsCarousel({ children, previousLabel, nextLabel }: SkillsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({ isPointerDown: false, startX: 0, startScrollLeft: 0, hasDragged: false });
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateScrollButtons = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    setCanScrollPrevious(track.scrollLeft > SCROLL_EDGE_TOLERANCE_PX);
    setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - SCROLL_EDGE_TOLERANCE_PX);
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    updateScrollButtons();
    track.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      track.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const scrollByPage = (direction: ScrollDirection) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    track.scrollBy({ left: direction * track.clientWidth * PAGE_SCROLL_RATIO, behavior: "smooth" });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;

    if (!track || event.pointerType !== "mouse" || event.button !== PRIMARY_MOUSE_BUTTON) {
      return;
    }

    dragStateRef.current = {
      isPointerDown: true,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
      hasDragged: false,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    const track = trackRef.current;

    if (!dragState.isPointerDown || !track) {
      return;
    }

    const dragDistance = event.clientX - dragState.startX;

    if (!dragState.hasDragged) {
      if (Math.abs(dragDistance) < DRAG_THRESHOLD_PX) {
        return;
      }

      dragState.hasDragged = true;
      track.setPointerCapture(event.pointerId);
      setIsDragging(true);
    }

    track.scrollLeft = dragState.startScrollLeft - dragDistance;
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    const track = trackRef.current;
    dragState.isPointerDown = false;

    if (!dragState.hasDragged) {
      return;
    }

    if (track?.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    setIsDragging(false);
  };

  return (
    <div className="carousel">
      <div
        ref={trackRef}
        className={isDragging ? "carousel-track is-dragging" : "carousel-track"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onDragStart={(event) => event.preventDefault()}
      >
        {children}
      </div>
      <div className="carousel-controls">
        <button
          type="button"
          className="carousel-button"
          aria-label={previousLabel}
          disabled={!canScrollPrevious}
          onClick={() => scrollByPage(-1)}
        >
          ←
        </button>
        <button
          type="button"
          className="carousel-button"
          aria-label={nextLabel}
          disabled={!canScrollNext}
          onClick={() => scrollByPage(1)}
        >
          →
        </button>
      </div>
    </div>
  );
}
