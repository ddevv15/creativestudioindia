"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { urlFor } from "@/lib/sanity/image";
import type { SiteSettings } from "@/types/sanity";

type HeroProps = Pick<SiteSettings, "heroHeadline" | "heroMedia">;

/**
 * Shown when the siteSettings singleton has no hero image. The page must never
 * fail over one unset field, so this is a committed file rather than a Sanity
 * lookup. Deliberately routed through the same frame and carve as a real image,
 * so the fallback path exercises the same code instead of being an untested
 * branch nobody sees until it matters.
 */
const FALLBACK_IMAGE = "/hero-default.jpg";

export default function Hero({ heroHeadline, heroMedia }: HeroProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Hotspot needs both dimensions to crop against, so the source is requested at
  // a fixed 16:9. Next resizes from there for the actual srcset.
  const src = heroMedia
    ? urlFor(heroMedia).width(2560).height(1440).fit("crop").url()
    : FALLBACK_IMAGE;

  useEffect(() => {
    // Some people get motion sickness from entrance animations. Skip the reveal
    // entirely rather than shortening it, and leave the text visible.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    let tl: gsap.core.Timeline | undefined;
    let cancelled = false;

    // Still waits on the display font. The carve is drawn by the text's own line
    // boxes, so animating before Cormorant loads would reveal a shape sized to
    // the fallback font and then reflow it.
    document.fonts.ready.then(() => {
      if (cancelled || !contentRef.current) return;
      tl = gsap.timeline();
      tl.from(contentRef.current, { y: 24, opacity: 0, duration: 0.9 });
    });

    return () => {
      cancelled = true;
      tl?.kill();
    };
  }, []);

  return (
    // data-nav-overlay: marks this as a dark hero the nav may sit transparently
    // over, and gives Nav's ScrollTrigger a real element to measure. Nav.tsx
    // querySelectors this attribute; removing it breaks the homepage nav.
    <section
      data-nav-overlay
      // Mobile needs the nav's height as top padding because the headline sits
      // in normal flow there, directly under the bar. From md up the headline is
      // lifted onto the picture and the image runs full height behind the nav,
      // kept readable by the scrim instead.
      // The top inset clears the nav at every width. On desktop that also makes
      // the frame's top edge line up exactly with the top of the carve, so the
      // void reads as cut out of the picture's corner rather than as a slab
      // floating over it with a sliver of image above.
      className="relative flex h-screen flex-col bg-ink p-24 pt-[calc(var(--nav-h)+24px)] md:p-48 md:pt-[calc(var(--nav-h)+16px)]"
    >
      {/*
        Two placements, one element. Below md the headline sits above the image
        in normal flow, because there is no room to carve into it and text over
        a photograph at that width is not reliably readable. From md up it is
        lifted over the picture, where its own line boxes carve the dark shape.

        This element carries the ref, the CSS variables, AND the z-index on
        purpose. GSAP leaves an identity transform behind after a tween, and any
        transform other than `none` creates a stacking context. With the ref on a
        separate static wrapper, that context trapped this z-index inside it and
        the whole headline painted underneath the image, which is positioned.
      */}
      <div
        ref={contentRef}
        className="hero-carve-wrap mb-24 shrink-0 md:absolute md:left-48 md:top-[calc(var(--nav-h)+16px)] md:z-20 md:mb-0 md:max-w-[64%]"
      >
        <h1 className="display-headline text-[34px] text-white md:text-[56px] lg:text-[72px]">
          <span className="hero-carve">{heroHeadline}</span>
        </h1>

        <span className="hero-carve-cta inline-block">
          <Link
            href="/projects"
            className="inline-block rounded-none border border-white px-24 py-8 font-sans text-[13px] text-white transition-colors hover:bg-white hover:text-ink"
          >
            View our projects &rarr;
          </Link>
        </span>
      </div>

      <div className="hero-frame min-h-[45vh] flex-1">
        <Image
          src={src}
          // Decorative: the h1 above carries the meaning, so a description here
          // would just be read out twice.
          alt=""
          fill
          priority
          sizes="(min-width: 768px) calc(100vw - 96px), calc(100vw - 48px)"
          className="object-cover"
          {...(heroMedia?.lqip
            ? { placeholder: "blur" as const, blurDataURL: heroMedia.lqip }
            : {})}
        />

      </div>
    </section>
  );
}
