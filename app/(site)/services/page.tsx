import Image from "next/image";
import Link from "next/link";
import { getAllProjects } from "@/lib/content";
import { urlFor } from "@/lib/sanity/image";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Services | Creative Studio India",
  description:
    "Architecture, 3D visualization, and CAD documentation from Creative Studio India, Ahmedabad.",
});

type Service = {
  number: string;
  name: string;
  description: string;
  includes: string[];
};

const SERVICES: Service[] = [
  {
    number: "01",
    name: "Architecture",
    description:
      "Full-service architectural design from concept through to construction documentation. Covers bungalows, residential complexes, commercial buildings, and mixed-use developments.",
    includes: [
      "Site analysis and feasibility",
      "Concept design and development",
      "Working drawings and documentation",
      "Local authority approvals",
      "Construction oversight",
    ],
  },
  {
    number: "02",
    name: "3D Visualization",
    description:
      "Photorealistic renders and animated walkthroughs that communicate the design before a single brick is laid. Helps clients and stakeholders visualize the finished project with confidence.",
    includes: [
      "Exterior renders",
      "Interior renders",
      "Day and night views",
      "Animated walkthroughs",
      "Virtual reality-ready files",
    ],
  },
  {
    number: "03",
    name: "CAD & Documentation",
    description:
      "Precise technical drawings and CAD modelling for every stage of the project. Structured for accuracy and ease of use by contractors and consultants.",
    includes: [
      "AutoCAD floor plans",
      "Elevation and section drawings",
      "3D CAD modelling",
      "As-built documentation",
      "Coordination drawings",
    ],
  },
];

export default async function ServicesPage() {
  // Supporting imagery is borrowed from project covers. Falls back to a linen
  // block when no project image is available, per spec 19.
  const projects = await getAllProjects();

  return (
    <>
      <section className="bg-offwhite px-24 pb-64 pt-nav-96 md:px-48">
        <p className="section-label">Services</p>

        <h1 className="display-headline mt-16 text-[52px] text-ink">
          What we bring to every project.
        </h1>
      </section>

      {SERVICES.map((service, index) => {
        const project = projects[index];
        const imageSrc = project
          ? urlFor(project.coverImage).width(1200).height(900).fit("crop").url()
          : null;

        return (
          <section
            key={service.number}
            className={cn(
              "px-24 py-96 md:px-48",
              index % 2 === 0 ? "bg-offwhite" : "bg-linen",
            )}
          >
            <div className="grid grid-cols-1 items-center gap-48 lg:grid-cols-2 lg:gap-96">
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.07em] text-stone">
                  {service.number}
                </p>

                <h2 className="mt-16 font-sans text-[28px] font-semibold text-ink md:text-[32px]">
                  {service.name}
                </h2>

                <p className="mt-24 max-w-[56ch] font-sans text-base leading-[1.75] text-stone">
                  {service.description}
                </p>

                <ul className="mt-32">
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className="border-t-[0.5px] border-stone/20 py-16 font-sans text-[14px] text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative aspect-[4/3] w-full">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={`${service.name} — ${project.title}`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-linen" />
                )}
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-ink px-24 py-64 md:px-48 md:py-96">
        <div className="mx-auto max-w-[640px] text-center">
          <h2 className="display-headline text-[36px] text-white md:text-[52px]">
            Ready to start your project?
          </h2>

          <div className="mt-32 flex justify-center">
            <Link
              href="/contact"
              className="flex h-48 items-center justify-center bg-white px-32 font-sans text-[13px] text-ink transition-colors hover:bg-white/90"
            >
              Get in touch →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
