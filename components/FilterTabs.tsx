"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PROJECT_CATEGORIES, type CategoryFilter } from "@/constants/categories";

type FilterTabsProps = {
  active: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
};

export default function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div role="tablist" aria-label="Filter projects by category" className="flex flex-wrap gap-8">
      {PROJECT_CATEGORIES.map(({ value, label }) => {
        const isActive = value === active;

        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(value)}
            className={cn(
              // Pills are the one documented exception to the sharp-corner rule.
              // Inactive carries a 0.5px border; active carries a transparent one
              // of the same width so pills never resize as the selection moves.
              "relative rounded-full border-[0.5px] px-24 py-8 font-sans text-[12px] transition-colors",
              isActive
                ? "border-transparent text-white"
                : "border-stone text-stone hover:text-ink",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="filter-tab-active"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
