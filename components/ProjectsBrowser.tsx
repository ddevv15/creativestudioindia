"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import CardGlow from "@/components/CardGlow";
import FilterDropdown, { type FilterOption } from "@/components/FilterDropdown";
import ProjectGridCard from "@/components/ProjectGridCard";
import { PROJECT_CATEGORIES, STATUS_LABELS } from "@/constants/categories";
import { cn } from "@/lib/utils";
import type { ProjectGridItem, ProjectStatus } from "@/types/sanity";

/*
 * The /projects browser, after zha.com/projects: multi-select filter dropdowns,
 * "Clear all" and a live count, then a ruled grid built from blocks of six.
 * One large card (2×2) sits beside four small ones, and the large card swaps
 * sides every block. Below lg the grid steps down to two columns, then one.
 *
 * Framer owns the grid's motion end to end (one engine, per AGENTS.md): the
 * whole grid swaps on a filter change and the cards stagger in.
 */

const BLOCK = 6;

/** Within a filter, any ticked value matches (OR); across filters, all must (AND). */
function matches(project: ProjectGridItem, typeFilter: string[], statusFilter: string[]) {
  return (
    (typeFilter.length === 0 || typeFilter.includes(project.category)) &&
    (statusFilter.length === 0 || (project.status !== undefined && statusFilter.includes(project.status)))
  );
}

const gridVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.04 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function ProjectsBrowser({ projects }: { projects: ProjectGridItem[] }) {
  const reduce = useReducedMotion();
  const [types, setTypes] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  // The glow canvas lives beside the grid, not in it, so it survives the
  // grid being swapped out on a filter change.
  const glowAreaRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => projects.filter((project) => matches(project, types, statuses)),
    [projects, types, statuses]
  );

  // Each option's count respects the other dropdown's selection, so a number
  // always says what you'd get by ticking it.
  const typeOptions: FilterOption[] = PROJECT_CATEGORIES.filter((c) => c.value !== "all").map((c) => ({
    value: c.value,
    label: c.label,
    count: projects.filter((p) => p.category === c.value && matches(p, [], statuses)).length,
  }));
  const statusOptions: FilterOption[] = (Object.keys(STATUS_LABELS) as ProjectStatus[]).map((value) => ({
    value,
    label: STATUS_LABELS[value],
    count: projects.filter((p) => p.status === value && matches(p, types, [])).length,
  }));

  const hasFilters = types.length > 0 || statuses.length > 0;
  const clearAll = () => {
    setTypes([]);
    setStatuses([]);
  };

  const cardVariants: Variants = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" },
    animate: {
      opacity: 1,
      transform: "translateY(0px)",
      transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <>
      <div className="px-gutter pb-32 pt-32">
        <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
          <FilterDropdown label="Typology" options={typeOptions} selected={types} onChange={setTypes} />
          <FilterDropdown label="Construction status" options={statusOptions} selected={statuses} onChange={setStatuses} />
        </div>

        <div className="mt-16 flex items-center gap-24 text-[12px] uppercase tracking-[0.04em]">
          <button
            type="button"
            onClick={clearAll}
            disabled={!hasFilters}
            className="min-h-[32px] underline decoration-1 underline-offset-4 transition-opacity duration-150 disabled:no-underline disabled:opacity-40"
          >
            Clear all
          </button>
          <p aria-live="polite" className="font-mono text-stone">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"}
          </p>
        </div>
      </div>

      <section aria-label="Projects" className="px-gutter pb-96">
        <div ref={glowAreaRef} className="relative">
          <CardGlow containerRef={glowAreaRef} />
          <AnimatePresence mode="wait" initial={false}>
            {filtered.length > 0 && (
              <motion.div
                key={`${types.join(",")}|${statuses.join(",")}`}
                variants={gridVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                // Rules come from each cell's right and bottom border plus the
                // grid's top and left, so a short last row leaves blank space, not
                // grey filler.
                className="relative z-[1] grid grid-cols-1 border-l border-t border-ink/15 md:grid-cols-2 lg:grid-flow-dense lg:grid-cols-4"
              >
                {filtered.map((project, index) => {
                  const large = index % BLOCK === 0;
                  const flipped = Math.floor(index / BLOCK) % 2 === 1;
                  return (
                    <motion.div
                      key={project._id}
                      data-glow-cell
                      variants={cardVariants}
                      className={cn(
                        "border-b border-r border-ink/15",
                        large && "md:col-span-2 lg:row-span-2",
                        large && flipped && "lg:col-start-3"
            )}
                  >
                    <ProjectGridCard project={project} large={large} priority={index === 0} />
                  </motion.div>
                );
              })}
            </motion.div>
            )}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="border border-ink/15 px-24 py-64 text-center">
            <p className="text-[17px] text-ink">No projects match these filters.</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-16 text-[13px] underline decoration-1 underline-offset-4 hover:text-stone"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}
