"use client";

import { useEffect, useState } from "react";
import ScrollExpand from "@/components/ScrollExpand";
import { urlFor } from "@/lib/sanity/image";
import type { SiteSettings } from "@/types/sanity";

type HeroScrollExpandProps = Pick<SiteSettings, "heroHeadline" | "heroMedia">;

/**
 * Shown when the siteSettings singleton has no hero image. The page must never
 * fail over one unset field, so this is a committed file rather than a Sanity
 * lookup, and it is routed through the same aperture as a real image so the
 * fallback exercises the same code instead of being an untested branch nobody
 * sees until it matters.
 *
 * Currently a night skyline by Max Bender (unsplash.com/@maxwbender, photo
 * 8FdEwlxP3oU). It is dark, which is what makes it work here: the aperture
 * opens out of Ink into near-Ink rather than punching a bright hole in it.
 *
 * It is also Chicago, not Ahmedabad. Fine for a fallback nobody should reach,
 * wrong the moment it is the picture a visitor actually sees — set `heroMedia`
 * on the siteSettings singleton in Sanity and this stops rendering.
 */
const FALLBACK_IMAGE = "/hero-default.jpg";

/**
 * The landing moment. The page opens on nothing but Ink and the headline — no
 * picture, no nav, no page. Scrolling opens an aperture in the middle of that
 * black and the photograph comes through it, growing to full bleed as the
 * headline lifts away. Once it has, the nav appears and the homepage follows.
 *
 * The picture is hidden by a zero-area clip path, not by being absent: it is
 * still in the document and still fetched eagerly, so the largest element on
 * the screen is already decoded by the time the aperture opens.
 *
 * `data-nav-cloak` is the contract with Nav.tsx: while this element is on
 * screen the nav hides itself. Nav reveals as soon as the element scrolls past,
 * or immediately if someone reaches for the keyboard (see Nav for that part).
 */
export default function HeroScrollExpand({
  heroHeadline,
  heroMedia,
}: HeroScrollExpandProps) {
  // The aperture opens as you scroll, which is a large amount of movement for
  // anyone who asked for less of it. With reduced motion it starts fully open
  // and the page behaves like an ordinary hero: picture, headline over it.
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(motionQuery.matches);

    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
  }, []);

  const src = heroMedia
    ? urlFor(heroMedia).width(2560).height(1440).fit("crop").url()
    : FALLBACK_IMAGE;

  return (
    <div data-nav-cloak className="bg-ink">
      <ScrollExpand
        src={src}
        // Decorative: the h1 below carries the meaning, so describing the
        // picture here would just have it read out twice.
        alt=""
        useWindowScroll
        enabled={!reducedMotion}
        // Zero at rest. The clip path collapses to `inset(50% 50% 50% 50%)`,
        // so the frame has no area and the screen is nothing but the Ink on
        // the wrapper above. Everything from here is the reveal.
        startWidth={0}
        startHeight={0}
        // Carried over from the curved hero frame: the aperture opens as a
        // soft-cornered window and squares off only as it reaches full bleed.
        startRadius={44}
        endRadius={0}
        // The headline and the aperture both own the middle of the screen, so
        // this is a handoff, not a crossfade: the headline is clear before the
        // window has any real size. Widening this window past about 0.3 puts
        // half-opacity serif text across the photograph, which is unreadable
        // over anything the studio might upload and reads as a mistake.
        titleFade={[0.04, 0.26]}
        scrollHint={reducedMotion ? "" : "Scroll"}
        title={
          // Nothing shares this screen, so the headline is set at display
          // scale rather than tucked inside a frame — but the measure is set
          // in px, not ch, because the headline is a sentence rather than a
          // three word slogan. A ch measure keeps the line count constant as
          // the size grows, which put this one on five lines filling half the
          // screen; the black around it is doing as much work as the words.
          //
          // The shadow does nothing at rest on flat Ink. It earns its place
          // during the crossfade, when the text is briefly over whatever
          // photograph the studio uploaded.
          <h1 className="display-headline max-w-[820px] text-balance text-[clamp(30px,4.6vw,62px)] leading-[1.12] text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.5)]">
            {heroHeadline}
          </h1>
        }
      />
    </div>
  );
}
