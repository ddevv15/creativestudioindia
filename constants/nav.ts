import type { NavItem } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "Studio", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

/**
 * Routes that open with a dark hero the nav can legibly sit over.
 *
 * Spec 05 describes the nav's default state as transparent "over the dark
 * hero" — a premise that only held while the homepage was the only page.
 * `/projects`, `/about`, `/services` and `/contact` open on linen or offwhite,
 * where white nav text measures 1.05:1 against a 4.5:1 AA requirement.
 *
 * Matched during render (not in an effect) so the nav never flashes
 * transparent before correcting itself.
 */
const OVERLAY_HERO_ROUTES: RegExp[] = [
  /^\/$/, // homepage — full-viewport Hero
  /^\/sketches$/, // charcoal hero
  /^\/projects\/[^/]+$/, // project detail — full-viewport cover image
];

export function hasOverlayHero(pathname: string): boolean {
  return OVERLAY_HERO_ROUTES.some((route) => route.test(pathname));
}
