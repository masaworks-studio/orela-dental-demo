import type { Locale, RegionId } from "@/i18n/config";
import { MESSAGES } from "@/i18n/messages";

/**
 * Map of the area (made with Google Maps "Share -> Embed a map"; no API key needed).
 * The clinic's address is not real, so no pin marks a building; the map shows the area instead.
 * es: the Gràcia district of Barcelona; us: the Alief area of Houston (the area Bellaire Boulevard runs through)
 * The map language is matched to the page language by replacing "!1s<language>!2s<country>" in the embed URL.
 */
const AREAS: Record<RegionId, { name: string; embed: string; place: string; country: string }> = {
  es: {
    name: "Gràcia, Barcelona",
    embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23938.687640849017!2d2.1506801!3d41.41022535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2a5e9644c97%3A0xe81ac026b980df66!2sGr%C3%A0cia%2C%20Barcelona!5e0!3m2!1sen!2ses!4v1794162485369!5m2!1sen!2ses",
    place: "https://www.google.com/maps/place/Gr%C3%A0cia,+Barcelona",
    country: "es",
  },
  us: {
    name: "Alief, Houston, TX",
    embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55459.88684467704!2d-95.59138874999998!3d29.683735849999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640dd047bd19953%3A0x57f91beee10de474!2sAlief%2C%20Houston%2C%20TX%2C%20USA!5e0!3m2!1sen!2ses!4v1794162532144!5m2!1sen!2ses",
    place: "https://www.google.com/maps/place/Alief,+Houston,+TX",
    country: "us",
  },
};

export function mapEmbedUrl(region: RegionId, lang: Locale): string {
  const a = AREAS[region];
  return a.embed.replaceAll("!1sen!2ses", `!1s${lang}!2s${a.country}`);
}

/**
 * Map of the area. Like real clinic sites, it shows as soon as the page opens (owner's decision, 2026-11-08).
 * Loading it sends data such as the visitor's IP address to Google, and Google may set cookies.
 * This is explained on the privacy and cookies page.
 */
export function AreaMap({ lang, region }: { lang: Locale; region: RegionId }) {
  const msg = MESSAGES[lang].map;
  const a = AREAS[region];
  return (
    <figure className="area-map">
      <iframe
        className="map-frame"
        src={mapEmbedUrl(region, lang)}
        title={`${msg.illustration} — ${a.name}`}
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <figcaption>
        <strong>{a.name}</strong> · <span className="small">{msg.after}</span>{" "}
        <a href={a.place} target="_blank" rel="noopener noreferrer" className="small">
          {msg.larger} ↗
        </a>
      </figcaption>
    </figure>
  );
}
