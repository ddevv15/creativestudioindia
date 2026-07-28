import { demoSiteSettings } from "@/lib/demoData";
import type { SiteSettings } from "@/types/sanity";

/** GROQ: *[_type == "siteSettings"][0] */
export async function getSiteSettings(): Promise<SiteSettings> {
  return demoSiteSettings;
}
