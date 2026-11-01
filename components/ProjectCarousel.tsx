"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import SanityImage from "@/components/SanityImage";
import { useSwipe } from "@/lib/useSwipe";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types/sanity";

const GAP = 10;
const SLIDE_TRANSITION = "transform 900ms cubic-bezier(0.77, 0, 0.175, 1)";

/** Resistance past the first or last slide: the further you pull, the less it follows. */
function rubberband(dx: number, dimension = 400, constant = 0.55) {
  const distance = Math.abs(dx);
  return (Math.sign(dx) * (distance * dimension * constant)) / (dimension + constant * distance);
}

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Project gallery carousel (spec 0002, project page). Slides are as wide as
 * the content column, so the neighbours peek in from the gutters. The caption,
 * a 01/05 counter and PREV / NEXT sit underneath. It doesn't loop, and dragging
 * past either end rubber-bands rather than stopping dead.
 */
export default function ProjectCarousel({ images, title }: { images: GalleryImage[]; title: string }) {
  const reduce = useReducedMotion();
  const count = images.length;
  const [active, setActive] = useState(0);

  const go = (direction: 1 | -1) =>
    setActive((value) => Math.min(count - 1, Math.max(0, value + direction)));

  const { dragX, dragging, handlers } = useSwipe({
    enabled: count > 1,
    mouse: true,
    onSwipe: go,
    resist: (dx) =>
      (active === 0 && dx > 0) || (active === count - 1 && dx < 0) ? rubberband(dx) : dx,
  });

  if (count === 0) return null;
  const caption = images[active].caption;

  return (
    <section
      id="gallery"
      data-reveal
      aria-roledescription="carousel"
      aria-label={`${title} gallery`}
      className="scroll-mt-nav overflow-hidden py-64 lg:py-96"
    >
      <div
        {...handlers}
        className={cn(
          "touch-pan-y select-none px-gutter",
          count > 1 && (dragging ? "cursor-grabbing" : "cursor-grab")
        )}
      >
        <div
          className="flex"
          style={{
            gap: GAP,
            transform: `translateX(calc(${-active} * (100% + ${GAP}px) + ${dragX}px))`,
            transition: dragging || reduce ? "none" : SLIDE_TRANSITION,
          }}
        >
          {images.map((image, index) => (
            <div
              key={image._key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
              aria-hidden={index !== active}
              // A peeking neighbour is a shortcut to itself.
              onClick={() => index !== active && setActive(index)}
              className="relative aspect-[3/2] w-full shrink-0 overflow-hidden bg-linen md:aspect-[16/9]"
            >
              <SanityImage
                source={image}
                ratio={16 / 9}
                alt={image.caption ?? `${title}, image ${index + 1}`}
                fill
                sizes="100vw"
                draggable={false}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/*
        Counter and controls start at the column halfway across and read left
        to right. The reference pins NEXT to the right gutter, but there it sat
        under the fixed WhatsApp button, which AGENTS.md keeps always visible.
      */}
      <div className="mt-16 grid grid-cols-12 items-start gap-x-[10px] px-gutter">
        <p className="caption-mono col-span-12 min-h-[1.3em] md:col-span-6">{caption}</p>

        {count > 1 && (
          <div className="col-span-12 mt-8 flex items-center gap-32 font-mono text-[12px] md:col-span-6 md:mt-0">
            <span aria-live="polite" className="text-stone">
              {pad(active + 1)}/{pad(count)}
            </span>
            <div className="flex gap-16 font-sans text-[13px] uppercase">
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={active === 0}
                className="min-h-[44px] transition-[opacity,transform] duration-150 ease-out active:scale-[0.97] disabled:opacity-30"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={active === count - 1}
                className="min-h-[44px] transition-[opacity,transform] duration-150 ease-out active:scale-[0.97] disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
