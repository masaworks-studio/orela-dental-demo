import { existsSync } from "node:fs";
import { join } from "node:path";
import { HeroMotion } from "./HeroMotion";

/**
 * Large photo frame on the home page. If public/videos/hero-<version>.mp4 exists, play the video; otherwise slowly zoom in on the photo.
 * Both are AI-generated, so show "AI-generated image". The motion can be paused, and does not run with the "reduce motion" setting.
 */
export function HeroMedia({ region, alt, label, videoLabel, pause, play }: { region: string; alt: string; label: string; videoLabel: string; pause: string; play: string }) {
  const has = (p: string) => existsSync(join(process.cwd(), "public", p));
  const video = `/videos/hero-${region}.mp4`;
  const image = `/images/hero-${region}.jpg`;
  // Image of the video's first frame (shown while loading). If missing, use the home page photo
  const poster = `/videos/hero-${region}-poster.jpg`;
  const hasVideo = has(video);
  return (
    <HeroMotion
      video={hasVideo ? video : undefined}
      image={hasVideo && has(poster) ? poster : has(image) ? image : undefined}
      alt={alt}
      label={hasVideo ? videoLabel : label}
      pauseLabel={pause}
      playLabel={play}
    />
  );
}
