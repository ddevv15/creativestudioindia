import { sanityFetch } from "@/lib/sanity/client";
import * as queries from "@/lib/sanity/queries";
import type { SiteSettings } from "@/types/sanity";

/**
 * siteSettings is a singleton: `*[_type == "siteSettings"][0]` returns null
 * until someone publishes it in the Studio. Every other content function can
 * return an empty array and the page still renders — this one cannot, because
 * app/(site)/page.tsx reads siteSettings.heroHeadline, .heroMedia,
 * .principalPhoto and .principalBio without guarding any of them.
 *
 * So the null case needs an explicit policy. See handleMissingSiteSettings().
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await sanityFetch<SiteSettings | null>({
    query: queries.getSiteSettings,
  });

  return settings ?? handleMissingSiteSettings();
}

/**
 * Policy: fail fast. Resolved once the production dataset was seeded — before
 * that, "no siteSettings" was the dataset's normal state and throwing meant the
 * home page was permanently down, which made a demoData fallback look
 * attractive. It no longer is.
 *
 * A published siteSettings document now exists (id `siteSettings`, pinned as a
 * singleton in sanity/structure.ts). So reaching this function means one of:
 * wrong projectId/dataset in the environment, a deleted singleton, or a
 * perspective mistake — all misconfigurations, none of them a content gap the
 * studio can fix by typing. Those should be loud.
 *
 * The two rejected alternatives, and why:
 *
 * - Fall back to demoSiteSettings. Ships placeholder copy that looks correct
 *   and nobody notices for weeks. The placeholder content now lives in the
 *   Studio instead, where it is visible and editable by the studio — which is
 *   the same safety net without the invisibility.
 * - Return an empty shape and let sections render empty states. Hero.tsx reads
 *   heroMedia.asset.mimeType and FounderBlock reads principalPhoto unguarded,
 *   so this needs component changes to be safe, and buys nothing over failing
 *   loudly on a misconfiguration.
 */
function handleMissingSiteSettings(): SiteSettings {
  throw new Error(
    "No published siteSettings document found. Check NEXT_PUBLIC_SANITY_PROJECT_ID " +
      "and NEXT_PUBLIC_SANITY_DATASET, then confirm the singleton exists at /studio.",
  );
}
