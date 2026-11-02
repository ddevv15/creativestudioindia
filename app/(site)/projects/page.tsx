import ProjectsBrowser from "@/components/ProjectsBrowser";
import SanityImage from "@/components/SanityImage";
import { bannerProject } from "@/lib/banner";
import { getAllProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { ProjectGridItem } from "@/types/sanity";

export const metadata = pageMetadata({
  title: "Projects | Creative Studio India",
  description:
    "Residential, commercial, and mixed-use architecture by Creative Studio India, Ahmedabad.",
});

/**
 * /projects after zha.com/projects: a banner with the page title set large,
 * then the filterable grid (ProjectsBrowser). Palette stays the studio's light
 * one; only the structure and interactions follow the reference.
 */
export default async function ProjectsPage() {
  const projects = await getAllProjects();

  // Only what a grid card needs goes to the browser. Galleries and Portable
  // Text stay on the server.
  const items: ProjectGridItem[] = projects.map((project) => ({
    _id: project._id,
    title: project.title,
    slug: project.slug,
    category: project.category,
    status: project.status,
    coverImage: project.coverImage,
    headline: project.headline,
    location: project.location,
    year: project.year,
  }));

  const banner = bannerProject("projects", projects);

  return (
    <>
      <section data-nav-overlay className="relative h-[62svh] min-h-[420px] overflow-hidden bg-charcoal">
        {banner && (
          <SanityImage
            source={banner.coverImage}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-ink/30" />
        <h1 className="absolute bottom-32 left-gutter text-[64px] font-normal leading-none tracking-[-0.03em] text-offwhite md:bottom-48 md:text-[112px] lg:text-[136px]">
          Projects
        </h1>
      </section>

      <ProjectsBrowser projects={items} />
    </>
  );
}
