"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Drives every `[data-reveal]` element on the page (spec 0002). GSAP
 * ScrollTrigger decides when a tile has entered. The transition itself is CSS
 * in globals.css, so it runs off the main thread while images decode.
 *
 * Mounted once in the site layout and re-run per route, because the layout
 * survives App Router navigations.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Anything already on screen is revealed before the dimmed state switches
    // on, so the first viewport never flickers down and back up.
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) {
        element.setAttribute("data-revealed", "");
      }
    });
    document.documentElement.setAttribute("data-reveal-ready", "");

    const triggers = ScrollTrigger.batch("[data-reveal]:not([data-revealed])", {
      start: "top 92%",
      once: true,
      onEnter: (elements) =>
        elements.forEach((element) => element.setAttribute("data-revealed", "")),
    });

    return () => triggers.forEach((trigger) => trigger.kill());
  }, [pathname]);

  return null;
}
