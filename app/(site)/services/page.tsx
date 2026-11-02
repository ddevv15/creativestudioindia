import Link from "next/link";
import type { SanityImageObject } from "@sanity/image-url";
import SanityImage from "@/components/SanityImage";
import Statement from "@/components/sections/Statement";
import { SERVICES } from "@/constants/services";
import { SITE } from "@/constants/site";
import { bannerProject } from "@/lib/banner";
import { getAllProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { serviceProjects, widestGalleryImage } from "@/lib/serviceProjects";
import { cn } from "@/lib/utils";
import type { GalleryImage, Project } from "@/types/sanity";

export const metadata = pageMetadata({
  title: "Services | Creative Studio India",
  description:
    "Architecture, 3D visualization, and CAD documentation from Creative Studio India, Ahmedabad.",
});

type Pair = {
  narrow: SanityImageObject;
  wide: GalleryImage;
  title: string;
  slug: string;
  /** Says what the images are: a built photo, or a visualization of an unbuilt project. */
  label: string;
};

/**
 * The project's widest gallery image fills the 16:7 frame, so a tall subject
 * (a tower) is never sliced; the cover takes the 4:5 frame.
 */
function pairFrom(project: Project | undefined, label: string): Pair | null {
  if (!project) return null;
  const wide = widestGalleryImage(project);
  if (!wide) return null;
  return { narrow: project.coverImage, wide, title: project.title, slug: project.slug, label };
}

const HEADING = "text-[32px] font-normal leading-[1.18] tracking-[-0.01em] text-ink md:text-[40px]";
const FRAME = "group relative overflow-hidden bg-linen";
const IMAGE = "object-cover transition-transform duration-700 group-hover:scale-[1.03]";

/**
 * Services as editorial image pairs (direction in .impeccable/surfaces): each
 * service shown through the studio's own pictures of that kind of work, a
 * narrow 4:5 beside a wide 16:7, mirrored on alternate rows. Images are matched
 * honestly: a completed building for Architecture, an under-construction
 * project's visualization for 3D Visualization, and none for CAD &
 * Documentation until real drawings exist (client question 2.9).
 */
export default async function ServicesPage() {
  const projects = await getAllProjects();
  const { built, visualized } = serviceProjects(projects);
  const pairs = [
    pairFrom(built, "completed"),
    // An unbuilt project's images are renders, so the caption says so.
    pairFrom(visualized, "visualization, under construction"),
    null,
  ];

  const banner = bannerProject("services", projects, [built, visualized]);

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
          Services
        </h1>
      </section>

      <div className="px-gutter pb-32 pt-64 lg:pt-96">
        {SERVICES.map((service, index) => {
          const pair = pairs[index];
          // Mirror every other row: the narrow frame swaps sides, and the text follows the wide one.
          const mirrored = index % 2 === 1;

          return (
            <section
              key={service.name}
              data-reveal
              aria-labelledby={`service-${index}`}
              className={cn("grid grid-cols-12 gap-x-[10px]", index > 0 && "mt-96 lg:mt-128")}
            >
              {pair && (
                <>
                  <figure
                    className={cn(
                      "col-span-5 self-end md:col-span-4",
                      mirrored && "order-2 md:col-start-9"
                    )}
                  >
                    {/* Same destination as the wide frame, so it stays out of the tab order. */}
                    <Link href={`/projects/${pair.slug}`} tabIndex={-1} aria-hidden="true" className={cn(FRAME, "block aspect-[4/5]")}>
                      <SanityImage
                        source={pair.narrow}
                        ratio={4 / 5}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 33vw, 42vw"
                        className={IMAGE}
                      />
                    </Link>
                  </figure>
                  <figure
                    className={cn(
                      "col-span-7 self-end md:col-span-8",
                      mirrored ? "order-1 md:col-start-1" : "md:col-start-5"
                    )}
                  >
                    <Link href={`/projects/${pair.slug}`} className={cn(FRAME, "block aspect-[4/5] md:aspect-[16/7]")}>
                      <SanityImage
                        source={pair.wide}
                        alt={`${pair.title}${pair.wide.caption ? `, ${pair.wide.caption}` : ""}, ${pair.label}. View the project.`}
                        fill
                        sizes="(min-width: 768px) 66vw, 58vw"
                        className={IMAGE}
                      />
                    </Link>
                    <figcaption className="caption-mono mt-8">
                      {pair.title}
                      {pair.wide.caption && `, ${pair.wide.caption.toLowerCase()}`}, {pair.label}
                    </figcaption>
                  </figure>
                </>
              )}

              <div
                className={cn(
                  "order-3 col-span-12 mt-24 grid grid-cols-12 gap-x-[10px] gap-y-16",
                  !pair && "mt-0 border-t border-ink/20 pt-24"
                )}
              >
                <h2
                  id={`service-${index}`}
                  className={cn(HEADING, "col-span-12 md:col-span-4", mirrored ? "md:col-start-1" : "md:col-start-5")}
                >
                  {service.name}
                </h2>
                <div className={cn("col-span-12 md:col-span-4", mirrored ? "md:col-start-5" : "md:col-start-9")}>
                  <p className="text-[15px] leading-[1.55] text-ink">{service.description}</p>
                  <ul className="mt-24">
                    {service.includes.map((item) => (
                      <li key={item} className="border-t border-ink/20 py-8 text-[13px] text-ink last:border-b">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <Statement
        heading="Have a project in mind?"
        body="Tell us about the site, the brief and the people it is for, and the studio will take it from there."
        links={[
          { label: "Start a project →", href: "/contact" },
          { label: "WhatsApp", href: `https://wa.me/${SITE.whatsappNumber}` },
        ]}
      />
    </>
  );
}
