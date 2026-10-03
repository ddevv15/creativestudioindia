"use client";

import { useEffect, useRef, useState } from "react";
import localFont from "next/font/local";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import ScrollExpand from "@/components/ScrollExpand";
import MoltenMetal from "@/components/MoltenMetal";
import StrokeText from "@/components/StrokeText";
import { urlFor } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";
import type { HeroImage } from "@/types/sanity";

// The wordmark's face, and only that: loaded here rather than in the root
// layout so only the pages that open on this hero download it. Barriecito by
// Omnibus-Type, SIL Open Font License (OFL.txt alongside), self-hosted from
// public/fonts/barriecito.
const barriecito = localFont({
  src: "../../public/fonts/barriecito/Barriecito-Regular.ttf",
  weight: "400",
  display: "swap",
});

type HeroScrollExpandProps = {
  /** Three words, one per third of the screen. */
  words: string[];
  /**
   * The heading's accessible name — the visible rows are a display cut, so
   * screen readers get the phrase as one piece.
   */
  label: string;
  /** The pool one picture is shuffled from per visit. Unset entries are skipped. */
  images: (HeroImage | undefined)[];
  /**
   * Write the picture's project name over it once it is full bleed. Only for
   * a pool whose images carry `projectTitle` (the homepage's).
   */
  showProjectName?: boolean;
};

/**
 * Shown when a page passes no usable image. The page must never
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
 * wrong the moment it is the picture a visitor actually sees — give the page
 * an image in Sanity and this stops rendering.
 */
const FALLBACK_IMAGE = "/hero-default.jpg";

/**
 * The homepage's landing moment. The page opens
 * on nothing but Ink and a three-word wordmark — no picture, no nav, no page.
 * Scrolling opens an aperture in the middle of that black and the photograph
 * comes through it, growing to full bleed as the words lift away. Once it
 * has, the nav appears and the rest of the page follows.
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
  words,
  label,
  images,
  showProjectName = false,
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
  // scrolls away, and the next section arrives after that black. This is
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

  // The caption. Once the photograph has (nearly) reached full bleed, the
  // name of the project it shows writes itself in at the foot of the frame;
  // scrolling back up into the aperture takes it away again, so it redraws
  // the next time. Full bleed lands 1.2 viewports into the track
  // (scrollDistance), so 1.05 starts the writing as the last of the
  // expansion settles, while ScrollExpand is fading its overlay in.
  const [named, setNamed] = useState(false);

  // The caption's size. StrokeText draws at a fixed px size (the SVG's height
  // is fontSize × 1.3), so the responsive step is chosen here: 48px on
  // phones, rising with the viewport to 80px. Still well under the wordmark:
  // it labels the photograph, it does not compete with it.
  const [captionSize, setCaptionSize] = useState(48);

  useEffect(() => {
    if (!showProjectName) return;
    const sync = () =>
      setCaptionSize(Math.round(Math.min(80, Math.max(48, window.innerWidth * 0.055))));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [showProjectName]);

  useEffect(() => {
    if (!showProjectName) return;
    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: () => `top+=${window.innerHeight * 1.05} top`,
      invalidateOnRefresh: true,
      onEnter: () => setNamed(true),
      onLeaveBack: () => setNamed(false),
    });
    return () => trigger.kill();
  }, [showProjectName]);

  // The shuffle. Every visit shows one picture from `images`.
  // The page is cached until Sanity revalidates it, so a server-side pick
  // would freeze one "random" image for everyone; the client picks right
  // after hydration instead. Until it has, no picture is requested at all:
  // the server used to render the first one, which the browser downloaded
  // and then threw away whenever the shuffle landed elsewhere — a wasted
  // 300–500KB on every phone visit. Nothing is lost by waiting, because the
  // aperture starts at zero area and nobody sees the picture until they
  // scroll. With fewer than two pictures there is nothing to pick, so the
  // server renders that one directly.
  //
  // So the swap only happens when the aperture is still shut — at the top of
  // the page with the effect on. A reload that restores scroll mid-hero, or a
  // reduced-motion visitor whose hero starts fully open, keeps the first
  // picture rather than watching it change under them.
  const pool = images.filter(
    (image): image is HeroImage => Boolean(image?.asset),
  );
  const [picked, setPicked] = useState<number | null>(
    pool.length < 2 ? 0 : null,
  );

  useEffect(() => {
    if (pool.length < 2) return;
    const shuffle =
      window.scrollY <= 4 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPicked(shuffle ? Math.floor(Math.random() * pool.length) : 0);
    // Once per mount: re-rolling on a prop change would swap a visible image.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const image = picked === null ? undefined : pool[picked];
  const awaitingPick = picked === null;
  // Not with reduced motion: that hero starts fully open with the wordmark
  // over the photograph, and a second line of display type would sit on it.
  const projectName =
    showProjectName && !reducedMotion ? image?.projectTitle : undefined;

  // Sized to the screen, in AVIF/WebP. Before this every device got one
  // 2560px JPEG (~650KB) — and a portrait phone then cropped that wide frame
  // down to a narrow slice and stretched it to the screen's full height.
  // Landscape screens get 16:9 crops; portrait screens get 9:16 crops, so
  // the picture is composed for the screen it is on (Sanity crops around
  // the image's hotspot if one is set).
  const candidates = (widths: number[], ratio: number) =>
    image
      ? widths
          .map(
            (w) =>
              `${urlFor(image)
                .width(w)
                .height(Math.round(w * ratio))
                .fit("crop")
                .auto("format")
                .quality(75)
                .url()} ${w}w`,
          )
          .join(", ")
      : undefined;

  const src = awaitingPick
    ? undefined
    : image
    ? urlFor(image).width(1920).height(1080).fit("crop").auto("format").quality(75).url()
    : FALLBACK_IMAGE;
  const srcSet = candidates([1280, 1920, 2560], 9 / 16);
  // Capped at 1080: a 3x phone asks for ~1170px and, offered nothing that
  // large, takes 1080 — near full sharpness for roughly half the bytes of
  // the 1440 it would otherwise pick.
  const portraitSrcSet = candidates([750, 1080], 16 / 9);

  return (
    <div ref={wrapperRef} data-nav-cloak className="bg-ink">
      <div ref={fadeRef}>
      <ScrollExpand
        src={src}
        srcSet={srcSet}
        portraitSrcSet={portraitSrcSet}
        sizes="100vw"
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
        // pinned near the bottom would sit on top of the last word.
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
            <HeroWordmark words={words} label={label} />
          </>
        }
      >
        {projectName ? (
          // ScrollExpand's overlay slot: it fades in over the last third of
          // the expansion, rising as the page does, and sinks back the same
          // way on the way up. Keyed on the name so each appearance mounts a
          // fresh StrokeText and draws from nothing. aria-hidden: a caption on
          // a decorative picture.
          //
          // Placement: bottom-left, on the page gutter — the same left edge
          // as the nav logo (24px, 48px from md), so when the nav returns
          // the two read as one column rather than two things floating. The
          // bottom is where the frame's scrim is darkest, and left-aligned
          // text draws from the margin in reading order rather than from an
          // arbitrary point mid-screen. The bottom inset clears a phone's
          // home indicator. Long names scale down to fit the width.
          <div
            aria-hidden
            className="absolute bottom-[max(40px,calc(env(safe-area-inset-bottom)+24px))] left-24 right-24 text-left md:bottom-48 md:left-48 md:right-48 [filter:drop-shadow(0_2px_18px_rgba(0,0,0,0.55))]"
          >
            {named ? (
              <StrokeText
                key={projectName}
                text={projectName}
                // Lining figures: Cormorant's default old-style "1" is a short
                // stroke that reads as a lowercase "i" in "TIMES SQUARE 1".
                className="font-display [font-variant-numeric:lining-nums]"
                align="start"
                fontSize={captionSize}
                fontWeight={500}
                // Display sizes want slightly negative tracking (~-0.01em).
                letterSpacing={-captionSize * 0.01}
                strokeColor="rgba(255,255,255,0.8)"
                strokeWidth={1}
                fillColor="#FFFFFF"
                drawDuration={1.2}
                stagger={0.04}
              />
            ) : null}
          </div>
        ) : null}
      </ScrollExpand>
      </div>
    </div>
  );
}

/**
 * The wordmark as the whole landing screen: three rows, each a third of the
 * viewport, every word running from the left margin to the right.
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
 * A space inside a word ("35 years") is kept as a narrow fixed gap; the
 * letter spreading then widens it like every other gap, so the two parts
 * still read as separate words.
 *
 * The shadow does nothing at rest on flat Ink. It earns its place during the
 * crossfade, when the letters are briefly over the photograph.
 */
function HeroWordmark({
  words,
  label,
}: {
  words: string[];
  label: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = ref.current;
    if (!heading) return;

    const fit = () => {
      const rowWidth = heading.clientWidth;
      const rowHeight = heading.clientHeight / words.length;
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
    // Keyed on the text, not the array: a fresh array with the same words
    // must not tear down and refit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words.join("|")]);

  return (
    <h1
      ref={ref}
      aria-label={label}
      className={cn(
        barriecito.className,
        "relative grid h-full w-full grid-rows-3 items-center uppercase leading-[0.8] text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.5)]",
      )}
    >
      {words.map((word) => (
        // The text-[...] size is only the pre-hydration guess; fit() replaces it.
        <span
          key={word}
          data-word
          aria-hidden
          className="flex w-full justify-between whitespace-nowrap text-[min(16vw,26dvh)]"
        >
          {[...word].map((letter, i) =>
            letter === " " ? (
              <span key={i} className="w-[0.3em]" />
            ) : (
              <span key={i}>{letter}</span>
            ),
          )}
        </span>
      ))}
    </h1>
  );
}
