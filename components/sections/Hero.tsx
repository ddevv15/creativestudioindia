"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, SplitText } from "@/lib/gsap";
import type { SiteSettings } from "@/types/sanity";

type HeroProps = Pick<SiteSettings, "heroHeadline" | "heroMedia">;

export default function Hero({ heroHeadline, heroMedia }: HeroProps) {
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const isVideo = heroMedia.asset.mimeType.startsWith("video/");

  useEffect(() => {
    let split: SplitText | undefined;
    let tl: gsap.core.Timeline | undefined;
    let cancelled = false;

    // Wait for the display font so SplitText measures final line breaks, not the fallback font's.
    document.fonts.ready.then(() => {
      if (cancelled || !headlineRef.current) return;

      split = new SplitText(headlineRef.current, { type: "lines" });

      tl = gsap.timeline();
      tl.from(labelRef.current, { opacity: 0, duration: 0.6 })
        .from(split.lines, { y: 30, opacity: 0, duration: 0.8, stagger: 0.15 })
        .from([subRef.current, ctaRef.current], {
          opacity: 0,
          duration: 0.5,
          stagger: 0.2,
        });
    });

    return () => {
      cancelled = true;
      tl?.kill();
      split?.revert();
    };
  }, []);

  return (
    // data-nav-overlay: marks this as a dark hero the nav may sit transparently
    // over, and gives Nav's ScrollTrigger a real element to measure.
    <section
      data-nav-overlay
      className="relative flex h-screen items-center justify-center overflow-hidden bg-ink"
    >
      <div className="absolute inset-0">
        {isVideo ? (
          <video
            className="h-full w-full object-cover"
            src={heroMedia.asset.url}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : (
          <Image
            src={heroMedia.asset.url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/45" />
      </div>

      <div className="relative z-10 flex max-w-[840px] flex-col items-center px-24 text-center">
        <p ref={labelRef} className="section-label !text-white/70">
          01 / Architecture
        </p>

        <h1
          ref={headlineRef}
          className="display-headline mt-24 text-[34px] text-white md:text-[44px] lg:text-[64px]"
        >
          {heroHeadline}
        </h1>

        <p
          ref={subRef}
          className="mt-24 max-w-[440px] font-sans text-base text-white/65"
        >
          Architecture, 3D visualization &amp; documentation — Ahmedabad.
        </p>

        <Link
          ref={ctaRef}
          href="/projects"
          className="mt-32 rounded-none border border-white px-24 py-8 font-sans text-[13px] text-white transition-colors hover:bg-white hover:text-ink"
        >
          View our projects →
        </Link>
      </div>
    </section>
  );
}
