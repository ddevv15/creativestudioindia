import type { SanityImageObject } from "@sanity/image-url";

export type NavItem = {
  label: string;
  href: string;
};

/** A menu row: one primary link followed by muted secondary links. */
export type MenuItem = NavItem & {
  sub?: NavItem[];
};

/**
 * One full-bleed image with its caption: a hero slide or the menu's image
 * panel. `href` is absent when the image isn't a project (the hero fallback).
 */
export type FeatureImage = {
  title: string;
  href?: string;
  location?: string;
  image: SanityImageObject;
};
