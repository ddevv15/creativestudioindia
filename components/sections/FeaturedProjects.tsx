"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import ProjectCard from "@/components/ProjectCard";
import type { ProjectCardData } from "@/types/sanity";

type FeaturedProjectsProps = {
  projects: ProjectCardData[];
};

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".project-card");
    if (!cards?.length) return;

    const tween = gsap.from(cards, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 80%",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className="bg-offwhite px-24 py-96 md:px-48">
      <p className="section-label">02 / Projects</p>

      <h2 className="display-headline mt-16 text-[40px] text-ink">
        From concept to creation.
      </h2>

      <div
        ref={gridRef}
        className="mt-48 grid grid-cols-1 gap-24 md:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <ProjectCard key={project._id} {...project} />
        ))}
      </div>

      <Link
        href="/projects"
        className="mt-48 inline-block font-sans text-[13px] text-ink underline-offset-4 hover:underline"
      >
        View all projects →
      </Link>
    </section>
  );
}
