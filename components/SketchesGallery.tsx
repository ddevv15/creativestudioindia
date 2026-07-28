"use client";

import { useState } from "react";
import Lightbox from "@/components/Lightbox";
import SketchCard from "@/components/SketchCard";
import type { Sketch } from "@/types/sanity";

type SketchesGalleryProps = {
  sketches: Sketch[];
};

type ActiveSketch = { src: string; title: string };

export default function SketchesGallery({ sketches }: SketchesGalleryProps) {
  const [active, setActive] = useState<ActiveSketch | null>(null);

  return (
    <section className="bg-offwhite px-24 py-96 md:px-48">
      {/* CSS columns masonry — 3 / 2 / 1 with a 12px gutter per spec 20. */}
      <div className="columns-1 [column-gap:12px] md:columns-2 lg:columns-3">
        {sketches.map((sketch) => (
          <div
            key={sketch._id}
            className="mb-[12px] break-inside-avoid-column"
          >
            <SketchCard
              sketch={sketch}
              onImageClick={(src, title) => setActive({ src, title })}
            />
          </div>
        ))}
      </div>

      <Lightbox
        open={active !== null}
        onOpenChange={(open) => !open && setActive(null)}
        src={active?.src ?? null}
        alt={active?.title ?? ""}
      />
    </section>
  );
}
