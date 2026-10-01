"use client";

import { useEffect, useRef, useState } from "react";
import localFont from "next/font/local";
import { gsap } from "@/lib/gsap";
import ScrollExpand from "@/components/ScrollExpand";
import MoltenMetal from "@/components/MoltenMetal";
import { urlFor } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";
import type { HeroImage, SiteSettings } from "@/types/sanity";

// The landing wordmark's face, and only that: loaded here rather than in the
// root layout so no other page downloads it or picks it up. Barriecito by
// Omnibus-Type, SIL Open Font License (OFL.txt alongside), self-hosted from
// public/fonts/barriecito.
const barriecito = localFont({
  src: "../../public/fonts/barriecito/Barriecito-Regular.ttf",
  weight: "400",
  display: "swap",
});

type HeroScrollExpandProps = Pick<SiteSettings, "heroMedia" | "heroImages">;

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
  heroMedia,
  heroImages,
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

  // The exit. The hero opened out of Ink, so it closes back into it: once the
  // photograph has held at full bleed for a moment, it dims to black as it
  // scrolls away, and the projects carousel arrives on that same black. This is
  // GSAP on the wrapper only — the aperture inside stays on ScrollExpand's own
  // rAF loop, so the two never touch the same element.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(fadeRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          // The track ends 1.35 viewports after full bleed is reached
          // (scrollDistance 1.2 of 2.55), so "bottom 115%" leaves ~0.2 of a
          // viewport of full-bleed hold before the dim starts.
          start: "bottom 115%",
          end: "bottom 40%",
          scrub: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  // The shuffle. Every visit shows one picture from heroMedia plus heroImages.
  // The server always renders the first — the page is cached until Sanity
  // revalidates it, so a server-side pick would freeze one "random" image for
  // everyone. The client re-picks right after hydration instead, and that is
  // invisible here because the aperture starts at zero area: nobody can see
  // which picture is behind it until they scroll.
  //
  // So the swap only happens when the aperture is still shut — at the top of
  // the page with the effect on. A reload that restores scroll mid-hero, or a
  // reduced-motion visitor whose hero starts fully open, keeps the first
  // picture rather than watching it change under them.
  const pool = [heroMedia, ...(heroImages ?? [])].filter(
    (image): image is HeroImage => Boolean(image?.asset),
  );
  const [picked, setPicked] = useState(0);

  useEffect(() => {
    if (pool.length < 2) return;
    if (window.scrollY > 4) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPicked(Math.floor(Math.random() * pool.length));
    // Once per mount: re-rolling on a prop change would swap a visible image.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const image = pool[picked] ?? pool[0];
  const src = image
    ? urlFor(image).width(2560).height(1440).fit("crop").url()
    : FALLBACK_IMAGE;

  return (
    <div ref={wrapperRef} data-nav-cloak className="bg-ink">
      <div ref={fadeRef}>
      <ScrollExpand
        src={src}
        // Decorative: the wordmark h1 carries the meaning, so describing the
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
        // No hint: the wordmark fills the screen edge to edge, so anything
        // pinned near the bottom would sit on top of "India".
        scrollHint=""
        title={
          <>
            {/*
              Molten metal behind the wordmark, in Ink to white so it reads as
              part of the black-and-white landing rather than a colour accent.
              It lives in the title layer on purpose: it fades and lifts away
              with the words, so it is gone before the aperture has any size
              and never sits over the photograph. Absolute inset-0 reaches past
              the title layer's side padding, so it is full bleed.

              Skipped for reduced motion — that hero starts fully open with the
              words over the photograph, where this would hide the picture.
              Mouse drift is off: the title layer is pointer-events-none, and
              a background that chases the cursor fights the type for focus.
            */}
            {!reducedMotion && (
              <div aria-hidden className="absolute inset-0">
                <MoltenMetal
                  color1="#1A1A17"
                  color2="#5F5E5A"
                  color3="#FFFFFF"
                  glow={2.4}
                  brightness={2}
                  blackPoint={0.02}
                  opacity={0.8}
                  mouseInteraction={false}
                />
              </div>
            )}
            <HeroWordmark />
          </>
        }
      />
      </div>
    </div>
  );
}

const WORDS = ["Creative", "Studio", "India"];

/**
 * The studio's name as the whole landing screen: three rows, each a third of
 * the viewport, every word running from the left margin to the right.
 *
 * Two steps per word. First it is scaled as large as its row allows — whichever
 * runs out first, the row's width or its height. Then the letters are spread
 * across the full width (each letter is its own flex item, justify-between),
 * so a word that hit the height limit first still spans margin to margin, with
 * the leftover width going into the spacing between letters.
 *
 * Sized by measuring rather than by a vw guess so it holds if the face
 * changes: every typeface has different letter widths, and a hardcoded ratio
 * tuned for one would overflow or fall short in anything else.
 *
 * The shadow does nothing at rest on flat Ink. It earns its place during the
 * crossfade, when the letters are briefly over the photograph.
 */
function HeroWordmark() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = ref.current;
    if (!heading) return;

    const fit = () => {
      const rowWidth = heading.clientWidth;
      const rowHeight = heading.clientHeight / WORDS.length;
      heading.querySelectorAll<HTMLElement>("[data-word]").forEach((word) => {
        // Measure the word at its natural width and a known size…
        word.style.width = "max-content";
        word.style.fontSize = "100px";
        const scale = Math.min(
          rowWidth / word.offsetWidth,
          (rowHeight * 0.92) / word.offsetHeight,
        );
        // …then set the size and hand the width back to the row, which
        // spreads the letters out to both margins.
        word.style.fontSize = `${100 * scale}px`;
        word.style.width = "";
      });
    };

    fit();
    // Refit once the webfont lands — the first measure may be the fallback.
    document.fonts.ready.then(fit);
    const observer = new ResizeObserver(fit);
    observer.observe(heading);
    return () => observer.disconnect();
  }, []);

  return (
    <h1
      ref={ref}
      aria-label="Creative Studio India"
      className={cn(
        barriecito.className,
        "relative grid h-full w-full grid-rows-3 items-center uppercase leading-[0.8] text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.5)]",
      )}
    >
      {WORDS.map((word) => (
        // The text-[...] size is only the pre-hydration guess; fit() replaces it.
        <span
          key={word}
          data-word
          aria-hidden
          className="flex w-full justify-between whitespace-nowrap text-[min(16vw,26dvh)]"
        >
          {[...word].map((letter, i) => (
            <span key={i}>{letter}</span>
          ))}
        </span>
      ))}
    </h1>
  );
}
