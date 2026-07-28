"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";
import { urlFor } from "@/lib/sanity/image";
import type { GalleryImage } from "@/types/sanity";

type ProjectGalleryProps = {
  gallery: GalleryImage[];
  title: string;
};

type ActiveImage = { src: string; caption?: string };

export default function ProjectGallery({
  gallery,
  title,
}: ProjectGalleryProps) {
  const [active, setActive] = useState<ActiveImage | null>(null);

  if (!gallery.length) return null;

  const [lead, ...rest] = gallery;

  // Only .width/.height/.fit/.url exist on the demo image builder shim.
  // Adding .auto() or .quality() here compiles but returns undefined at runtime.
  const leadSrc = urlFor(lead).width(1920).height(1080).fit("crop").url();

  return (
    <section className="bg-offwhite">
      <button
        type="button"
        onClick={() => setActive({ src: leadSrc, caption: lead.caption })}
        className="group relative block aspect-[16/9] w-full overflow-hidden"
      >
        <Image
          src={leadSrc}
          alt={lead.caption ?? title}
          fill
          sizes="100vw"
          priority
          className="object-cover transition-transform [transition-duration:400ms] [transition-timing-function:ease] md:group-hover:scale-[1.04]"
        />
      </button>

      {rest.length > 0 && (
        <div className="mt-24 grid grid-cols-1 gap-24 px-24 md:grid-cols-2 md:px-48">
          {rest.map((image) => {
            const src = urlFor(image).width(1200).height(900).fit("crop").url();

            return (
              <button
                key={image._key}
                type="button"
                onClick={() => setActive({ src, caption: image.caption })}
                className="group relative block aspect-[4/3] w-full overflow-hidden"
              >
                <Image
                  src={src}
                  alt={image.caption ?? title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform [transition-duration:400ms] [transition-timing-function:ease] md:group-hover:scale-[1.04]"
                />
              </button>
            );
          })}
        </div>
      )}

      <Lightbox
        open={active !== null}
        onOpenChange={(open) => !open && setActive(null)}
        src={active?.src ?? null}
        alt={active?.caption ?? title}
        caption={active?.caption}
      />
    </section>
  );
}
