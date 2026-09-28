import type { ProjectCategory, ProjectStatus } from "@/types/sanity";

/**
 * Category values MUST match the option list in sanity/schemas/project.ts.
 * Filtering compares against the value; the UI only ever shows the label.
 */
export type CategoryFilter = ProjectCategory | "all";

/**
 * Filter pills on /projects. Ordered the way the client orders their own
 * project list and photography folders (Commercial, Mixed Use, Residential,
 * Institutional, Private Residence, Weekend Villa) rather than the original
 * spec 16 order, so the site reads the way they think about their work.
 *
 * Labels are plural per spec 16. "Private Residences" and "Weekend Villas"
 * replaced the single "Bungalows" pill when the category was split.
 */
export const PROJECT_CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "commercial", label: "Commercial" },
  { value: "mixed-use", label: "Mixed-Use" },
  { value: "residential", label: "Residential" },
  { value: "institutional", label: "Institutional" },
  { value: "private-residence", label: "Private Residences" },
  { value: "weekend-villa", label: "Weekend Villas" },
];

/** Singular labels for cards, tags, and spec rows. */
export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  commercial: "Commercial",
  "mixed-use": "Mixed-Use",
  residential: "Residential",
  institutional: "Institutional",
  "private-residence": "Private Residence",
  "weekend-villa": "Weekend Villa",
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
