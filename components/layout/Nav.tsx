"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, hasOverlayHero } from "@/constants/nav";
import MobileNav from "./MobileNav";

/**
 * Current nav height, read from the `--nav-h` custom property in globals.css so
 * the scroll trigger uses the same number the bar is actually rendered at.
 *
 * Read at call time rather than captured once: `--nav-h` is responsive (64px →
 * 96px at md), and a hardcoded 96 fired the trigger 32px late on mobile.
 */
function navHeight(): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--nav-h");
  return parseFloat(value) || 96;
}

export default function Nav() {
  const pathname = usePathname();
  const overlay = hasOverlayHero(pathname);
  const [pastHero, setPastHero] = useState(false);

  // Solid unless this route actually has a dark hero to sit over. Computed
  // during render, so pages without one are never transparent — not even for
  // a frame.
  const solid = !overlay || pastHero;

  useEffect(() => {
    // Trigger off the hero element itself rather than window.innerHeight.
    // The viewport-height proxy assumed every hero was full-bleed; /sketches'
    // hero is ~333px tall, which left the nav transparent over the white
    // gallery for ~429px of scrolling.
    const hero = document.querySelector<HTMLElement>("[data-nav-overlay]");

    // An overlay route needs BOTH halves of the contract: a pattern in
    // OVERLAY_HERO_ROUTES (so the first paint is already correct) and a
    // [data-nav-overlay] element (so the trigger measures the real hero). Half a
    // contract fails silently in either direction, so say so in dev.
    if (process.env.NODE_ENV !== "production") {
      if (overlay && !hero) {
        console.warn(
          `[Nav] "${pathname}" matches OVERLAY_HERO_ROUTES but renders no ` +
            `[data-nav-overlay] element — falling back to a viewport-height guess. ` +
            `Add the attribute to the hero section.`
        );
      } else if (!overlay && hero) {
        console.warn(
          `[Nav] "${pathname}" renders a [data-nav-overlay] element but matches no ` +
            `pattern in OVERLAY_HERO_ROUTES (constants/nav.ts) — the nav will stay ` +
            `solid over it. Add a matching pattern.`
        );
      }
    }

    if (!overlay) {
      setPastHero(false);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: hero ?? document.documentElement,
      // Fire as the hero's bottom edge passes under the nav bar, not once it
      // has already cleared the top of the viewport. A function (not a string)
      // so ScrollTrigger.refresh() re-reads the height after a resize crosses
      // the md breakpoint.
      start: hero ? () => `bottom top+=${navHeight()}` : () => window.innerHeight,
      end: "max",
      onToggle: (self) => setPastHero(self.isActive),
    });

    // Nav stays mounted across App Router navigations, so the trigger has to be
    // rebuilt per route — otherwise it keeps the previous page's measurements.
    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
    };
  }, [pathname, overlay]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 hidden h-nav items-center px-48 transition-colors duration-300 md:flex",
          solid ? "bg-ink border-b-[0.5px] border-white/10" : "bg-transparent"
        )}
      >
        <Link
          href="/"
          className="font-sans text-sm font-medium tracking-wider text-white"
        >
          CREATIVE STUDIO
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-48">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                // The underline alone conveys "current page" only visually.
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "border-b pb-8 font-sans text-[13px] text-white",
                  isActive ? "border-white" : "border-transparent"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="rounded-none border border-white px-24 py-8 font-sans text-[13px] text-white"
        >
          Start a project →
        </Link>
      </header>

      <MobileNav solid={solid} />
    </>
  );
}
