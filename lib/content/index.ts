/**
 * The content layer — the single seam between the site and its data source.
 *
 * Page components import from here and never from lib/demoData.ts. Today these
 * functions return demo data; when the Sanity project is provisioned each body
 * becomes a client.fetch() using the GROQ already written in
 * lib/sanity/queries.ts. Signatures are async and shaped to match the eventual
 * Sanity return, so no page component changes on that day.
 */

export {
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getRelatedProjects,
} from "./projects";
export { getAllSketches } from "./sketches";
export { getAllTeamMembers } from "./team";
export { getAllNowItems } from "./now";
export { getSiteSettings } from "./settings";
