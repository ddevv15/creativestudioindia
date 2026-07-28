import { demoProjects } from "@/lib/demoData";
import type { Project, ProjectCardData } from "@/types/sanity";

/**
 * Ordering and limits below mirror the GROQ in lib/sanity/queries.ts exactly.
 * On Sanity day each body becomes a client.fetch() call and nothing else moves.
 */

function byOrder(a: Project, b: Project) {
  return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
}

/** GROQ: *[_type == "project"] | order(order asc) */
export async function getAllProjects(): Promise<Project[]> {
  return [...demoProjects].sort(byOrder);
}

/** GROQ: *[_type == "project" && featured == true] | order(order asc) [0...3] */
export async function getFeaturedProjects(): Promise<ProjectCardData[]> {
  return [...demoProjects]
    .filter((project) => project.featured)
    .sort(byOrder)
    .slice(0, 3);
}

/** GROQ: *[_type == "project" && slug.current == $slug][0] — null when absent. */
export async function getProjectBySlug(
  slug: string,
): Promise<Project | null> {
  return demoProjects.find((project) => project.slug === slug) ?? null;
}

/**
 * GROQ: same category, excluding the current project, first three by order.
 * Returns fewer than three when the category is thin — callers must handle 0.
 */
export async function getRelatedProjects(
  slug: string,
  category: string,
): Promise<ProjectCardData[]> {
  return [...demoProjects]
    .filter((project) => project.category === category && project.slug !== slug)
    .sort(byOrder)
    .slice(0, 3);
}
