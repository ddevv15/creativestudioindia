/**
 * ONE-TIME dataset bootstrap. Run with:
 *
 *   set -a; source .env.local; set +a
 *   npx sanity exec scripts/seed.ts --with-user-token
 *
 * Lifts the content in lib/demoData.ts into real Sanity documents, uploading
 * the local files in public/demo as real assets along the way.
 *
 * Why a script and not hand-entry in the Studio: siteSettings alone has eight
 * required fields including a file and a Portable Text body, and there are 6
 * projects with 5-image galleries each. Typing that in is an hour of work that
 * produces a worse result than the copy already written and reviewed here.
 *
 * DELETE THIS FILE together with lib/demoData.ts once the studio has replaced
 * the placeholder content. It imports demoData, so the two must die together.
 *
 * Idempotency: this script refuses to run against a non-empty dataset rather
 * than trying to reconcile. Re-seeding is not a workflow we want — once the
 * client edits a document in the Studio, the Studio is the source of truth and
 * a second run would only ever create duplicates.
 */

import { createReadStream } from "node:fs";
import { join } from "node:path";
import { getCliClient } from "sanity/cli";

import {
  demoNowItems,
  demoProjects,
  demoSketches,
  demoSiteSettings,
  demoTeamMembers,
} from "../lib/demoData";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET are not set. " +
      "Run `set -a; source .env.local; set +a` before `npx sanity exec`.",
  );
}

const client = getCliClient({ projectId, dataset });

const PUBLIC_DIR = join(__dirname, "..", "public");

/** Sanity asset reference, as it appears inside an image or file field. */
type AssetRef = { _type: "reference"; _ref: string };

/**
 * Pull the local file path back out of a demo media object.
 *
 * demoData uses two shapes for this, and both have to be handled. Projects and
 * sketches go through demoImage(), which produces `{ _demoUrl }`. demoSiteSettings
 * writes `{ asset: { url } }` directly instead, because types/sanity.ts declares
 * principalPhoto/heroMedia as SanityImage/SanityFile — plain `{asset:{url}}` —
 * rather than SanityImageObject, so demoImage()'s cast would not typecheck there.
 *
 * Reading only `_demoUrl` silently drops every siteSettings image.
 */
function demoUrlOf(value: unknown): string | undefined {
  const media = value as
    | { _demoUrl?: string; asset?: { url?: string } }
    | undefined;
  const url = media?._demoUrl ?? media?.asset?.url;
  return url ? url : undefined;
}

/**
 * Upload each distinct local file exactly once. The six demo projects cycle
 * three photographs across their galleries, so without this cache we would
 * upload project-1.jpg eleven times and leave eleven unrelated asset documents
 * for the client to wade through in the media browser.
 */
const uploads = new Map<string, Promise<AssetRef>>();

function uploadAsset(kind: "image" | "file", publicPath: string) {
  const key = `${kind}:${publicPath}`;
  const cached = uploads.get(key);
  if (cached) return cached;

  const pending = (async (): Promise<AssetRef> => {
    const filename = publicPath.split("/").pop()!;
    const absolute = join(PUBLIC_DIR, publicPath.replace(/^\//, ""));
    console.log(`  ↑ ${kind} ${publicPath}`);
    const asset = await client.assets.upload(
      kind as "image",
      createReadStream(absolute),
      { filename },
    );
    return { _type: "reference", _ref: asset._id };
  })();

  uploads.set(key, pending);
  return pending;
}

/** `{ _demoUrl }` → a real image field, or undefined when there is no file. */
async function imageField(value: unknown) {
  const url = demoUrlOf(value);
  if (!url) return undefined;
  return { _type: "image" as const, asset: await uploadAsset("image", url) };
}

async function main() {
  const existing = await client.fetch<number>(
    `count(*[!(_id in path("_.**"))])`,
  );
  if (existing > 0) {
    throw new Error(
      `Dataset "${dataset}" already holds ${existing} document(s). ` +
        "Seeding is a one-time bootstrap — refusing to run so it cannot " +
        "duplicate content the studio has already edited.",
    );
  }

  console.log(`Seeding ${projectId}/${dataset}…`);

  // --- Projects first: sketches and now-items reference them by _id. --------
  console.log("Projects");
  const projectIdBySlug = new Map<string, string>();

  for (const demo of demoProjects) {
    const coverImage = await imageField(demo.coverImage);

    const gallery = await Promise.all(
      demo.gallery.map(async (item) => ({
        _type: "image" as const,
        // Reuse the demo _key so array item identity is stable if this is
        // ever re-run against a fresh dataset.
        _key: item._key,
        asset: await uploadAsset("image", demoUrlOf(item)!),
        ...(item.caption ? { caption: item.caption } : {}),
      })),
    );

    const created = await client.create({
      _type: "project",
      title: demo.title,
      // The demo shape flattens slug to a string; the schema wants the object.
      slug: { _type: "slug", current: demo.slug },
      headline: demo.headline,
      category: demo.category,
      ...(coverImage ? { coverImage } : {}),
      gallery,
      description: demo.description,
      location: demo.location,
      year: demo.year,
      area: demo.area,
      status: demo.status,
      featured: demo.featured ?? false,
      order: demo.order,
      ...(demo.seo ? { seo: demo.seo } : {}),
    });

    projectIdBySlug.set(demo.slug, created._id);
    console.log(`  ✓ ${demo.title}`);
  }

  /** Resolve a demo `relatedProject: { slug }` into a real reference. */
  function projectRef(related?: { slug: string }) {
    if (!related) return undefined;
    const id = projectIdBySlug.get(related.slug);
    if (!id) {
      console.warn(`  ! no project for slug "${related.slug}" — link dropped`);
      return undefined;
    }
    return { _type: "reference" as const, _ref: id };
  }

  // --- Site settings: fixed _id, matching the singleton in sanity/structure.ts
  console.log("Site settings");
  // No `?? "/demo/hero.jpg"` fallback here on purpose: a default would have
  // hidden the demoUrlOf() bug that dropped principalPhoto and the OG image.
  const heroUrl = demoUrlOf(demoSiteSettings.heroMedia);
  if (!heroUrl) throw new Error("demoSiteSettings.heroMedia has no local file");
  await client.create({
    // The one document that must NOT get a generated id: structure.ts pins the
    // Studio's "Site Settings" pane to documentId("siteSettings").
    _id: "siteSettings",
    _type: "siteSettings",
    studioName: demoSiteSettings.studioName,
    heroHeadline: demoSiteSettings.heroHeadline,
    // heroMedia is schema type `file`, so this needs a file asset, not an image
    // asset — the two live in different asset document types.
    heroMedia: { _type: "file", asset: await uploadAsset("file", heroUrl) },
    principalBio: demoSiteSettings.principalBio,
    principalPhoto: await imageField(demoSiteSettings.principalPhoto),
    phone: demoSiteSettings.phone,
    email: demoSiteSettings.email,
    address: demoSiteSettings.address,
    instagramUrl: demoSiteSettings.instagramUrl,
    linkedinUrl: demoSiteSettings.linkedinUrl,
    defaultSeo: {
      metaTitle: demoSiteSettings.defaultSeo?.metaTitle,
      metaDescription: demoSiteSettings.defaultSeo?.metaDescription,
      ogImage: await imageField(demoSiteSettings.defaultSeo?.ogImage),
    },
  });
  console.log("  ✓ siteSettings");

  // --- Sketches -------------------------------------------------------------
  console.log("Sketches");
  for (const [i, demo] of demoSketches.entries()) {
    const relatedProject = projectRef(demo.relatedProject);
    await client.create({
      _type: "sketch",
      title: demo.title,
      image: await imageField(demo.image),
      year: demo.year,
      order: i + 1,
      ...(relatedProject ? { relatedProject } : {}),
    });
    console.log(`  ✓ ${demo.title}`);
  }

  // --- Team -----------------------------------------------------------------
  // `photo` is deliberately omitted: no portrait photography exists yet, and
  // the demo objects carry an empty url. Leaving the field unset makes the
  // Studio flag each member as incomplete, which is the correct prompt for the
  // client. TeamCard already falls back to a typographic placeholder.
  console.log("Team");
  for (const demo of demoTeamMembers) {
    await client.create({
      _type: "teamMember",
      name: demo.name,
      role: demo.role,
      department: demo.department,
      bio: demo.bio,
      order: demo.order,
    });
    console.log(`  ✓ ${demo.name}`);
  }

  // --- Now ------------------------------------------------------------------
  console.log("Now");
  for (const demo of demoNowItems) {
    const relatedProject = projectRef(demo.relatedProject);
    await client.create({
      _type: "now",
      title: demo.title,
      type: demo.type,
      date: demo.date,
      body: demo.body,
      ...(relatedProject ? { relatedProject } : {}),
    });
    console.log(`  ✓ ${demo.title}`);
  }

  const total = await client.fetch<number>(`count(*[!(_id in path("_.**"))])`);
  console.log(`\nDone — ${total} documents in ${projectId}/${dataset}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
