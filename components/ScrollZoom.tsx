"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Slowly scales its contents while the nearest `[data-zoom-track]` ancestor
 * scrolls through the viewport (scrubbed, so it moves only as the page moves).
 * Used on the Studio page's pinned portrait. Stays still under reduced motion.
 */
export default function ScrollZoom({
  children,
  className,
  to = 1.08,
}: {
  children: ReactNode;
  className?: string;
  /** Scale reached when the track has scrolled fully past. */
  to?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const track = element.closest<HTMLElement>("[data-zoom-track]") ?? element;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        element,
        { scale: 1 },
        {
          scale: to,
          ease: "none",
          scrollTrigger: { trigger: track, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    });

    return () => mm.revert();
  }, [to]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
