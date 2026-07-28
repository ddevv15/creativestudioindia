import type { ProjectCategory, ProjectStatus } from "@/types/sanity";

/**
 * Category values MUST match the option list in sanity/schemas/project.ts.
 * Filtering compares against the value; the UI only ever shows the label.
 */
export type CategoryFilter = ProjectCategory | "all";

/** Filter pills on /projects, in spec order. Labels are plural per spec 16. */
export const PROJECT_CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "bungalow", label: "Bungalows" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "mixed-use", label: "Mixed-Use" },
];

/** Singular labels for cards, tags, and spec rows. */
export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  bungalow: "Bungalow",
  residential: "Residential",
  commercial: "Commercial",
  "mixed-use": "Mixed-Use",
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  completed: "Completed",
  "under-construction": "Under Construction",
  concept: "Concept",
};

/** Project type options in the contact form (spec 21). */
export const INQUIRY_PROJECT_TYPES = [
  "Bungalow",
  "Residential",
  "Commercial",
  "Mixed-Use",
  "3D Visualization",
  "Other",
] as const;
