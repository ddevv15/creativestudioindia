"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity/image";
import { CATEGORY_LABELS } from "@/constants/categories";
import type { ProjectCardData } from "@/types/sanity";

type ProjectCardProps = Omit<ProjectCardData, "_id"> & {
  /** Set on the first above-the-fold card so it is not the unoptimised LCP. */
  priority?: boolean;
  /**
   * For cards that are below the fold but must be ready before anyone
   * reaches them — the homepage swipe row, where native lazy loading only
   * fires as each card is swiped into view and so shows empty frames.
   */
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
};

export default function ProjectCard({
  title,
  slug,
  category,
  coverImage,
  priority = false,
  loading,
  fetchPriority,
  sizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  // Each srcset width goes straight to Sanity's CDN, cropped to 3:2 and in
  // whatever format the browser accepts (AVIF/WebP). Without this, next/image
  // sent every card through Vercel's optimiser as well — two transforms, two
  // caches to miss, and on a phone the first visit paid for both.
  const sanityLoader = ({ width, quality }: { width: number; quality?: number }) =>
    urlFor(coverImage)
      .width(width)
      .height(Math.round((width * 2) / 3))
      .fit("crop")
      .auto("format")
      .quality(quality ?? 75)
      .url();

  return (
    <Link
      href={`/projects/${slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="project-card group block"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          loader={sanityLoader}
          src={sanityLoader({ width: 900 })}
          alt={title}
          fill
          priority={priority}
          loading={priority ? undefined : loading}
          fetchPriority={priority ? undefined : fetchPriority}
          sizes={sizes}
          className="object-cover transition-transform [transition-duration:400ms] [transition-timing-function:ease] md:group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/65" />

        <div className="absolute inset-x-0 bottom-0 p-16">
          <p className="relative inline-block font-sans text-[14px] font-medium text-white">
            {title}
            <motion.span
              aria-hidden="true"
              initial={{ width: "0%" }}
              animate={{ width: hovered ? "100%" : "0%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute bottom-0 left-0 border-b border-white"
            />
          </p>
          <p className="mt-4 font-sans text-[11px] text-white/60">
            {CATEGORY_LABELS[category]}
          </p>
        </div>
      </div>
    </Link>
  );
}
