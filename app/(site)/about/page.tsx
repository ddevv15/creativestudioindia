import Image from "next/image";
import { PortableText } from "@portabletext/react";
import SanityImage from "@/components/SanityImage";
import ScrollZoom from "@/components/ScrollZoom";
import TeamCard from "@/components/TeamCard";
import Statement from "@/components/sections/Statement";
import { SITE } from "@/constants/site";
import {
  getAllNowItems,
  getAllProjects,
  getAllTeamMembers,
  getSiteSettings,
} from "@/lib/content";
import { bannerProject } from "@/lib/banner";
import { pageMetadata } from "@/lib/seo";
import type { SanityImageObject } from "@sanity/image-url";
import type { NowType } from "@/types/sanity";

export const metadata = pageMetadata({
  title: "Studio | Creative Studio India",
  description:
    "Creative Studio India, an architecture studio in Ahmedabad led by principal designer Jignesh Patel.",
});

const PROCESS_STEPS = [
  {
    label: "Sketch",
    description:
      "Every project starts by hand — studies of light, section, and site long before anything is drawn to scale.",
  },
  {
    label: "Render",
    description:
      "The design is tested in three dimensions so the client sees the building before it is committed to.",
  },
  {
    label: "Build",
    description:
      "Documentation and site oversight carry the drawing through to a building that matches the intent.",
  },
];

const RECOGNITION_TYPES: NowType[] = ["award", "press"];

// "Sample" on every row, so no single entry reads as a real claim (client question 1.1).
const NOW_TYPE_LABELS: Partial<Record<NowType, string>> = {
  award: "Sample award",
  press: "Sample press",
};

const HEADING = "text-[32px] font-normal leading-[1.18] tracking-[-0.01em] text-ink md:text-[40px]";

/**
 * The Studio page as a monograph (direction in .impeccable/surfaces): a banner
 * with the page title, then the principal's portrait pinned in the left five
 * columns while his bio, his words, the process and the team scroll past on
 * the right. The portrait zooms slowly as that column scrolls.
 */
export default async function AboutPage() {
  const [siteSettings, teamMembers, nowItems, projects] = await Promise.all([
    getSiteSettings(),
    getAllTeamMembers(),
    getAllNowItems(),
    getAllProjects(),
  ]);

  const banner = bannerProject("about", projects);

  // The principal has the left column to himself; the team grid is everyone else.
  const team = teamMembers.filter((member) => member.department !== "leadership");

  const recognition = nowItems.filter((item) => RECOGNITION_TYPES.includes(item.type));

  // Two project photographs for render and build. The sketch step stays
  // text-only: the sketches in Sanity are still sample photos, not drawings
  // (client question 4.1). Restore `sketches[0]` here once real ones land.
  const processImages: ({ source: SanityImageObject; caption: string } | null)[] = [
    null,
    projects[0] ? { source: projects[0].coverImage, caption: projects[0].title } : null,
    projects[1] ? { source: projects[1].coverImage, caption: projects[1].title } : null,
  ];

  const photoUrl = siteSettings.principalPhoto?.asset?.url;

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
          Studio
        </h1>
      </section>

      <section data-zoom-track className="grid grid-cols-12 gap-x-[10px] gap-y-48 px-gutter py-64 lg:py-96">
        {photoUrl && (
          <div className="col-span-12 md:col-span-5">
            {/* Capped so the pinned frame always fits the viewport under the header. */}
            <figure className="md:sticky md:top-[calc(var(--nav-h)+24px)] md:max-w-[calc((100svh-var(--nav-h)-80px)*0.8)]">
              {/* Multiply blends the photo's white backdrop into the sheet colour; the
                  hairline keeps it a framed plate. Zooming from the top keeps the head in frame. */}
              <div className="relative aspect-[4/5] overflow-hidden border border-ink/15 bg-offwhite">
                <ScrollZoom to={1.15} className="absolute inset-0 origin-top mix-blend-multiply">
                  <Image
                    src={photoUrl}
                    alt="Jignesh Patel, principal designer"
                    fill
                    priority
                    sizes="(min-width: 768px) 42vw, 100vw"
                    className="object-cover"
                  />
                </ScrollZoom>
              </div>
              <figcaption className="caption-mono mt-8">Jignesh Patel, principal designer</figcaption>
            </figure>
          </div>
        )}

        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <h2 className={HEADING}>Jignesh Patel</h2>
          <p className="mt-8 text-[15px] text-stone">Principal Designer</p>

          {siteSettings.principalBio?.length > 0 && (
            <div className="mt-48 max-w-[560px] text-[16px] leading-[1.6] text-ink [&>p+p]:mt-16">
              <PortableText value={siteSettings.principalBio} />
            </div>
          )}

          {/* The page's one serif moment (DESIGN.md): the principal's own words. */}
          <figure data-reveal className="mt-96">
            <blockquote className="display-headline text-[40px] text-ink lg:text-[48px]">
              &ldquo;A building should still make sense to the people using it twenty years after we
              have stopped thinking about it.&rdquo;
            </blockquote>
            <figcaption className="caption-mono mt-24">Jignesh Patel</figcaption>
          </figure>

          <div data-reveal className="mt-96">
            <h2 className={HEADING}>Sketch, render, build.</h2>
            <ol className="mt-48">
              {PROCESS_STEPS.map((step, index) => {
                const image = processImages[index];

                return (
                  <li
                    key={step.label}
                    className="grid grid-cols-1 gap-x-[10px] gap-y-16 border-t border-ink/20 py-24 sm:grid-cols-6"
                  >
                    {/* Every step's text on one reading line at the column's left edge,
                        held well clear of the image beside it. */}
                    <div className="sm:col-span-3 sm:pr-48">
                      <h3 className="text-[22px] leading-[1.3] text-ink">{step.label}</h3>
                      <p className="mt-8 text-[15px] leading-[1.55] text-ink">
                        {step.description}
                      </p>
                    </div>
                    {image && (
                      <figure className="sm:col-span-3 sm:col-start-4">
                        <div className="relative aspect-[4/3] overflow-hidden bg-linen">
                          <SanityImage
                            source={image.source}
                            ratio={4 / 3}
                            alt={image.caption}
                            fill
                            sizes="(min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                        <figcaption className="caption-mono mt-8">{image.caption}</figcaption>
                      </figure>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          {team.length > 0 && (
            <div data-reveal className="mt-96">
              <h2 className={HEADING}>The team</h2>
              <div className="mt-48 grid grid-cols-2 gap-x-[10px] gap-y-32">
                {team.map((member) => (
                  <TeamCard key={member._id} member={member} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {recognition.length > 0 && (
        <section data-reveal className="grid grid-cols-12 gap-x-[10px] gap-y-24 px-gutter pb-64 lg:pb-96">
          <div className="col-span-12 md:col-span-5">
            <h2 className={HEADING}>Recognition</h2>
            {/* Client question 1.1: these are the build's sample entries until the studio sends real ones. */}
            <p className="caption-mono mt-16">Draft: sample entries, not yet confirmed by the studio.</p>
          </div>

          <ul className="col-span-12 md:col-span-6 md:col-start-7">
            {recognition.map((item) => (
              <li
                key={item._id}
                className="grid grid-cols-[96px_1fr] gap-x-[10px] gap-y-4 border-t border-ink/20 py-16 last:border-b"
              >
                <time dateTime={item.date} className="caption-mono pt-[3px]">
                  {new Date(item.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </time>
                <div>
                  <p className="text-[15px] leading-[1.55] text-ink">{item.title}</p>
                  <p className="caption-mono mt-4">{NOW_TYPE_LABELS[item.type] ?? item.type}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

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
