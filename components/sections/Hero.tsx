"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, SplitText } from "@/lib/gsap";
import { urlFor } from "@/lib/sanity/image";
import type { SiteSettings } from "@/types/sanity";

type HeroProps = Pick<SiteSettings, "heroHeadline" | "heroMedia">;

/**
 * Shown when the siteSettings singleton has no hero image. The page must never
 * fail over one unset field, so this is a committed file rather than a Sanity
 * lookup. Deliberately routed through the same frame and notch as a real image,
 * so the fallback path exercises the same code instead of being an untested
 * branch nobody sees until it matters.
 */
const FALLBACK_IMAGE = "/hero-default.jpg";

/** Gap between the headline box and the cut edge of the notch. Spec 0001. */
const NOTCH_GUTTER = 32;

export default function Hero({ heroHeadline, heroMedia }: HeroProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // Hotspot needs both dimensions to crop against, so the source is requested at
  // a fixed 16:9. Next resizes from there for the actual srcset.
  const src = heroMedia
    ? urlFor(heroMedia).width(2560).height(1440).fit("crop").url()
    : FALLBACK_IMAGE;

  /**
   * Size the notch to the real headline.
   *
   * The CSS defaults already put the notch in roughly the right place, so this
   * only refines it, and nothing here gates the image's paint. It waits on
   * document.fonts.ready for the same reason the animation does: measuring the
   * headline in the fallback font would size the notch to text that is about to
   * reflow, and the cut would visibly land in the wrong place.
   */
  useEffect(() => {
    const frame = frameRef.current;
    // Measure the whole content block, headline AND call to action, not just the
    // headline. Sizing the notch to the headline alone leaves the button hanging
    // below the cut, on top of the photograph, where it is barely readable.
    const content = contentRef.current;
    if (!frame || !content) return;

    let observer: ResizeObserver | undefined;
    let cancelled = false;

    const measure = () => {
      const { width, height } = content.getBoundingClientRect();
      frame.style.setProperty("--notch-w", `${width + NOTCH_GUTTER * 2}px`);
      frame.style.setProperty("--notch-h", `${height + NOTCH_GUTTER * 2}px`);
    };

    document.fonts.ready.then(() => {
      if (cancelled) return;
      measure();
      observer = new ResizeObserver(measure);
      observer.observe(content);
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [heroHeadline]);

  useEffect(() => {
    // Some people get motion sickness from entrance animations. Skip the reveal
    // entirely rather than shortening it, and leave the text visible.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    let split: SplitText | undefined;
    let tl: gsap.core.Timeline | undefined;
    let cancelled = false;

    // Wait for the display font so SplitText measures final line breaks, not the fallback font's.
    document.fonts.ready.then(() => {
      if (cancelled || !headlineRef.current) return;

      split = new SplitText(headlineRef.current, { type: "lines" });

      tl = gsap.timeline();
      tl.from(split.lines, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      }).from(ctaRef.current, { opacity: 0, duration: 0.5 }, "-=0.2");
    });

    return () => {
      cancelled = true;
      tl?.kill();
      split?.revert();
    };
  }, []);

  return (
    // data-nav-overlay: marks this as a dark hero the nav may sit transparently
    // over, and gives Nav's ScrollTrigger a real element to measure. Nav.tsx
    // querySelectors this attribute; removing it breaks the homepage nav.
    // The top inset clears the nav rather than matching the other three sides.
    // The nav is fixed and transparent over this hero, so a 48px top inset put
    // its white links and CTA on top of the photograph, where contrast is
    // whatever the studio happens to upload. Starting the frame below the bar
    // keeps the nav on Ink, which is the contrast the locked nav rule assumes.
    // Spec 0001's Geometry table says 48px on all four sides and does not
    // account for the nav; it needs reconciling.
    <section
      data-nav-overlay
      className="relative flex h-screen flex-col bg-ink p-24 pt-[calc(var(--nav-h)+24px)] md:p-48 md:pt-[calc(var(--nav-h)+48px)]"
    >
      {/*
        Two placements, one element. Below md the headline sits above the image
        in normal flow, because there is no notch to sit in and text over a
        photograph at that width is not reliably readable. From md up it is
        lifted into the notch, offset by the frame inset plus the gutter.
      */}
      <div
        ref={contentRef}
        className="mb-24 shrink-0 md:absolute md:left-[80px] md:top-[calc(var(--nav-h)+80px)] md:z-10 md:mb-0 md:max-w-[54%]"
      >
        <h1 className="display-headline text-[34px] text-white md:text-[56px] lg:text-[72px]">
          <span ref={headlineRef} className="inline-block">
            {heroHeadline}
          </span>
        </h1>

        <Link
          ref={ctaRef}
          href="/projects"
          className="mt-32 inline-block rounded-none border border-white px-24 py-8 font-sans text-[13px] text-white transition-colors hover:bg-white hover:text-ink"
        >
          View our projects &rarr;
        </Link>
      </div>

      <div ref={frameRef} className="hero-frame min-h-[45vh] flex-1">
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

        {/* The notch. Hidden below md, where the headline sits above the image. */}
        <div className="hero-notch hidden md:block" aria-hidden="true" />
      </div>
    </section>
  );
}
