"use client";

import Image, { type ImageProps } from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/lib/sanity/image";

/**
 * Widest image ever requested. next/image asks for up to 3840px for a
 * full-bleed frame on a 2x screen. That costs several times the bytes and
 * decode time of 2560px for no difference anyone can see in a photograph.
 */
const MAX_WIDTH = 2560;

type SanityImageProps = Omit<ImageProps, "src" | "loader"> & {
  source: SanityImageSource;
  /** width / height. Set it to hard-crop on the CDN; leave it out for stretched frames. */
  ratio?: number;
};

/**
 * next/image fed straight from Sanity's CDN: every srcset width is a Sanity
 * URL, so images skip a second pass through the Vercel optimiser (same reason
 * as ProjectCard). A client component because a loader is a function, and
 * Server Components can't hand functions to next/image.
 */
export default function SanityImage({ source, ratio, alt, ...props }: SanityImageProps) {
  const loader: ImageProps["loader"] = ({ width, quality }) => {
    const capped = Math.min(width, MAX_WIDTH);
    let image = urlFor(source).width(capped).auto("format").quality(quality ?? 75);
    if (ratio) image = image.height(Math.round(capped / ratio)).fit("crop");
    return image.url();
  };

  return <Image {...props} alt={alt} loader={loader} src={urlFor(source).width(1200).url()} />;
}
