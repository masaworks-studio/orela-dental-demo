import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Photo frame. Put an image in public/images/ and rebuild to show it (otherwise only the frame shows).
 * All images are AI-generated, so always show "AI-generated image" (rules, section 3).
 */
export function Photo({
  src,
  alt,
  label,
  height,
  className = "photo",
}: {
  /** Path from public (e.g. /images/hero-es.jpg) */
  src: string;
  alt: string;
  /** The "AI-generated image" text (per language) */
  label: string;
  height?: number;
  className?: string;
}) {
  const exists = existsSync(join(process.cwd(), "public", src));
  const style = height ? { height } : undefined;
  if (!exists) {
    return (
      <div className={className} style={style} role="img" aria-label={alt}>
        {label}
      </div>
    );
  }
  return (
    <figure className={`${className} has-image`} style={style}>
      {/* Static export, so next/image optimisation is not used */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      <figcaption>{label}</figcaption>
    </figure>
  );
}
