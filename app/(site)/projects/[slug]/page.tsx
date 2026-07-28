import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import JsonLd from "@/components/JsonLd";
import ProjectCard from "@/components/ProjectCard";
import ProjectGallery from "@/components/ProjectGallery";
import ScrollProgress from "@/components/ScrollProgress";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/constants/categories";
import { getAllProjects, getProjectBySlug, getRelatedProjects } from "@/lib/content";
import { urlFor } from "@/lib/sanity/image";
import { galleryImageSchema } from "@/lib/seo";
import { toPlainText, truncate } from "@/lib/utils";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return {};

  const description =
    project.seo?.metaDescription ??
    truncate(toPlainText(project.description), 160);

  const ogSource = project.seo?.ogImage ?? project.coverImage;
  const ogImage = urlFor(ogSource).width(1200).height(630).fit("crop").url();

  return {
    title: project.seo?.metaTitle ?? `${project.title} | Creative Studio India`,
    description,
    openGraph: {
      title: project.title,
      description,
      type: "article",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const related = await getRelatedProjects(slug, project.category);

  const specRows = [
    { label: "Category", value: CATEGORY_LABELS[project.category] },
    { label: "Year", value: project.year?.toString() },
    { label: "Location", value: project.location },
    { label: "Area", value: project.area },
    {
      label: "Status",
      value: project.status ? STATUS_LABELS[project.status] : undefined,
    },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  // The hero strip omits category — it already has its own pill above.
  const heroSpecs = specRows
    .filter((row) => row.label !== "Category")
    .map((row) => row.value);

  const imageSchema = galleryImageSchema(
    project.gallery.map((image) => ({
      url: urlFor(image).width(1600).height(1200).fit("crop").url(),
      name: project.title,
      caption: image.caption,
    })),
  );

  return (
    <>
      <JsonLd data={imageSchema} />

      <ScrollProgress />

      <section className="relative h-screen w-full">
        <Image
          src={urlFor(project.coverImage).width(1920).height(1080).fit("crop").url()}
          alt={project.title}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-24 pb-64 md:px-48">
          <span className="inline-block rounded-full border border-white px-16 py-4 font-sans text-[11px] uppercase tracking-wider text-white">
            {CATEGORY_LABELS[project.category]}
          </span>

          <h1 className="display-headline mt-24 max-w-[16ch] text-[36px] text-white lg:text-[56px]">
            {project.headline}
          </h1>

          {heroSpecs.length > 0 && (
            <p className="mt-16 font-sans text-[13px] text-white/65">
              {heroSpecs.join(" · ")}
            </p>
          )}
        </div>
      </section>

      <ProjectGallery gallery={project.gallery} title={project.title} />

      <section className="bg-offwhite px-24 py-96 md:px-48">
        <div className="grid grid-cols-1 gap-48 lg:grid-cols-[1fr_320px] lg:gap-96">
          <div className="font-sans text-base leading-[1.75] text-stone [&>p]:mb-24 [&>p:last-child]:mb-0">
            {project.description ? (
              <PortableText value={project.description} />
            ) : null}
          </div>

          <aside>
            <p className="section-label">Details</p>

            <dl className="mt-24">
              {specRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-24 border-b-[0.5px] border-stone/30 py-16"
                >
                  <dt className="font-sans text-[11px] uppercase tracking-wider text-stone">
                    {row.label}
                  </dt>
                  <dd className="text-right font-sans text-[14px] text-ink">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-linen px-24 py-96 md:px-48">
          <h2 className="display-headline text-[40px] text-ink">
            More projects
          </h2>

          <div className="mt-48 grid grid-cols-1 gap-24 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProjectCard key={item._id} {...item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
