import Link from "next/link";
import SanityImage from "@/components/SanityImage";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/constants/categories";
import { SKETCHES_ARE_SAMPLES } from "@/constants/site";
import { cn } from "@/lib/utils";
import type { GalleryImage, Project, Sketch } from "@/types/sanity";

/*
 * The homepage's editorial feed (spec 0002): rows of a 12-column mosaic, broken
 * every two rows by a full-width feature row.
 *
 * Each row is a cluster around one project: its main tile, a detail photograph
 * from its gallery with that photo's caption, and a note carrying its headline,
 * with sketches (the studio's signature) filling the remaining slots. Below lg
 * the grid flows densely on 2 / 4 columns; from lg every slot has an explicit
 * placement. Class strings are literal so Tailwind can see them.
 */

type Kind = "project" | "detail" | "note" | "sketch";
type Slot = { kind: Kind; className: string };

const SPAN: Record<Kind, string> = {
  project: "col-span-2 md:col-span-3",
  note: "col-span-2 md:col-span-2",
  detail: "col-span-1 md:col-span-1",
  sketch: "col-span-1 md:col-span-1",
};

const ROW_PATTERNS: Slot[][] = [
  [
    { kind: "project", className: "lg:col-span-5 lg:col-start-1" },
    { kind: "detail", className: "lg:col-span-2 lg:col-start-6 lg:mt-96" },
    { kind: "note", className: "lg:col-span-3 lg:col-start-8 lg:mt-24" },
    { kind: "sketch", className: "lg:col-span-2 lg:col-start-11 lg:mt-128" },
  ],
  [
    { kind: "sketch", className: "lg:col-span-2 lg:col-start-1 lg:mt-64" },
    { kind: "note", className: "lg:col-span-3 lg:col-start-3" },
    { kind: "project", className: "lg:col-span-5 lg:col-start-6" },
    { kind: "detail", className: "lg:col-span-2 lg:col-start-11 lg:mt-96" },
  ],
  [
    { kind: "note", className: "lg:col-span-3 lg:col-start-1 lg:mt-48" },
    { kind: "project", className: "lg:col-span-5 lg:col-start-4" },
    { kind: "detail", className: "lg:col-span-2 lg:col-start-9 lg:mt-48" },
    { kind: "sketch", className: "lg:col-span-2 lg:col-start-11 lg:mt-128" },
  ],
];

const ROWS_PER_FEATURE = 2;
const FEATURE_COUNT = 2;
/**
 * The homepage is a taste, not the archive: 4 mosaic rows (one project each)
 * and 2 feature rows, so 6 projects, then a link to all of them on /projects.
 */
const TILE_ROWS = 4;

function metaLine(project: Project) {
  return [CATEGORY_LABELS[project.category], project.year, project.location]
    .filter(Boolean)
    .join(" · ");
}

function ProjectTile({ project }: { project: Project }) {
  // The companion frame is a different photograph from the same project.
  const companion = project.gallery?.[1] ?? project.gallery?.[0];

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="flex gap-[10px]">
        <div className="relative aspect-[3/2] flex-[2.8] overflow-hidden bg-linen">
          <SanityImage
            source={project.coverImage}
            ratio={3 / 2}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 55vw, 100vw"
            className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)]:group-hover:scale-[1.03]"
          />
        </div>
        {companion && (
          <div className="relative hidden flex-1 overflow-hidden bg-linen sm:block">
            <SanityImage
              source={companion}
              alt=""
              fill
              sizes="(min-width: 1024px) 11vw, 18vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
      <p className="caption-mono mt-16">{metaLine(project)}</p>
      <h3 className="mt-4 text-[15px] font-medium leading-[1.35] text-ink">{project.title}</h3>
    </Link>
  );
}

/** One more photograph from a project's gallery, captioned. */
function DetailTile({ project, image }: { project: Project; image: GalleryImage }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-linen">
        <SanityImage
          source={image}
          ratio={4 / 5}
          alt={image.caption ?? `${project.title}, detail`}
          fill
          sizes="(min-width: 1024px) 15vw, (min-width: 768px) 22vw, 50vw"
          className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)]:group-hover:scale-[1.03]"
        />
      </div>
      <p className="caption-mono mt-16">{project.title}</p>
      {image.caption && (
        <p className="mt-4 text-[14px] leading-[1.35] text-ink">{image.caption}</p>
      )}
    </Link>
  );
}

/** A project's headline as a block of text: no image, all words. */
function NoteTile({ project }: { project: Project }) {
  return (
    <div className="border-t border-ink/20 pt-16">
      <p className="caption-mono">{metaLine(project)}</p>
      <p className="mt-16 text-[20px] leading-[1.3] text-ink md:text-[22px]">{project.headline}</p>
      <Link
        href={`/projects/${project.slug}`}
        className="mt-16 inline-block text-[14px] underline decoration-1 underline-offset-4 transition-colors duration-200 hover:text-stone"
      >
        {project.title} →
      </Link>
    </div>
  );
}

function SketchTile({ sketch }: { sketch: Sketch }) {
  const href = sketch.relatedProject ? `/projects/${sketch.relatedProject.slug}` : "/sketches";

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-linen">
        <SanityImage
          source={sketch.image}
          ratio={4 / 3}
          alt={sketch.title}
          fill
          sizes="(min-width: 1024px) 15vw, (min-width: 768px) 22vw, 50vw"
          className="object-cover"
        />
      </div>
      <p className="caption-mono mt-16">
        {SKETCHES_ARE_SAMPLES ? (
          "Sample sketch"
        ) : (
          <>
            Sketch{sketch.year ? <span className="ml-8">{sketch.year}</span> : null}
          </>
        )}
      </p>
      <h3 className="mt-4 text-[15px] font-medium leading-[1.35] text-ink">{sketch.title}</h3>
    </Link>
  );
}

function FeatureRow({ project }: { project: Project }) {
  const companions = project.gallery.slice(0, 2);
  const specs = [
    { label: "Type", value: CATEGORY_LABELS[project.category] },
    { label: "Status", value: project.status ? STATUS_LABELS[project.status] : undefined },
    { label: "Area", value: project.area },
    { label: "Location", value: project.location },
  ].filter((spec): spec is { label: string; value: string } => Boolean(spec.value));

  return (
    <section data-reveal className="mt-64 lg:mt-96">
      <div className="grid grid-cols-12 items-end gap-x-[10px]">
        <h2 className="col-span-12 text-[24px] uppercase leading-[1.2] tracking-[0.01em] text-ink md:col-span-9 md:text-[32px]">
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h2>
        <p className="caption-mono col-span-12 mt-8 md:col-span-3 md:col-start-10 md:mt-0">
          {project.year && <span className="block">{project.year}</span>}
          {project.location && <span className="block">{project.location}</span>}
        </p>
      </div>

      <Link
        href={`/projects/${project.slug}`}
        aria-label={project.title}
        className="mt-16 grid grid-cols-12 gap-[10px]"
      >
        <div className="relative col-span-12 aspect-[3/2] overflow-hidden bg-linen md:col-span-8 md:aspect-[16/6]">
          <SanityImage
            source={project.coverImage}
            // Cropped on the CDN so the studio's hotspot decides what stays in
            // the wide frame, rather than a blind centre crop.
            ratio={8 / 3}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            className="object-cover"
          />
        </div>
        {companions.map((image) => (
          <div key={image._key} className="relative col-span-6 aspect-[4/5] overflow-hidden bg-linen md:col-span-2 md:aspect-auto">
            <SanityImage
              source={image}
              alt={image.caption ?? ""}
              fill
              sizes="(min-width: 768px) 16vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </Link>

      {/* The words the images leave room for. */}
      <div className="mt-24 grid grid-cols-12 gap-x-[10px] gap-y-24">
        <p className="col-span-12 text-[20px] leading-[1.3] text-ink md:col-span-7 md:text-[24px]">
          {project.headline}
        </p>
        <div className="col-span-12 md:col-span-3 md:col-start-10">
          <dl className="grid grid-cols-[auto_1fr] gap-x-16 gap-y-4 text-[13px]">
            {specs.map((spec) => (
              <div key={spec.label} className="contents">
                <dt className="font-mono text-stone">{spec.label}</dt>
                <dd className="text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={`/projects/${project.slug}`}
            className="mt-16 inline-block text-[14px] underline decoration-1 underline-offset-4 transition-colors duration-200 hover:text-stone"
          >
            View project →
          </Link>
        </div>
      </div>
    </section>
  );
}

function MosaicRow({ tiles }: { tiles: { slot: Slot; node: React.ReactNode }[] }) {
  return (
    <div className="mt-64 grid grid-flow-dense grid-cols-2 items-start gap-x-[10px] gap-y-48 first:mt-0 md:grid-cols-4 lg:mt-96 lg:grid-cols-12">
      {tiles.map(({ slot, node }, index) => (
        <article key={index} data-reveal className={cn(SPAN[slot.kind], slot.className)}>
          {node}
        </article>
      ))}
    </div>
  );
}

export default function HomeFeed({ projects, sketches }: { projects: Project[]; sketches: Sketch[] }) {
  // Feature rows need a wide image plus companions, so only projects with a
  // gallery qualify. Featured ones first.
  const featureProjects = [...projects]
    .filter((project) => (project.gallery?.length ?? 0) >= 2)
    .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
    .slice(0, FEATURE_COUNT);
  // Featured first, so the studio decides what the homepage shows.
  const tileProjects = projects
    .filter((project) => !featureProjects.includes(project))
    .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
    .slice(0, TILE_ROWS);
  const sketchQueue = [...sketches];

  const blocks: React.ReactNode[] = [];
  let rowIndex = 0;

  for (const project of tileProjects) {
    const pattern = ROW_PATTERNS[rowIndex % ROW_PATTERNS.length];
    // gallery[1] is already the main tile's companion.
    const detail = project.gallery?.[2];

    const tiles = pattern.flatMap((slot) => {
      if (slot.kind === "project") return [{ slot, node: <ProjectTile project={project} /> }];
      if (slot.kind === "detail" && detail) {
        return [{ slot, node: <DetailTile project={project} image={detail} /> }];
      }
      if (slot.kind === "note" && project.headline) {
        return [{ slot, node: <NoteTile project={project} /> }];
      }
      // Sketches fill their own slots, and any detail slot the project has no
      // third photograph for, so a short gallery never leaves a hole.
      if (slot.kind === "sketch" || slot.kind === "detail") {
        const sketch = sketchQueue.shift();
        if (sketch) return [{ slot, node: <SketchTile sketch={sketch} /> }];
      }
      return [];
    });

    blocks.push(<MosaicRow key={`row-${project._id}`} tiles={tiles} />);
    rowIndex += 1;

    if (rowIndex % ROWS_PER_FEATURE === 0) {
      const feature = featureProjects[rowIndex / ROWS_PER_FEATURE - 1];
      if (feature) blocks.push(<FeatureRow key={`feature-${feature._id}`} project={feature} />);
    }
  }

  // Too few rows to reach a feature slot: the features still get shown.
  featureProjects.slice(Math.floor(rowIndex / ROWS_PER_FEATURE)).forEach((feature) => {
    blocks.push(<FeatureRow key={`feature-${feature._id}`} project={feature} />);
  });

  return (
    <div className="px-gutter">
      {blocks}
      {/* The link starts halfway across rather than at the right edge, where
          the fixed WhatsApp button would cover it. */}
      <div className="mt-64 grid grid-cols-12 items-baseline gap-x-[10px] border-t border-ink/20 pt-16 lg:mt-96">
        <p className="caption-mono col-span-6">Projects</p>
        <Link
          href="/projects"
          className="col-span-6 w-fit text-[15px] underline decoration-1 underline-offset-4 transition-colors duration-200 hover:text-stone"
        >
          All {projects.length} projects →
        </Link>
      </div>
    </div>
  );
}
