"use client";

import { useEffect, useRef, useState } from "react";

export function HeroMotion({
  video,
  image,
  alt,
  label,
  pauseLabel,
  playLabel,
}: {
  video?: string;
  image?: string;
  alt: string;
  label: string;
  pauseLabel: string;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // For users with the "reduce motion" setting, keep it stopped from the start
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) void v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [playing]);

  if (!video && !image) {
    return (
      <div className="photo" role="img" aria-label={alt}>
        {label}
      </div>
    );
  }

  return (
    <figure className={`photo has-image hero-media${playing ? " is-playing" : ""}`}>
      {video ? (
        <video ref={videoRef} src={video} poster={image} muted loop playsInline autoPlay preload="metadata" aria-label={alt} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={alt} className="kenburns" />
      )}
      <figcaption>{label}</figcaption>
      <button type="button" className="hero-toggle" onClick={() => setPlaying((p) => !p)} aria-label={playing ? pauseLabel : playLabel}>
        {playing ? (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
            <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M7 5l12 7-12 7z" fill="currentColor" />
          </svg>
        )}
      </button>
    </figure>
  );
}
