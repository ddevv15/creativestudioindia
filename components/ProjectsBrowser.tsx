"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import FilterTabs from "@/components/FilterTabs";
import ProjectCard from "@/components/ProjectCard";
import {
  PROJECT_CATEGORIES,
  type CategoryFilter,
} from "@/constants/categories";
import type { ProjectCardData } from "@/types/sanity";

type ProjectsBrowserProps = {
  projects: ProjectCardData[];
};

// Framer owns this grid end to end. Spec 22 asks GSAP for the card stagger, but
// running a GSAP stagger inside a subtree Framer is mounting and unmounting puts
// two engines on the same elements — the thing AGENTS.md forbids. The stagger is
// delivered here with staggerChildren instead, which keeps it to one engine.
const gridVariants: Variants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, staggerChildren: 0.05 },
  },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.25 } },
};

const cardVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0 },
};

export default function ProjectsBrowser({ projects }: ProjectsBrowserProps) {
  const [active, setActive] = useState<CategoryFilter>("all");

  const filtered = useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((project) => project.category === active),
    [projects, active],
  );

  const activeLabel =
    PROJECT_CATEGORIES.find((category) => category.value === active)?.label ??
    "All";

  return (
    <>
      <div className="bg-linen px-24 pb-64 md:px-48">
        <FilterTabs active={active} onChange={setActive} />

        <p className="mt-24 font-sans text-[12px] text-stone">
          Showing {filtered.length}{" "}
          {filtered.length === 1 ? "project" : "projects"} · {activeLabel}
        </p>
      </div>

      <section className="bg-offwhite px-24 py-96 md:px-48">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            variants={gridVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="grid grid-cols-1 gap-24 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((project, index) => (
              <motion.div key={project._id} variants={cardVariants}>
                <ProjectCard {...project} priority={index === 0} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="font-sans text-[14px] text-stone">
            No projects in this category yet.
          </p>
        )}
      </section>
    </>
  );
}
