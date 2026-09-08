/**
 * The content layer — the single seam between the site and its data source.
 *
 * Page components import from here and never from lib/sanity/client.ts,
 * lib/sanity/queries.ts, or lib/demoData.ts. Each function below now reads from
 * Sanity via sanityFetch(); the signatures are unchanged from the demo-data
 * era, which is why no page component moved on the swap.
 */

export {
  getAllProjects,
  getAllProjectSlugs,
  getFeaturedProjects,
  getProjectBySlug,
  getRelatedProjects,
} from "./projects";
export { getAllSketches } from "./sketches";
export { getAllTeamMembers } from "./team";
export { getAllNowItems } from "./now";
export { getSiteSettings } from "./settings";
