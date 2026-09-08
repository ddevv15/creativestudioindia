import { sanityFetch, sanityFetchFresh } from "@/lib/sanity/client";
import * as queries from "@/lib/sanity/queries";
import type { Project, ProjectCardData } from "@/types/sanity";

/**
 * Ordering and limits live in the GROQ, not here — see lib/sanity/queries.ts.
 * These functions are a thin typed wrapper so page components never import
 * GROQ or the Sanity client directly.
 */

export async function getAllProjects(): Promise<Project[]> {
  return sanityFetch<Project[]>({ query: queries.getAllProjects });
}

export async function getFeaturedProjects(): Promise<ProjectCardData[]> {
  return sanityFetch<ProjectCardData[]>({ query: queries.getFeaturedProjects });
}

/** Null when the slug matches nothing — callers must handle it with notFound(). */
export async function getProjectBySlug(
  slug: string,
): Promise<Project | null> {
  return sanityFetch<Project | null>({
    query: queries.getProjectBySlug,
    params: { slug },
  });
}

/**
 * Same category, excluding the current project, first three by order.
 * Returns fewer than three when the category is thin — callers must handle 0.
 */
export async function getRelatedProjects(
  slug: string,
  category: string,
): Promise<ProjectCardData[]> {
  return sanityFetch<ProjectCardData[]>({
    query: queries.getRelatedProjects,
    params: { slug, category },
  });
}

/**
 * Build-time only. Bypasses the CDN so a stale edge response cannot bake a
 * missing project route into the build output.
 */
export async function getAllProjectSlugs(): Promise<{ slug: string }[]> {
  return sanityFetchFresh<{ slug: string }[]>({
    query: queries.getAllProjectSlugs,
  });
}
