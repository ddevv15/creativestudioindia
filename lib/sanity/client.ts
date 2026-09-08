import { createClient, type QueryParams } from "next-sanity";

/**
 * Read each variable as a LITERAL `process.env.X` member expression, never
 * `process.env[someVariable]`.
 *
 * Next and Turbopack put NEXT_PUBLIC_* values into the browser bundle by
 * statically replacing literal member expressions at build time. A computed
 * lookup is invisible to that pass, so it survives into the browser as a
 * property read against an object that has no such key, and the value is
 * undefined no matter what the environment holds.
 *
 * That matters here because this module is not server only. `lib/sanity/image.ts`
 * imports `client` to build the image URL builder, and five client components
 * import that (ProjectCard, TeamCard, SketchCard, ProjectGallery, SketchesStrip),
 * so this file evaluates in the browser too. When the lookup came back undefined
 * the guard below threw while the module was still evaluating, which took down
 * every page rendering one of those components. The server was unaffected, so
 * the routes still answered 200 and only a real browser showed it.
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

/**
 * Fail loudly at module load if the project is unconfigured. The previous
 * `|| "demo"` fallbacks let a misconfigured deploy boot and then 404 every
 * query, which reads as "the CMS is empty" rather than "the env is missing".
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

export const client = createClient({
  projectId: required("NEXT_PUBLIC_SANITY_PROJECT_ID", projectId),
  dataset: required("NEXT_PUBLIC_SANITY_DATASET", dataset),
  apiVersion: "2026-06-20",
  useCdn: true,
  // Never let an unpublished draft reach the public site.
  perspective: "published",
});

/**
 * The one place the site talks to the Content Lake.
 *
 * Caching is belt-and-braces: `revalidate` is the safety net, and the GROQ
 * webhook at app/api/revalidate/route.ts calls revalidatePath() for instant
 * updates on publish. If the webhook is ever misconfigured the site goes stale
 * by at most an hour instead of forever, which is the failure mode we want on a
 * marketing site.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 3600,
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
}): Promise<T> {
  return client.fetch<T>(query, params, { next: { revalidate } });
}

/**
 * Uncached, CDN-bypassing read for build-time work such as
 * generateStaticParams and sitemap generation, where a stale CDN response would
 * bake a missing route into the build output.
 */
export async function sanityFetchFresh<T>({
  query,
  params = {},
}: {
  query: string;
  params?: QueryParams;
}): Promise<T> {
  return client
    .withConfig({ useCdn: false })
    .fetch<T>(query, params, { next: { revalidate: 0 } });
}
