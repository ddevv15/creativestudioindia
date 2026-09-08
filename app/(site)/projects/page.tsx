import ProjectsBrowser from "@/components/ProjectsBrowser";
import { getAllProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects | Creative Studio India",
  description:
    "Residential, commercial, and mixed-use architecture by Creative Studio India, Ahmedabad.",
});

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <>
      <section className="bg-linen px-24 pt-nav-96 md:px-48">
        <p className="section-label">Projects</p>

        <h1 className="display-headline mt-16 text-[52px] text-ink">
          Our work.
        </h1>
      </section>

      <ProjectsBrowser projects={projects} />
    </>
  );
}
