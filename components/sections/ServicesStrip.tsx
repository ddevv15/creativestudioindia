import Link from "next/link";
import type { SanityImageObject } from "@sanity/image-url";
import SanityImage from "@/components/SanityImage";
import { SERVICES } from "@/constants/services";
import { serviceProjects, widestGalleryImage } from "@/lib/serviceProjects";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/sanity";

/**
 * The three disciplines as a ruled index (homepage): each service a full-width
 * row with its name set large, so the section holds the weight of the
 * photographic sections above it. Hovering a row wipes in a real image of that
 * kind of work beside it; touch screens show the image inline instead. CAD &
 * Documentation uses a stand-in photo until the studio's drawings arrive (2.9).
 */
export default function ServicesStrip({ projects }: { projects: Project[] }) {
  const { built, visualized } = serviceProjects(projects);
  const visual = visualized && widestGalleryImage(visualized);
  // STAND-IN: CAD & Documentation has no drawings yet (client question 2.9), so
  // it borrows a photograph of another project. Swap for a real drawing when
  // one arrives; the alt text names the project, never claims it's a drawing.
  const standIn = projects.find((p) => p.featured && p !== built && p !== visualized) ??
    projects.find((p) => p !== built && p !== visualized);
  const images: ({ source: SanityImageObject; alt: string } | null)[] = [
    built ? { source: built.coverImage, alt: `${built.title}, completed` } : null,
    visualized && visual
      ? { source: visual, alt: `${visualized.title}, visualization` }
      : null,
    standIn ? { source: standIn.coverImage, alt: standIn.title } : null,
  ];

  return (
    <section data-reveal aria-labelledby="services-heading" className="px-gutter py-64 lg:py-96">
      <div className="grid grid-cols-12 items-baseline gap-x-[10px] gap-y-16">
        <h2
          id="services-heading"
          className="col-span-12 text-[32px] font-normal leading-[1.18] tracking-[-0.01em] text-ink md:col-span-6 md:text-[40px]"
        >
          Services
        </h2>
        <Link
          href="/services"
          className="col-span-12 text-[15px] underline decoration-1 underline-offset-4 transition-colors duration-200 hover:text-stone md:col-span-3 md:col-start-7"
        >
          All services →
        </Link>
      </div>

      <ul className="mt-48 border-b border-ink/20">
        {SERVICES.map((service, index) => {
          const image = images[index];

          return (
            <li key={service.name} className="relative border-t border-ink/20">
              <Link
                href="/services"
                className="group grid grid-cols-12 items-start gap-x-[10px] gap-y-16 py-24 md:items-baseline md:py-32"
              >
                <span className="col-span-12 text-[32px] leading-[1.18] tracking-[-0.01em] text-ink transition-colors duration-200 md:col-span-6 md:text-[40px]">
                  {service.name}
                  <span
                    aria-hidden="true"
                    className="ml-16 inline-block text-[24px] text-stone transition-transform duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-8 group-hover:text-ink"
                  >
                    →
                  </span>
                </span>

                <span className="col-span-7 text-[15px] leading-[1.55] text-stone transition-colors duration-200 group-hover:text-ink md:col-span-3 md:col-start-7">
                  {service.description}
                </span>

                {image && (
                  <span
                    className={cn(
                      // Touch: an inline 3:2 frame beside the description.
                      "relative col-span-5 block aspect-[3/2] overflow-hidden bg-linen md:col-span-3 md:col-start-10",
                      // Hover devices: lifted out of the row, centred on it over the
                      // last three columns, and wiped up from the bottom on hover.
                      // (Written out in full: Tailwind can't see composed class names.)
                      "[@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:absolute [@media(hover:hover)]:right-0 [@media(hover:hover)]:top-1/2 [@media(hover:hover)]:z-10 [@media(hover:hover)]:w-[calc((100%-110px)/4+20px)] [@media(hover:hover)]:-translate-y-1/2",
                      "[@media(hover:hover)]:[clip-path:inset(100%_0_0_0)] [@media(hover:hover)]:transition-[clip-path] [@media(hover:hover)]:duration-500 [@media(hover:hover)]:[transition-timing-function:cubic-bezier(0.23,1,0.32,1)]",
                      "[@media(hover:hover)]:group-hover:[clip-path:inset(0)] [@media(hover:hover)]:group-focus-visible:[clip-path:inset(0)]",
                      "motion-reduce:transition-none"
                    )}
                  >
                    <SanityImage
                      source={image.source}
                      ratio={3 / 2}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 768px) 25vw, 42vw"
                      className="object-cover"
                    />
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
