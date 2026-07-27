import { createClient } from "next-sanity";

// Fallbacks keep createClient() from throwing when Sanity env vars are unset
// (e.g. the temporary demo build). Real env values take precedence when present.
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "demo",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-06-20",
  useCdn: true,
});
