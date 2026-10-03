"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** The studio's own figure, from the portfolio profile (page 2). */
const YEARS = 35;

// Same source as CredentialBar: "With 35 years of experience... With 700+
// projects". Kept to the two facts that read as a footnote to the number.
const FACTS = ["700+ projects", "Ahmedabad"];

// useLayoutEffect warns during server rendering; this is the usual guard.
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The Studio page's opening: light where the homepage is dark, typography
 * where the homepage is photography. Spec 18's typography-only linen hero,
 * given one confident moment — the "35" is set at poster scale and counts up
 * from zero on load, with the rest of the headline beside it.
 *
 * The heading is one <h1> whose accessible name is the full sentence, so the
 * split layout and the counting digits never reach a screen reader as
 * fragments or as "0… 12… 35".
 *
 * The server renders the final number, so without JS (or with reduced
 * motion) the page simply reads "35". The count resets it to 0 in a layout
 * effect — before first paint — so the 35 never flashes first.
 */
export default function StudioHero() {
  const numberRef = useRef<HTMLSpanElement>(null);
  const restRef = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const number = numberRef.current;
    const rest = restRef.current;
    if (!number || !rest) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const counter = { value: 0 };
      number.textContent = "0";

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(counter, {
        value: YEARS,
        duration: 1.6,
        // Fast at first, settling into the final figure — a count that
        // decelerates reads as arriving, not as a timer running out.
        ease: "power3.out",
        onUpdate: () => {
          number.textContent = String(Math.round(counter.value));
        },
      });
      tl.from(
        rest.children,
        { opacity: 0, y: 24, duration: 0.7, ease: "power2.out", stagger: 0.12 },
        0.35,
      );

      return () => {
        number.textContent = String(YEARS);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    // pt-nav: the nav is fixed and solid on this route, so the content starts
    // below the bar. Tall enough to own the first screen without being an
    // empty full-viewport splash on a short laptop.
    <section className="flex min-h-[86dvh] flex-col bg-linen px-24 pb-[80px] pt-nav-80 md:px-48">
      <p className="section-label">Studio</p>

      <h1
        aria-label={`${YEARS} years of intentional design.`}
        className="mt-auto grid grid-cols-1 items-end gap-x-48 gap-y-24 pt-48 md:grid-cols-[auto_1fr]"
      >
        {/*
          Lining, tabular figures: Cormorant's default old-style numerals put
          the 3 below the baseline, and proportional widths would make the
          number shuffle sideways as it counts.
        */}
        <span
          ref={numberRef}
          aria-hidden
          className="display-headline block text-[clamp(180px,30vw,440px)] leading-[0.78] tracking-[-0.04em] text-ink [font-variant-numeric:lining-nums_tabular-nums]"
        >
          {YEARS}
        </span>

        <span ref={restRef} aria-hidden className="block max-w-[560px] pb-[0.4em]">
          <span className="display-headline block text-[clamp(40px,4.6vw,72px)] leading-[1.02] tracking-[-0.015em] text-ink">
            years of intentional design.
          </span>
          <span className="mt-32 block h-px w-full bg-ink/15" />
          <span className="mt-16 flex flex-wrap gap-x-24 gap-y-8 font-sans text-[13px] uppercase tracking-[0.12em] text-stone">
            {FACTS.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </span>
        </span>
      </h1>
    </section>
  );
}
