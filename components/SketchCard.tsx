"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";
import type { Sketch } from "@/types/sanity";

type SketchCardProps = {
  sketch: Sketch;
  onImageClick: (src: string, title: string) => void;
};

export default function SketchCard({ sketch, onImageClick }: SketchCardProps) {
  const src = urlFor(sketch.image).width(900).url();

  return (
    <div className="border-[0.5px] border-stone/15">
      <button
        type="button"
        onClick={() => onImageClick(src, sketch.title)}
        className="block w-full cursor-zoom-in"
        aria-label={`View ${sketch.title} full size`}
      >
        {/* object-contain, never object-cover — sketches must not be cropped. */}
        <Image
          src={src}
          alt={sketch.title}
          width={560}
          height={420}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="h-auto w-full object-contain"
        />
      </button>

      <div className="px-16 pb-16 pt-8">
        <p className="font-sans text-[13px] text-stone">
          {sketch.title}
          {sketch.year ? ` — ${sketch.year}` : ""}
        </p>

        {sketch.relatedProject && (
          // `text-red` only — the red token is a flat string, so text-red-500
          // does not exist in this project.
          <Link
            href={`/projects/${sketch.relatedProject.slug}`}
            className="mt-8 inline-block font-sans text-[12px] text-red underline-offset-4 hover:underline"
          >
            See the built project →
          </Link>
        )}
      </div>
    </div>
  );
}
