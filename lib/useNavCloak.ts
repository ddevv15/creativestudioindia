"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Current nav height, read from the `--nav-h` custom property in globals.css so
 * the cloak uses the same number the bar is actually rendered at. Read at call
 * time rather than captured once, because `--nav-h` is responsive.
 */
function navHeight(): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    "--nav-h",
  );
  return parseFloat(value) || 96;
}

/**
 * True while the page's opening moment should own the screen on its own.
 *
 * A route opts in by rendering an element with `data-nav-cloak`. Everything
 * that floats over the page (the nav bars, the WhatsApp button) hides while
 * that element is still on screen, and comes back once it has scrolled past.
 * The homepage uses it so the landing is nothing but the hero frame.
 *
 * Returns false for any route that does not opt in, so nothing is ever briefly
 * missing on an ordinary page.
 */
export function useNavCloak(): boolean {
  const pathname = usePathname();
  const [cloaked, setCloaked] = useState(false);

  useEffect(() => {
    let revealedByKeyboard = false;

    // The element is looked up on every check, not once up front. The layout
    // mounts before the page streams in, so a single lookup at mount runs
    // before the cloaking element exists, decides there is nothing to hide for,
    // and never looks again.
    const update = () => {
      if (revealedByKeyboard) return;
      const cloak = document.querySelector<HTMLElement>("[data-nav-cloak]");
      setCloaked(!!cloak && cloak.getBoundingClientRect().bottom > navHeight());
    };

    // Nobody navigating by keyboard should be stranded on a page with no
    // navigation because they have not scrolled. The first Tab brings
    // everything back for good, before focus can land on something invisible.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      revealedByKeyboard = true;
      setCloaked(false);
    };

    // Catches the cloaking element arriving with the streamed page content.
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true });

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [pathname]);

  return cloaked;
}
