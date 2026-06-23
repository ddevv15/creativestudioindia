import { client } from "@/lib/sanity/client";
import { getFeaturedProjects } from "@/lib/sanity/queries";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import type { Project } from "@/types/sanity";

export const revalidate = 3600;

export default async function HomePage() {
  const projects = await client.fetch<Project[]>(getFeaturedProjects);

  return <FeaturedProjects projects={projects} />;
}
