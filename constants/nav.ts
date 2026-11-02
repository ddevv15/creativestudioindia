import type { MenuItem, NavItem } from "@/types";
import { SITE } from "@/constants/site";

/** Every top-level page. Footer link column and the menu's primary links. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "Studio", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Sketches", href: "/sketches" },
  { label: "Contact", href: "/contact" },
];

/** The short list on the header's right. They hide while the menu is open. */
export const QUICK_LINKS: NavItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "Studio", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Menu rows: a primary link, then muted secondary links (spec 0002). The
 * Projects row's secondaries are featured project titles, filled in at runtime
 * from Sanity by MenuOverlay, so they aren't listed here.
 */
export const MENU_ITEMS: MenuItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "Studio", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Sketches", href: "/sketches" },
  {
    label: "Contact",
    href: "/contact",
    sub: [
      { label: "WhatsApp", href: `https://wa.me/${SITE.whatsappNumber}` },
      { label: "Email", href: `mailto:${SITE.email}` },
    ],
  },
];

/**
 * Routes that open on a full-bleed image. The header sits transparent, with
 * white text, over these, but only at scroll 0. Once the page moves it's solid
 * (spec 0002).
 *
 * Matched during render (not in an effect) so the header never flashes the
 * wrong colour on first paint.
 */
const OVERLAY_HERO_ROUTES: RegExp[] = [
  /^\/$/, // hero slider
  /^\/projects$/, // banner with the page title
  /^\/about$/, // Studio: banner with the page title
  /^\/services$/, // banner with the page title
  /^\/sketches$/, // charcoal hero
  /^\/projects\/[^/]+$/, // project detail: full-viewport cover image
];

export function hasOverlayHero(pathname: string): boolean {
  return OVERLAY_HERO_ROUTES.some((route) => route.test(pathname));
}
