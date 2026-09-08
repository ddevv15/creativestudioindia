import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1.0 },
  { path: "/projects", priority: 0.6 },
  { path: "/about", priority: 0.6 },
  { path: "/services", priority: 0.6 },
  { path: "/sketches", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  const now = new Date();

  return [
    ...STATIC_ROUTES.map(({ path, priority }) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      priority,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      // _updatedAt is projected by the GROQ, but stays optional in the type so
      // a document that predates the field does not break the build.
      lastModified: project._updatedAt ? new Date(project._updatedAt) : now,
      priority: 0.8,
    })),
  ];
}
