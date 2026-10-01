"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import FlexCarousel from "@/components/FlexCarousel";
import ProjectCard from "@/components/ProjectCard";
import { urlFor } from "@/lib/sanity/image";
import { CATEGORY_LABELS } from "@/constants/categories";
import type { ProjectCardData } from "@/types/sanity";

type ProjectsCarouselProps = {
  projects: ProjectCardData[];
};

/** Scroll, in viewports, spent on each project as the row passes. */
const RUNWAY_PER_PROJECT = 0.4;

/** Tailwind's lg. The WebGL carousel and the pinned scrub start here. */
const DESKTOP_MIN = 1024;
const DESKTOP_QUERY = `(min-width: ${DESKTOP_MIN}px)`;

/**
 * Section 02, straight after the hero. Replaces the 3-card grid of spec 10.
 *
 * The choreography, top to bottom:
 *
 *   in   — the hero's photograph dims back into Ink (HeroScrollExpand owns
 *          that), so this section arrives on the same black the hero opened
 *          on. The headline fades up; the cards rise out of the black once
 *          most of the stage is on screen (FlexCarousel's own intro).
 *   hold — the stage pins and page scroll walks the row from the first
 *          project to the last.
 *   out  — the section after this one slides up over the pinned stage like a
 *          sheet while the stage recedes and dims under it. That overlap is a
 *          negative margin on the page wrapper (see app/(site)/page.tsx), so
 *          the last viewport of this track is runway for it.
 *
 * Track height is therefore one viewport of stage, the scrub runway, and one
 * viewport of exit. It is set in CSS, not measured, so the server markup is
 * already the right height and nothing below jumps on hydration.
 *
 * Reduced motion: no pin, no scrub, no exit — the section is one viewport and
 * the row is moved by drag, keys or clicks like any carousel.
 *
 * Below lg none of the above happens: the section is an ordinary block with a
 * native swipe row of ProjectCards, and the page scrolls straight past it.
 */
export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const router = useRouter();
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number | null>(null);

  // The WebGL carousel is only mounted where it works. Below it, a single card
  // is wider than the screen and sits entirely inside the bent edge, so the
  // visitor never sees a project undistorted — and a phone pays for a WebGL
  // context under a pinned scroll. Decided on the client, so the server and
  // phones never create the canvas; the swipe row below is plain CSS and is
  // already right in the server markup.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setIsDesktop(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const items = useMemo(
    () =>
      projects.map((project) => ({
        // Cropped to 3:2 at the CDN — the locked project card ratio — and
        // drawn at the card's natural aspect, so every card is 3:2.
        src: urlFor(project.coverImage)
          .width(1200)
          .height(800)
          .fit("crop")
          .auto("format")
          .url(),
        alt: project.title,
        title: project.title,
        subtitle: CATEGORY_LABELS[project.category],
      })),
    [projects],
  );

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const head = headRef.current;
    const row = rowRef.current;
    if (!track || !stage || !head || !row) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(head.children, {
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: { trigger: track, start: "top 60%" },
      });
    });

    // Small screens: the swipe row's cards stagger in, the same entrance as
    // the project grids elsewhere on the site.
    mm.add(
      `(prefers-reduced-motion: no-preference) and (max-width: ${DESKTOP_MIN - 1}px)`,
      () => {
        gsap.from(row.children, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: { trigger: row, start: "top 80%" },
        });
      },
    );

    mm.add(`(prefers-reduced-motion: no-preference) and ${DESKTOP_QUERY}`, () => {
      // Scrub: first project at the moment the stage pins, last project one
      // viewport before the track ends — the exit runway is not part of it.
      ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom 200%",
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
        onRefresh: (self) => {
          progressRef.current = self.progress;
        },
      });

      // Pushed back and dimmed as the next section covers it. Origin above
      // centre, so it reads as receding away from the sheet, not into it.
      gsap.to(stage, {
        scale: 0.94,
        opacity: 0.35,
        transformOrigin: "50% 30%",
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "bottom 200%",
          end: "bottom bottom",
          scrub: true,
        },
      });

      return () => {
        progressRef.current = null;
      };
    });

    return () => mm.revert();
  }, []);

  if (!projects.length) return null;

  return (
    <section
      ref={trackRef}
      aria-labelledby="projects-heading"
      // The pinned track height is desktop only. Below lg, and with reduced
      // motion, the section is just as tall as its content.
      className="relative bg-ink lg:h-[calc(100dvh*(2+var(--runway)))] motion-reduce:lg:h-auto"
      style={
        {
          "--runway": projects.length * RUNWAY_PER_PROJECT,
        } as CSSProperties
      }
    >
      <div
        ref={stageRef}
        className="flex flex-col py-96 lg:sticky lg:top-0 lg:h-[100dvh] lg:overflow-hidden lg:pb-48 lg:pt-nav"
      >
        <div ref={headRef} className="px-24 md:px-48 lg:pt-32">
          <p className="section-label !text-white/70">02 / Projects</p>
          <h2
            id="projects-heading"
            className="display-headline mt-16 text-[40px] text-white"
          >
            From concept to creation.
          </h2>
        </div>

        {isDesktop ? (
          <FlexCarousel
            items={items}
            progressRef={progressRef}
            preset="liquid"
            intro="rise"
            fit="natural"
            cardHeight={0.56}
            gap={24}
            radius={0}
            // Clicking the centred card opens it; clicking any other brings it
            // to the centre first. Focus-zoom is off because a click navigates.
            focusOnClick={false}
            // Page scroll must stay page scroll, even with the cursor over the
            // canvas. Page scroll is what moves the row.
            captureWheel={false}
            onSelect={(index) =>
              router.push(`/projects/${projects[index].slug}`)
            }
            className="min-h-0 flex-1 text-white"
          />
        ) : null}

        {/*
          Below lg: a native swipe row. Each card is 85% of the row so the next
          one peeks in, which is the only "you can swipe this" hint needed.
          Snap points start at the page gutter, matching the headline above.
        */}
        <div
          ref={rowRef}
          className="mt-48 flex snap-x snap-mandatory gap-16 overflow-x-auto scroll-px-24 px-24 [scrollbar-width:none] md:scroll-px-48 md:px-48 lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="w-[85%] shrink-0 snap-start md:w-[60%]"
            >
              <ProjectCard {...project} priority={index === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
