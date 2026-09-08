import Image from "next/image";
import { PortableText } from "@portabletext/react";
import TeamCard from "@/components/TeamCard";
import {
  getAllNowItems,
  getAllProjects,
  getAllSketches,
  getAllTeamMembers,
  getSiteSettings,
} from "@/lib/content";
import { urlFor } from "@/lib/sanity/image";
import { pageMetadata } from "@/lib/seo";
import type { NowType } from "@/types/sanity";

export const metadata = pageMetadata({
  title: "Studio | Creative Studio India",
  description:
    "Creative Studio India — 25 years of intentional architecture in Ahmedabad, led by principal architect Jignesh Patel.",
});

const PROCESS_STEPS = [
  {
    number: "01",
    label: "Sketch",
    description:
      "Every project starts by hand — studies of light, section, and site long before anything is drawn to scale.",
  },
  {
    number: "02",
    label: "Render",
    description:
      "The design is tested in three dimensions so the client sees the building before it is committed to.",
  },
  {
    number: "03",
    label: "Build",
    description:
      "Documentation and site oversight carry the drawing through to a building that matches the intent.",
  },
];

const RECOGNITION_TYPES: NowType[] = ["award", "press"];

const NOW_TYPE_LABELS: Partial<Record<NowType, string>> = {
  award: "Award",
  press: "Press",
};

export default async function AboutPage() {
  const [siteSettings, teamMembers, nowItems, projects, sketches] =
    await Promise.all([
      getSiteSettings(),
      getAllTeamMembers(),
      getAllNowItems(),
      getAllProjects(),
      getAllSketches(),
    ]);

  const recognition = nowItems.filter((item) =>
    RECOGNITION_TYPES.includes(item.type),
  );

  // Process imagery: a sketch, then two project photographs standing in for the
  // render and build stages. Falls back to a linen block when unavailable.
  const processImages = [
    sketches[0] ? urlFor(sketches[0].image).width(800).height(600).fit("crop").url() : null,
    projects[0] ? urlFor(projects[0].coverImage).width(800).height(600).fit("crop").url() : null,
    projects[1] ? urlFor(projects[1].coverImage).width(800).height(600).fit("crop").url() : null,
  ];

  return (
    <>
      {/* pt-nav-80, not py-[80px]: the nav is fixed and solid on this route, so a
          bare 80px put the "Studio" label behind the bar. Spec 18's 80px is
          preserved as the visible gap below the nav. */}
      <section className="bg-linen px-24 pb-[80px] pt-nav-80 md:px-48">
        <p className="section-label">Studio</p>

        <h1 className="display-headline mt-16 text-[56px] text-ink">
          25 years of intentional design.
        </h1>
      </section>

      <section className="bg-offwhite px-24 py-96 md:px-48">
        <div className="mx-auto max-w-[680px] text-center font-sans text-[17px] leading-[1.75] text-stone [&>p]:mb-24 [&>p:last-child]:mb-0">
          <PortableText value={siteSettings.principalBio.slice(0, 2)} />
        </div>
      </section>

      <section className="bg-linen">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative aspect-[4/5]">
            <Image
              src={siteSettings.principalPhoto.asset.url}
              alt="Jignesh Patel, principal architect"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col px-24 py-64 md:px-48 lg:justify-center lg:px-64 lg:py-0">
            <p className="section-label">Principal</p>

            <h2 className="display-headline mt-16 text-[40px] text-ink">
              Jignesh Patel
            </h2>

            <p className="mt-8 font-sans text-[13px] uppercase tracking-wider text-stone">
              Principal Architect · B.Arch, CEPT · Council of Architecture
            </p>

            <blockquote className="mt-32 border-l-[0.5px] border-stone/40 pl-24 font-sans text-[17px] leading-[1.75] text-stone">
              &ldquo;A building should still make sense to the people using it
              twenty years after we have stopped thinking about it.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      <section className="bg-charcoal px-24 py-96 md:px-48">
        <p className="section-label !text-white/40">Process</p>

        <h2 className="display-headline mt-16 text-[40px] text-white">
          Sketch, render, build.
        </h2>

        <div className="mt-48 grid grid-cols-1 gap-32 md:grid-cols-3">
          {PROCESS_STEPS.map((step, index) => {
            const image = processImages[index];

            return (
              <div key={step.number}>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {image ? (
                    <Image
                      src={image}
                      alt={`${step.label} stage`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-linen/10" />
                  )}
                </div>

                <p className="mt-24 font-sans text-[11px] uppercase tracking-[0.07em] text-white/40">
                  {step.number}
                </p>

                <h3 className="mt-8 font-sans text-[18px] font-medium text-white">
                  {step.label}
                </h3>

                <p className="mt-8 font-sans text-[14px] leading-[1.7] text-white/60">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-offwhite px-24 py-96 md:px-48">
        <h2 className="display-headline text-[40px] text-ink">
          The team behind the work.
        </h2>

        <div className="mt-48 grid grid-cols-2 gap-24 md:grid-cols-3 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <TeamCard key={member._id} member={member} />
          ))}
        </div>
      </section>

      {recognition.length > 0 && (
        <section className="bg-linen px-24 py-96 md:px-48">
          <h2 className="display-headline text-[40px] text-ink">
            Recognition.
          </h2>

          <div className="mt-48 flex flex-col gap-16">
            {recognition.map((item) => (
              <article
                key={item._id}
                className="border-[0.5px] border-stone/20 bg-offwhite p-24"
              >
                <div className="flex flex-wrap items-center gap-16">
                  <span className="border-[0.5px] border-stone/40 px-8 py-4 font-sans text-[11px] uppercase tracking-wider text-stone">
                    {NOW_TYPE_LABELS[item.type] ?? item.type}
                  </span>

                  <time
                    dateTime={item.date}
                    className="font-sans text-[12px] text-stone"
                  >
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>

                <h3 className="mt-16 font-sans text-[16px] font-medium text-ink">
                  {item.title}
                </h3>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
