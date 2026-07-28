import type { Metadata } from "next";
import { SITE } from "@/constants/site";

export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

/** Absolute URL for a site-relative path — schema.org fields need absolute. */
export function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${siteUrl}${path}`;
}

/**
 * Standard page metadata. Every page carries its own openGraph block so social
 * previews show the page's own title rather than inheriting the site default
 * from the root layout.
 */
export function pageMetadata({
  title,
  description,
}: {
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [SITE.ogImage],
    },
  };
}

/**
 * LocalBusiness structured data for the homepage and contact page.
 *
 * openingHours is deliberately omitted — the studio's hours are not known, and
 * spec 23 asks for them only "if available". Inventing them would put wrong
 * data in front of search engines, the same failure mode as the placeholder
 * contact details in constants/site.ts.
 */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#studio`,
    name: SITE.name,
    description: SITE.description,
    url: siteUrl,
    telephone: SITE.phone,
    email: SITE.email,
    image: absoluteUrl(SITE.ogImage),
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.0225,
      longitude: 72.5714,
    },
    sameAs: [SITE.instagramUrl, SITE.linkedinUrl].filter(Boolean),
  };
}

/** One ImageObject per gallery image on a project detail page. */
export function galleryImageSchema(
  images: { url: string; name: string; caption?: string }[],
) {
  return images.map((image) => ({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: absoluteUrl(image.url),
    name: image.name,
    ...(image.caption ? { description: image.caption } : {}),
  }));
}
