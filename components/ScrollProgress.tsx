"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Spec 22: a 2px red line pinned to the top of the viewport that grows from 0%
 * to 100% as the page scrolls. Driven by ScrollTrigger with scrub: true.
 *
 * gsap.context() is what makes this Strict-Mode safe — revert() on unmount
 * kills the tween and its ScrollTrigger together, so the double-mount in dev
 * cannot leave a second trigger attached to the document.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed left-0 top-0 z-50 h-[2px] w-full origin-left scale-x-0 bg-red"
    />
  );
}
