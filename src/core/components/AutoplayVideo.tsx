"use client";

import { useEffect, useRef } from "react";

type AutoplayVideoProps = { src: string; poster: string; width: number; height: number; label: string };

export default function AutoplayVideo({ src, poster, width, height, label }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;
    video.play().catch(() => undefined);
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      width={width}
      height={height}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );
}
