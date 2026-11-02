import type { Project } from "@/types/sanity";

/**
 * Which featured project each inner page's banner shows. Fixed slots, so no
 * two inner pages ever open on the same photograph (DESIGN.md, inner-page
 * banner). Studio uses projects 0 and 1 further down its page, so it starts at 2.
 */
const SLOTS = {
  projects: 0,
  about: 2,
  services: 3,
} as const;

/**
 * `exclude` lists projects the page already shows lower down; the banner steps
 * forward through the featured list past them rather than repeating a photo.
 */
export function bannerProject(
  page: keyof typeof SLOTS,
  projects: Project[],
  exclude: (Project | undefined)[] = []
): Project | undefined {
  const featured = projects.filter((project) => project.featured);
  const slot = SLOTS[page];
  const pick = featured.slice(slot).find((project) => !exclude.includes(project));
  return pick ?? projects[slot] ?? projects[0];
}
