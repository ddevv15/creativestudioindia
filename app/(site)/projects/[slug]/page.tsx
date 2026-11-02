import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@sanity/types";
import JsonLd from "@/components/JsonLd";
import ProjectCarousel from "@/components/ProjectCarousel";
import ImageScrim from "@/components/ImageScrim";
import SanityImage from "@/components/SanityImage";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/constants/categories";
import { SITE } from "@/constants/site";
import {
  getAllProjects,
  getAllProjectSlugs,
  getProjectBySlug,
  getSiteSettings,
} from "@/lib/content";
import { urlFor } from "@/lib/sanity/image";
import { galleryImageSchema } from "@/lib/seo";
import { toPlainText, truncate } from "@/lib/utils";
import type { GalleryImage } from "@/types/sanity";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

const LINK = "underline decoration-1 underline-offset-4 transition-colors duration-200 hover:text-stone";

export async function generateStaticParams() {
  return getAllProjectSlugs();
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

/** A gallery photograph with its mono caption underneath. */
function CaptionedImage({
  image,
  alt,
  ratio,
  sizes,
}: {
  image: GalleryImage;
  alt: string;
  ratio: number;
  sizes: string;
}) {
  return (
    <figure>
      <div className="relative overflow-hidden bg-linen" style={{ aspectRatio: ratio }}>
        <SanityImage source={image} ratio={ratio} alt={image.caption ?? alt} fill sizes={sizes} className="object-cover" />
      </div>
      {image.caption && <figcaption className="caption-mono mt-8">{image.caption}</figcaption>}
    </figure>
  );
}

/** A narrow frame beside a wide one; `mirrored` swaps the sides. */
function ImagePair({
  images,
  alt,
  mirrored = false,
}: {
  images: GalleryImage[];
  alt: string;
  mirrored?: boolean;
}) {
  const [narrow, wide] = images;
  return (
    <section data-reveal className="grid grid-cols-12 items-start gap-[10px] px-gutter pt-64 lg:pt-96">
      <div className={mirrored ? "col-span-12 md:order-2 md:col-span-3" : "col-span-12 md:col-span-3"}>
        <CaptionedImage image={narrow} alt={alt} ratio={4 / 5} sizes="(min-width: 768px) 25vw, 100vw" />
      </div>
      <div className={mirrored ? "col-span-12 md:order-1 md:col-span-9" : "col-span-12 md:col-span-9"}>
        <CaptionedImage image={wide} alt={alt} ratio={16 / 7} sizes="(min-width: 768px) 75vw, 100vw" />
      </div>
    </section>
  );
}

function Prose({ value, className }: { value: PortableTextBlock[]; className: string }) {
  return (
    <div className={className}>
      <PortableText value={value} />
    </div>
  );
}

/**
 * Project page in the editorial layout (spec 0002, after the reference's
 * project pages):
 *   cover → intro panel (title, lead, details) → image + text → image pair →
 *   pull quote → gallery carousel → contact strip → next project.
 *
 * The description's first block is the lead; the rest is body text. Gallery
 * photographs are dealt out in order: one beside the body, two in the pair,
 * and the rest into the carousel (or the whole gallery when fewer than two
 * are left over).
 */
export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, allProjects, siteSettings] = await Promise.all([
    getProjectBySlug(slug),
    getAllProjects(),
    getSiteSettings(),
  ]);

  if (!project) notFound();

  const index = allProjects.findIndex((item) => item.slug === slug);
  const next = allProjects.length > 1 ? allProjects[(index + 1) % allProjects.length] : undefined;

  const blocks = project.description ?? [];
  const lead = blocks.slice(0, 1);
  const body = blocks.slice(1);
  const hasBody = body.length > 0;

  // Deal the gallery out in page order, never showing a photograph twice.
  // Pairs are only taken while at least two would still be left for the
  // carousel. Without body text, a second (mirrored) pair takes the place of the
  // image-and-text section, so a project told in photographs alone still reads
  // as a full page.
  const gallery = project.gallery ?? [];
  let cursor = 0;
  const take = (count: number) => {
    const taken = gallery.slice(cursor, cursor + count);
    cursor += taken.length;
    return taken;
  };
  const besideBody = hasBody ? take(1)[0] : undefined;
  const firstPair = gallery.length - cursor >= 4 ? take(2) : [];
  const secondPair = !hasBody && gallery.length - cursor >= 4 ? take(2) : [];
  const carousel = gallery.slice(cursor);

  const details = [
    { label: "Type", value: CATEGORY_LABELS[project.category] },
    { label: "Status", value: project.status ? STATUS_LABELS[project.status] : undefined },
    { label: "Area", value: project.area },
    { label: "Location", value: project.location },
    { label: "Year", value: project.year?.toString() },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  const imageSchema = galleryImageSchema(
    gallery.map((image) => ({
      url: urlFor(image).width(1600).height(1200).fit("crop").url(),
      name: project.title,
      caption: image.caption,
    })),
  );

  return (
    <>
      <JsonLd data={imageSchema} />

      {/* Cover: the photograph alone. The words start in the panel below. */}
      <section data-nav-overlay className="relative h-[92svh] min-h-[480px] w-full bg-charcoal">
        <SanityImage
          source={project.coverImage}
          alt={project.title}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <ImageScrim edge="header" />
      </section>

      {/* Intro panel */}
      <section className="bg-linen px-gutter pb-64 pt-32 lg:pb-96">
        <div className="grid grid-cols-12 gap-x-[10px] gap-y-8 text-[13px]">
          <a href="#gallery" className={`col-span-12 md:col-span-6 ${LINK} w-fit`}>
            View gallery
          </a>
          {project.location && (
            <p className="caption-mono col-span-6 md:col-span-3">{project.location}</p>
          )}
          {project.year && <p className="caption-mono col-span-6 md:col-span-3">{project.year}</p>}
        </div>

        <div className="mt-48 grid grid-cols-12 gap-x-[10px] gap-y-24">
          <h1 className="col-span-12 text-[32px] uppercase leading-[1.15] tracking-[0.01em] text-ink md:col-span-6 md:text-[40px]">
            {project.title}
          </h1>
          {lead.length > 0 ? (
            <Prose
              value={lead}
              className="col-span-12 text-[20px] leading-[1.35] text-ink md:col-span-6 md:text-[22px] lg:col-span-5"
            />
          ) : (
            <p className="col-span-12 text-[20px] leading-[1.35] text-ink md:col-span-6 md:text-[22px] lg:col-span-5">
              {project.headline}
            </p>
          )}
        </div>

        {details.length > 0 && (
          <div className="mt-64 grid grid-cols-12 gap-x-[10px] border-t border-ink/20 pt-16 lg:mt-96">
            <p className="caption-mono col-span-12 mb-16 md:col-span-6 md:mb-0">Project details</p>
            <dl className="col-span-12 md:col-span-6">
              {details.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-2 gap-x-[10px] border-b border-ink/15 py-8 text-[13px] first:pt-0"
                >
                  <dt className="font-mono text-stone">{row.label}</dt>
                  <dd className="text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>

      {/* Image beside the body text */}
      {hasBody && (
        <section data-reveal className="grid grid-cols-12 gap-x-[10px] gap-y-48 px-gutter pt-64 lg:pt-96">
          {besideBody && (
            <div className="col-span-12 md:col-span-5 lg:col-span-4">
              <CaptionedImage image={besideBody} alt={project.title} ratio={3 / 2} sizes="(min-width: 768px) 35vw, 100vw" />
            </div>
          )}
          <Prose
            value={body}
            className="col-span-12 max-w-[60ch] text-[15px] leading-[1.55] text-ink md:col-span-6 md:col-start-7 lg:col-span-4 lg:col-start-7 [&>p+p]:mt-16"
          />
        </section>
      )}

      {firstPair.length === 2 && <ImagePair images={firstPair} alt={project.title} />}
      {secondPair.length === 2 && <ImagePair images={secondPair} alt={project.title} mirrored />}

      {/* Pull quote. Only when the description supplied the lead; otherwise
          the headline is already the lead and would just repeat. */}
      {lead.length > 0 && project.headline && (
        <section data-reveal className="px-gutter py-96 lg:py-128">
          <p className="max-w-[24ch] text-[28px] leading-[1.22] tracking-[-0.01em] text-ink md:text-[40px]">
            {project.headline}
          </p>
        </section>
      )}

      <ProjectCarousel images={carousel} title={project.title} />

      {/* Contact strip */}
      <section data-reveal className="px-gutter pb-64 lg:pb-96">
        <div className="grid grid-cols-12 items-start gap-x-[10px] gap-y-24 border-t border-ink/20 pt-16 text-[13px]">
          <h2 className="col-span-12 text-[15px] text-ink md:col-span-3">Contact</h2>

          <div className="col-span-12 flex gap-16 md:col-span-4">
            {siteSettings.principalPhoto?.asset?.url && (
              <div className="relative h-[64px] w-[52px] shrink-0 overflow-hidden bg-linen">
                <Image
                  src={siteSettings.principalPhoto.asset.url}
                  alt="Jignesh Patel"
                  fill
                  sizes="52px"
                  className="object-cover grayscale"
                />
              </div>
            )}
            <div>
              <p className="text-ink">Jignesh Patel</p>
              <p className="text-stone">Principal designer</p>
              <a href={`mailto:${SITE.email}`} className={`mt-8 inline-block ${LINK}`}>
                {SITE.email}
              </a>
            </div>
          </div>

          {/* Nothing interactive at the far right: the fixed WhatsApp button
              sits over that corner as the strip scrolls past. */}
          <div className="col-span-12 flex flex-col items-start gap-4 md:col-span-4">
            <p className="text-stone">Studio, Ahmedabad</p>
            <a href={`tel:${SITE.phone}`} className={LINK}>
              {SITE.phone}
            </a>
            <Link href="/contact" className={`mt-8 ${LINK}`}>
              Start a project →
            </Link>
          </div>
        </div>
      </section>

      {/* Next project */}
      {next && (
        <section className="bg-linen">
          <div className="px-gutter pb-32 pt-24">
            <p className="caption-mono">Next project</p>
            <div className="mt-48 flex flex-wrap items-end justify-between gap-16">
              <h2 className="text-[28px] uppercase leading-[1.15] tracking-[0.01em] text-ink md:text-[32px]">
                <Link href={`/projects/${next.slug}`}>{next.title}</Link>
              </h2>
              <Link href={`/projects/${next.slug}`} className={`text-[13px] ${LINK}`}>
                Explore project →
              </Link>
            </div>
          </div>
          <Link
            href={`/projects/${next.slug}`}
            aria-label={`Next project: ${next.title}`}
            className="group relative block h-[70svh] min-h-[360px] overflow-hidden bg-charcoal"
          >
            <SanityImage
              source={next.coverImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)]:group-hover:scale-[1.02]"
            />
          </Link>
        </section>
      )}
    </>
  );
}
