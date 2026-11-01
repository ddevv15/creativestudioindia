"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { QUICK_LINKS, hasOverlayHero } from "@/constants/nav";
import type { FeatureImage } from "@/types";
import SanityImage from "@/components/SanityImage";
import MenuOverlay from "./MenuOverlay";

/** Read at call time: `--nav-h` is responsive (64px → 90px at md). */
function navHeight(): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--nav-h");
  return parseFloat(value) || 90;
}

/**
 * One header for every breakpoint (spec 0002). It sits transparent with white
 * text over a full-bleed hero at scroll 0, hides while scrolling down, and
 * comes back solid on the way up. GSAP ScrollTrigger owns the scroll reading,
 * per AGENTS.md. The Menu button opens MenuOverlay.
 */
export default function Nav({ features }: { features: FeatureImage[] }) {
  const pathname = usePathname();
  const overlayRoute = hasOverlayHero(pathname);

  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  // Which featured project the menu's image panel shows. Advances on every
  // open, so repeat visits to the menu don't feel static.
  const [featureIndex, setFeatureIndex] = useState(0);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // The image the menu will show next, fetched ahead of time so the wipe
  // reveals a photograph rather than an empty panel. Only where the image
  // panel exists (lg and up), and only once the page itself has settled.
  const [preload, setPreload] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const timer = window.setTimeout(() => setPreload(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);
  const upcoming = features.length > 1 ? features[(featureIndex + 1) % features.length] : features[0];

  useEffect(() => {
    setOpen(false);
    setHidden(false);
    setAtTop(window.scrollY < 8);

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        setAtTop(y < 8);
        // Down past the bar's own height hides it. Any upward scroll restores it.
        setHidden(self.direction === 1 && y > navHeight());
      },
    });

    return () => trigger.kill();
  }, [pathname]);

  // While open: the page behind is inert and doesn't scroll, and Escape closes
  // the menu and returns focus to the button that opened it.
  useEffect(() => {
    if (!open) return;

    const content = document.getElementById("site-content");
    const root = document.documentElement;
    root.style.overflow = "hidden";
    if (content) content.inert = true;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      root.style.overflow = "";
      if (content) content.inert = false;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = () => {
    if (!open && features.length > 1) {
      setFeatureIndex((index) => (index + 1) % features.length);
    }
    setOpen((value) => !value);
  };

  const close = () => setOpen(false);

  const transparent = !open && overlayRoute && atTop;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] h-nav px-gutter font-sans transition-[transform,background-color,color] duration-300 ease-in-out",
          transparent ? "text-offwhite" : "text-ink",
          transparent || open ? "bg-transparent" : "bg-offwhite",
          hidden && !open && "-translate-y-full"
        )}
      >
        <div className="relative flex h-full items-end pb-[18px] md:pb-[22px]">
          <Link
            href="/"
            onClick={close}
            className="shrink-0 pb-[7px] pr-16 text-[15px] font-medium uppercase leading-none tracking-[0.06em]"
          >
            Creative Studio
          </Link>

          {/* The rule runs from the logo to the right gutter. */}
          <div className="flex min-w-0 flex-1 items-end justify-end border-b-2 border-current pb-[6px]">
            <motion.nav
              aria-label="Quick links"
              inert={open || undefined}
              animate={
                open
                  ? { opacity: 0, transform: "translateX(10px)" }
                  : { opacity: 1, transform: "translateX(0px)" }
              }
              transition={{ duration: 0.3, ease: [0, 0, 0.58, 1] }}
              className="hidden items-center gap-24 text-[15px] md:flex"
            >
              {QUICK_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                  className="transition-opacity duration-200 hover:opacity-60 aria-[current=page]:underline aria-[current=page]:underline-offset-4"
                >
                  {item.label}
                </Link>
              ))}
            </motion.nav>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={toggle}
              className={cn(
                "flex min-h-[44px] items-center gap-12 text-[15px] transition-transform duration-150 ease-out active:scale-[0.97]",
                // Below lg: at the right end of the rule. From lg, lifted out to
                // sit above the menu's content panel edge, as on the reference.
                // (At md, 27vw is too close to the logo's width to share a row.)
                "md:ml-24 lg:absolute lg:bottom-[30px] lg:left-[calc(var(--menu-x)-var(--gutter)+10px)] lg:ml-0 lg:min-h-0"
              )}
            >
              <span aria-hidden="true" className="relative block h-[8px] w-[30px]">
                {/* Two lines close into one when open. */}
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-[1.5px] bg-current transition-transform duration-300 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)]",
                    open && "translate-y-[3.25px]"
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-[1.5px] bg-current transition-transform duration-300 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)]",
                    open && "-translate-y-[3.25px]"
                  )}
                />
              </span>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {preload && upcoming && !open && (
        // Same `sizes` as the panel, so the browser picks the same URL and the
        // panel hits the cache. Images inside display:none still fetch.
        <div aria-hidden="true" className="hidden">
          <div className="relative">
            <SanityImage source={upcoming.image} alt="" fill sizes="27vw" loading="eager" fetchPriority="low" />
          </div>
        </div>
      )}

      <MenuOverlay
        open={open}
        onClose={close}
        feature={features[featureIndex]}
        projectLinks={features
          .flatMap((feature) => (feature.href ? [{ label: feature.title, href: feature.href }] : []))
          .slice(0, 4)}
      />
    </>
  );
}
