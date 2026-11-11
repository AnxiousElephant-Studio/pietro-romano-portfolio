"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import AutoplayVideo from "@/core/components/AutoplayVideo";
import type { LocalizedText, Locale } from "@/core/i18n/config";
import type { ProjectMedia } from "../types";

type GalleryLabels = { heading: string; close: string; previous: string; next: string };

type ProjectGalleryProps = { media: ProjectMedia; locale: Locale; labels: GalleryLabels };

type GalleryItem = {
  kind: "image" | "video";
  src: string;
  thumbnail: string;
  width: number;
  height: number;
  caption: LocalizedText;
};

const SWIPE_THRESHOLD_PX = 50;

function toGalleryItems(media: ProjectMedia): GalleryItem[] {
  const videoItems = (media.videos ?? []).map<GalleryItem>((video) => ({
    kind: "video",
    src: video.src,
    thumbnail: video.poster,
    width: video.width,
    height: video.height,
    caption: video.caption,
  }));
  const imageItems = (media.images ?? []).map<GalleryItem>((image) => ({
    kind: "image",
    src: image.src,
    thumbnail: image.src,
    width: image.width,
    height: image.height,
    caption: image.caption,
  }));

  return [...videoItems, ...imageItems];
}

export default function ProjectGallery({ media, locale, labels }: ProjectGalleryProps) {
  const items = toGalleryItems(media);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const itemCount = items.length;

  const close = useCallback(() => setOpenIndex(null), []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((currentIndex) => {
        if (currentIndex === null) {
          return null;
        }

        return (currentIndex + direction + itemCount) % itemCount;
      });
    },
    [itemCount],
  );

  useEffect(() => {
    if (openIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowRight") {
        step(1);
      } else if (event.key === "ArrowLeft") {
        step(-1);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openIndex, close, step]);

  const handleTouchEnd = (endX: number) => {
    if (touchStartX === null) {
      return;
    }

    const swipeDistance = endX - touchStartX;
    setTouchStartX(null);

    if (Math.abs(swipeDistance) >= SWIPE_THRESHOLD_PX) {
      step(swipeDistance < 0 ? 1 : -1);
    }
  };

  const openItem = openIndex === null ? null : items[openIndex];

  return (
    <section className="project-gallery">
      <h2>{labels.heading}</h2>
      <div className="gallery">
        {items.map((item, index) => (
          <figure key={item.src} className="gallery-item">
            <button type="button" className="gallery-thumb" onClick={() => setOpenIndex(index)}>
              {item.kind === "video" ? (
                <AutoplayVideo
                  src={item.src}
                  poster={item.thumbnail}
                  width={item.width}
                  height={item.height}
                  label={item.caption[locale]}
                />
              ) : (
                <Image src={item.thumbnail} alt={item.caption[locale]} width={item.width} height={item.height} />
              )}
              {item.kind === "video" && <span className="gallery-badge" aria-hidden="true">▶</span>}
            </button>
            <figcaption>{item.caption[locale]}</figcaption>
          </figure>
        ))}
      </div>

      {openItem && openIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={openItem.caption[locale]}
          onClick={close}
          onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
          onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
        >
          <button type="button" className="lightbox-close" aria-label={labels.close} onClick={close}>
            ✕
          </button>
          {itemCount > 1 && (
            <button
              type="button"
              className="lightbox-arrow lightbox-previous"
              aria-label={labels.previous}
              onClick={(event) => {
                event.stopPropagation();
                step(-1);
              }}
            >
              ←
            </button>
          )}
          <figure className="lightbox-content" onClick={(event) => event.stopPropagation()}>
            {openItem.kind === "video" ? (
              <video
                key={openItem.src}
                src={openItem.src}
                poster={openItem.thumbnail}
                width={openItem.width}
                height={openItem.height}
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            ) : (
              <Image
                key={openItem.src}
                src={openItem.src}
                alt={openItem.caption[locale]}
                width={openItem.width}
                height={openItem.height}
              />
            )}
            <figcaption>
              <span>{openItem.caption[locale]}</span>
              <span className="lightbox-counter">
                {openIndex + 1} / {itemCount}
              </span>
            </figcaption>
          </figure>
          {itemCount > 1 && (
            <button
              type="button"
              className="lightbox-arrow lightbox-next"
              aria-label={labels.next}
              onClick={(event) => {
                event.stopPropagation();
                step(1);
              }}
            >
              →
            </button>
          )}
        </div>
      )}
    </section>
  );
}
