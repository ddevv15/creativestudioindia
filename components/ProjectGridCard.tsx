"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SanityImage from "@/components/SanityImage";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/constants/categories";
import { cn } from "@/lib/utils";
import type { ProjectGridItem } from "@/types/sanity";

const PILL = "rounded-full border border-ink/25 px-8 py-[3px] text-[11px] uppercase tracking-[0.04em] text-ink";

/**
 * A cell in the /projects grid (after zha.com): image, title with an arrow
 * that turns from → to ↗ on hover, a short excerpt, and pill tags pinned to
 * the bottom. A glow follows the cursor inside the card on hover devices.
 * `large` cards span two columns and two rows, and their image stretches to fill.
 */
export default function ProjectGridCard({
  project,
  large = false,
  wideMd = false,
  wideLg = false,
  priority = false,
}: {
  project: ProjectGridItem;
  large?: boolean;
  /** Stretched across a row's leftover columns: laid out as a feature row,
   *  a 3:2 image beside its text, instead of one huge stretched frame. */
  wideMd?: boolean;
  wideLg?: boolean;
  priority?: boolean;
}) {
  const glowRef = useRef<HTMLSpanElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse" || !glowRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    glowRef.current.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
    glowRef.current.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
  };

  const meta = [project.location, project.year].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/projects/${project.slug}`}
      onPointerMove={onPointerMove}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden p-16",
        large && "lg:p-24",
        wideMd && "md:grid md:grid-cols-2 md:content-start md:gap-x-24",
        wideLg && "lg:grid lg:grid-cols-2 lg:content-start lg:gap-x-24 lg:p-24",
        wideMd && !wideLg && "lg:flex"
      )}
    >
      <span
        ref={glowRef}
        aria-hidden="true"
        className="card-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100"
      />

      <div
        className={cn(
          "relative overflow-hidden bg-linen",
          large ? "aspect-[3/2] lg:aspect-auto lg:min-h-[320px] lg:flex-1" : "aspect-[3/2]",
          wideMd && "md:row-span-4",
          wideLg && "lg:row-span-4"
        )}
      >
        <SanityImage
          source={project.coverImage}
          ratio={large ? undefined : 3 / 2}
          alt={project.title}
          fill
          priority={priority}
          sizes={large ? "(min-width: 1024px) 48vw, (min-width: 768px) 100vw, 100vw" : "(min-width: 1024px) 24vw, (min-width: 768px) 50vw, 100vw"}
          className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)]:group-hover:scale-[1.03]"
        />
      </div>

      <div className={cn("relative mt-16 flex items-start justify-between gap-16", wideMd && "md:mt-0", wideMd && !wideLg && "lg:mt-16", wideLg && "lg:mt-0")}>
        <h2 className={cn("leading-[1.25] text-ink", large ? "text-[20px] lg:text-[24px]" : "text-[16px]")}>
          {project.title}
        </h2>
        <ArrowRight
          aria-hidden="true"
          size={large ? 20 : 16}
          strokeWidth={1.5}
          className="mt-[3px] shrink-0 text-ink transition-transform duration-300 ease-out group-hover:-rotate-45"
        />
      </div>

      {project.headline && (
        <p className={cn("relative mt-8 text-[14px] leading-[1.45] text-stone", large ? "line-clamp-3 max-w-[56ch]" : "line-clamp-2")}>
          {project.headline}
        </p>
      )}

      <div className="relative mt-auto flex flex-wrap items-center gap-8 pt-24">
        <span className={PILL}>{CATEGORY_LABELS[project.category]}</span>
        {project.status && <span className={PILL}>{STATUS_LABELS[project.status]}</span>}
        {meta && <span className="caption-mono ml-auto">{meta}</span>}
      </div>
    </Link>
  );
}
