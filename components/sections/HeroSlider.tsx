"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSwipe } from "@/lib/useSwipe";
import ImageScrim from "@/components/ImageScrim";
import SanityImage from "@/components/SanityImage";
import type { FeatureImage } from "@/types";

const AUTOPLAY_MS = 6000;
// Where each slide's photo drifts while it zooms, cycling per slide so
// neighbours never move the same way. Paired with the `ken-burns` keyframes in
// tailwind.config.ts, which keep the drift inside the zoom's spare margin.
const DRIFTS: [string, string][] = [
  ["-2%", "-1.5%"],
  ["2%", "-1%"],
  ["-1.5%", "1.5%"],
  ["1.5%", "1%"],
];
// On-screen movement gets the strong ease-in-out (both ends visible).
const SLIDE_TRANSITION = "transform 900ms cubic-bezier(0.77, 0, 0.175, 1)";
/** Signed distance from the active slide, wrapped so the loop is seamless. */
function offsetOf(index: number, active: number, count: number) {
  let offset = (index - active + count) % count;
  if (offset > count / 2) offset -= count;
  return offset;
}

/**
 * Full-bleed homepage hero (spec 0002). Featured projects slide past on a
 * loop, each photo slowly zooming and drifting while it's shown. Bottom-left: location and title. Bottom-right: PREV, a progress
 * segment per slide, NEXT. Touch drag tracks 1:1 and a flick commits by
 * projected momentum, not by distance alone.
 */
export default function HeroSlider({ slides }: { slides: FeatureImage[] }) {
  const reduce = useReducedMotion();
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // The slide that just left keeps zooming while it slides out; dropping its
  // animation the moment it stops being active would snap it back to full
  // size on screen. Derived during render (not in an effect) so there's no
  // frame where the leaving slide has already lost its zoom.
  const [zoomed, setZoomed] = useState({ active: 0, leaving: -1 });
  if (zoomed.active !== active) setZoomed({ active, leaving: zoomed.active });

  // A slide wrapping from one side to the other must jump, not glide across
  // the screen. Remember where each one was to spot those jumps.
  const previousOffsets = useRef<number[]>([]);
  const offsets = slides.map((_, index) => offsetOf(index, active, count));
  const jumps = offsets.map(
    (offset, index) =>
      previousOffsets.current[index] !== undefined &&
      Math.abs(offset - previousOffsets.current[index]) > 1
  );
  useEffect(() => {
    previousOffsets.current = offsets;
  });

  // Which slides have an image mounted. Only the first renders on the server.
  // After that, the active slide and its two neighbours load, so the next
  // frame is always ready but five full-width photographs don't compete with
  // the first one. Once mounted, a slide's image stays mounted.
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));
  useEffect(() => {
    setMounted((previous) => {
      const near = [active, (active + 1) % count, (active - 1 + count) % count];
      if (near.every((index) => previous.has(index))) return previous;
      return new Set([...previous, ...near]);
    });
  }, [active, count]);

  const go = (direction: 1 | -1) => setActive((value) => (value + direction + count) % count);
  const { dragX, dragging, handlers } = useSwipe({ enabled: count > 1, onSwipe: go });

  useEffect(() => {
    if (count < 2 || paused || dragging || reduce) return;
    // Re-armed on every `active` change, which restarts the clock.
    const timer = window.setTimeout(
      () => setActive((value) => (value + 1) % count),
      AUTOPLAY_MS
    );
    return () => window.clearTimeout(timer);
  }, [active, paused, dragging, reduce, count]);

  if (count === 0) return null;
  const current = slides[active];

  return (
    <section
      data-nav-overlay
      aria-roledescription="carousel"
      aria-label="Featured projects"
      {...handlers}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative h-[90svh] min-h-[560px] touch-pan-y select-none overflow-hidden bg-charcoal text-offwhite"
    >
      {slides.map((slide, index) => {
        const offset = offsets[index];
        const visible = offset === 0;
        return (
          <div
            key={`${slide.title}-${index}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
            aria-hidden={!visible}
            className="absolute inset-0"
            style={
              reduce
                ? { opacity: visible ? 1 : 0, transition: "opacity 400ms ease" }
                : {
                    transform: `translateX(calc(${offset * 100}% + ${dragX}px))`,
                    transition: dragging || jumps[index] ? "none" : SLIDE_TRANSITION,
                    visibility: Math.abs(offset) > 1 ? "hidden" : "visible",
                  }
            }
          >
            {mounted.has(index) && (
              // Slow zoom and drift. Restarts each time the slide comes back,
              // because the class is only present while it's active or leaving.
              <div
                className={cn(
                  "absolute inset-0",
                  !reduce &&
                    (index === active || index === zoomed.leaving) &&
                    "animate-ken-burns will-change-transform"
                )}
                style={{ "--kb-x": DRIFTS[index % DRIFTS.length][0], "--kb-y": DRIFTS[index % DRIFTS.length][1] } as React.CSSProperties}
              >
                <SanityImage
                  source={slide.image}
                  alt={slide.title}
                  fill
                  sizes="100vw"
                  quality={70}
                  priority={index === 0}
                  loading={index === 0 ? undefined : "eager"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  draggable={false}
                  className="object-cover"
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Legibility for the caption and controls. */}
      <ImageScrim edge="title" />
      <ImageScrim edge="header" />

      <div className="absolute inset-x-gutter bottom-24 flex flex-col gap-24 md:bottom-32 md:flex-row md:items-end md:justify-between">
        {/* Keyed so each new caption fades in rather than swapping hard. */}
        <div key={active} aria-live={paused ? "polite" : "off"} className="duration-500 animate-in fade-in">
          {current.location && (
            <p className="font-mono text-[12px] leading-[1.3] text-offwhite/85">{current.location}</p>
          )}
          {current.href ? (
            <Link href={current.href} className="mt-4 block text-[20px] uppercase leading-[1.25] md:text-[24px]">
              {current.title}
            </Link>
          ) : (
            <p className="mt-4 text-[20px] uppercase leading-[1.25] md:text-[24px]">{current.title}</p>
          )}
        </div>

        {count > 1 && (
          <div className="flex items-center gap-16 text-[13px] uppercase">
            <button
              type="button"
              onClick={() => go(-1)}
              className="hit-area min-h-[44px] transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              Prev
            </button>

            <div className="flex items-center gap-[6px]">
              {slides.map((slide, index) => (
                <button
                  key={`${slide.title}-progress-${index}`}
                  type="button"
                  aria-label={`Show ${slide.title}`}
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => setActive(index)}
                  className="py-[21px]"
                >
                  <span className="relative block h-[2px] w-[36px] overflow-hidden bg-offwhite/35 md:w-[44px]">
                    {index < active && <span className="absolute inset-0 bg-offwhite" />}
                    {index === active && (
                      <span
                        key={active}
                        className={cn(
                          "absolute inset-0 origin-left bg-offwhite",
                          !reduce && "animate-slide-progress",
                          (paused || dragging) && "[animation-play-state:paused]"
                        )}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              className="hit-area min-h-[44px] transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
