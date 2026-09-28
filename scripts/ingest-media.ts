/**
 * Ingest the client's project photography into Sanity.
 *
 *   set -a; source .env.local; set +a
 *   npx sanity exec scripts/ingest-media.ts --with-user-token          # dry run
 *   npx sanity exec scripts/ingest-media.ts --with-user-token -- --write
 *   npx sanity exec scripts/ingest-media.ts --with-user-token -- --write --force
 *
 * Reads public/02 - Projects/, downscales each photo, uploads it as a Sanity
 * asset, and points the matching project document's coverImage + gallery at
 * the results. The local folder is gitignored staging only; Sanity's CDN is
 * where the media actually lives.
 *
 * DESIGNED TO BE RE-RUN. The client is still filling those folders in — 16 of
 * 70 projects had photos at the time of writing. Each run picks up whatever is
 * newly populated and skips documents that already have a gallery, so the
 * normal workflow is "client drops in more photos, run it again".
 *
 * Writes to drafts, never to published documents. Publishing stays a human
 * decision in the Studio, because most of these documents are still missing
 * the required headline and would go live as blank cards.
 */

import { readdirSync, statSync, createReadStream } from "node:fs";
import { unlink, mkdtemp } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { tmpdir } from "node:os";

import { getCliClient } from "sanity/cli";
import sharp from "sharp";

const WRITE = process.argv.includes("--write");
const FORCE = process.argv.includes("--force");

const MEDIA_ROOT = join(__dirname, "..", "public", "02 - Projects");

/**
 * Longest edge, in pixels, of what we upload.
 *
 * The originals are 20-49MB camera and render output. Sanity would accept them
 * as-is and serve derivatives just fine, but every byte counts against the
 * project's asset storage quota and the uploads themselves take minutes each
 * over a normal connection. 4000px is still larger than any derivative the
 * site requests (the biggest is the 2560px hero in HeroScrollExpand), so
 * nothing downstream can tell the difference.
 */
const MAX_EDGE = 4000;
const JPEG_QUALITY = 82;

/**
 * Folder name -> project slug, for the folders whose name does not slugify to
 * the slug already in Sanity. Those slugs come from the PROJECT NAME column of
 * the client's spreadsheet, which does not always match how they named the
 * photo folder.
 *
 * Anything not listed here is slugified from the folder name (minus its
 * numeric prefix) and must resolve to a real document, or the run aborts.
 * Guessing is not acceptable: filing a villa's photos under a shopping mall is
 * far worse than a failed run.
 */
const SLUG_OVERRIDES: Record<string, string> = {
  "Shree Tapasavi Icon": "shree-tapsavi-icon",
  "Shree Tapasavi Farm": "shree-tapsavi-farm-la-arriba",
  "Pehel Lakeview": "pehel-lake-view",
  "Front Forever 2": "forever-front-2",
  "Kasturba Apartments": "kasturba-apartment",
  "Bunglows at Nikol": "nikol-bunglows",
  "Gravity by Nakshatra": "gravity",
  "SNS Pride": "sns-priide",
  "Hiren Soni": "hirenbhai-soni",
  "BK_s": "bhavesh-kothia",
  "Chaka Maharaj": "chaka-mahraj",
  "Into the Oasis": "into-the-oasis-jigneshbhai-sharnay",
};

/** Strip the client's "07_" ordering prefix off a folder name. */
function stripPrefix(name: string): string {
  return name.replace(/^\d+[_\-.\s]+/, "").trim();
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[''']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * macOS writes a 4KB AppleDouble sidecar named `._original.jpg` when copying to
 * a non-HFS volume. They carry no image data — feeding one to sharp throws.
 * Three of the client's folders came across with these; one folder contains
 * nothing else, which is how we learned its photos never actually copied.
 */
function isRealImage(file: string): boolean {
  if (file.startsWith("._") || file.startsWith(".")) return false;
  return [".jpg", ".jpeg", ".png", ".webp"].includes(
    extname(file).toLowerCase(),
  );
}

/** Every image under a project folder, including nested "Photos Video" dirs. */
function collectImages(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      found.push(...collectImages(full));
    } else if (isRealImage(entry)) {
      found.push(full);
    }
  }
  return found;
}

/**
 * Drop Finder's "X - Copy.jpg" when "X.jpg" is sitting right next to it.
 *
 * Pincode shipped with exactly this pair. Uploading both would put the same
 * render in the gallery twice, and " - Copy" sorted first, so it was also
 * winning the cover slot.
 */
function dropDuplicates(paths: string[]): string[] {
  const names = new Set(paths.map((p) => basename(p).toLowerCase()));
  return paths.filter((p) => {
    const name = basename(p).toLowerCase();
    const original = name.replace(/\s*-\s*copy(?=\.[a-z]+$)/, "");
    return original === name || !names.has(original);
  });
}

/**
 * Which photo leads the project page.
 *
 * Architectural sets are shot to a convention: the front or corner elevation is
 * the establishing shot and the interiors follow. Preferring those filenames
 * beats taking whatever sorts first alphabetically, which on a DJI drone set is
 * an arbitrary frame number. Editors can override the cover in the Studio, so
 * this only has to be right often enough to save them the work.
 */
function pickCover(paths: string[]): string {
  const preferred =
    /\b(front|main|hero|corner|entry|bird|aerial|exterior|elevation)\b/i;
  // A working file ("revise", "final v2") is not the shot to lead with.
  const workingFile = /\b(copy|revise|revised|test|wip)\b/i;
  const clean = paths.filter((p) => !workingFile.test(basename(p)));
  const pool = clean.length > 0 ? clean : paths;
  return pool.find((p) => preferred.test(basename(p))) ?? pool[0];
}

/**
 * Filename fragments that describe the file rather than the photograph.
 * A caption made only of these says nothing a viewer wants to read.
 */
const NOISE_WORDS = new Set([
  "cam", "img", "dji", "dsc", "copy", "final", "new", "revise", "revised",
  "align", "render", "renders", "photo", "image", "view", "views", "jpg",
  "edit", "edited", "ver", "version", "fff", "rw", "fv", "the", "and",
]);

/**
 * Turn a filename into a caption, or nothing.
 *
 * "06_Ananta_arena_Garden view.jpg" carries a real caption; "DJI_2097.jpg" and
 * "US781824.jpg" carry only a camera counter. Emitting "Dji 2097" as a caption
 * would be worse than leaving it blank, so anything that still looks like a
 * code after cleaning is dropped.
 */
function captionFrom(path: string, projectName: string): string | undefined {
  let text = basename(path, extname(path));
  text = text
    .replace(/^\d+[_\-\s]*/, "")
    .replace(/^(Rw_)?v\d+[_\-\s]*/i, "")
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Drop the project's own name; "Ananta arena Garden view" -> "Garden view".
  for (const word of projectName.split(/\s+/)) {
    if (word.length > 3) {
      text = text.replace(new RegExp(`\\b${word}\\b`, "gi"), " ");
    }
  }
  /**
   * Studio shorthand that leaks out of filenames: "Fv_Corner Night" and
   * "Corner_Side_View_FFF". These are internal file codes, not words, and
   * unlike "view" they never carry meaning, so they are removed outright
   * rather than merely ignored when scoring the caption.
   */
  text = text
    .replace(/\s*-\s*copy\b/gi, "")
    .replace(/\b(fff|fv|rw|ver|final|revise[d]?|edit(ed)?|new)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Camera output: DJI_20250912122634_0029_D_SRYD, US781824, ABCD0834, IMG_1234
  if (!/[a-z]{3}/i.test(text)) return undefined;
  if (/^(dji|img|dsc|us|abcd)\b/i.test(text)) return undefined;
  if (/\d{4,}/.test(text)) return undefined;
  if (text.length < 4) return undefined;

  /**
   * Require at least one word that actually describes the photograph.
   * "Front view" keeps `front`; "Cam 001" and "Align" have nothing left once
   * the noise words are removed, so they get no caption at all.
   */
  const meaningful = text
    .split(/[\s\-_]+/)
    .some((w) => w.length >= 3 && !NOISE_WORDS.has(w.toLowerCase()) && !/\d/.test(w));
  if (!meaningful) return undefined;

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Blank out captions that repeat inside one gallery.
 *
 * A caption is meant to tell two photographs apart. Eight images all captioned
 * "Garden view" tell the reader nothing and look like a bug, so if a caption is
 * not unique within the project it is dropped for every image that shares it.
 */
function dedupeCaptions(
  captions: (string | undefined)[],
): (string | undefined)[] {
  const seen = new Map<string, number>();
  for (const c of captions) {
    if (c) seen.set(c, (seen.get(c) ?? 0) + 1);
  }
  return captions.map((c) => (c && seen.get(c) === 1 ? c : undefined));
}

type Job = {
  category: string;
  folder: string;
  slug: string;
  docId: string;
  images: string[];
};

function buildJobs(): Job[] {
  const jobs: Job[] = [];
  for (const category of readdirSync(MEDIA_ROOT).sort()) {
    const categoryDir = join(MEDIA_ROOT, category);
    if (!statSync(categoryDir).isDirectory()) continue;

    for (const folder of readdirSync(categoryDir).sort()) {
      const projectDir = join(categoryDir, folder);
      if (!statSync(projectDir).isDirectory()) continue;

      const images = dropDuplicates(collectImages(projectDir));
      if (images.length === 0) continue; // not delivered yet

      const name = stripPrefix(folder);
      const slug = SLUG_OVERRIDES[name] ?? slugify(name);
      jobs.push({
        category,
        folder,
        slug,
        docId: `drafts.project-${slug}`,
        images,
      });
    }
  }
  return jobs;
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) {
    throw new Error(
      "NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET are not set. " +
        "Run `set -a; source .env.local; set +a` first.",
    );
  }
  const client = getCliClient({ projectId, dataset });

  const jobs = buildJobs();
  console.log(
    `Found ${jobs.length} project folders with images ` +
      `(${jobs.reduce((n, j) => n + j.images.length, 0)} photos total)\n`,
  );

  // Resolve every folder to a real document BEFORE uploading anything. An
  // unmatched folder is a mapping bug, and finding it after a gigabyte of
  // uploads have already landed is no use to anyone.
  const existing: { _id: string; title: string; hasGallery: boolean }[] =
    await client.fetch(
      `*[_id in $ids]{_id, title, "hasGallery": count(gallery) > 0}`,
      { ids: jobs.map((j) => j.docId) },
    );
  const byId = new Map(existing.map((d) => [d._id, d]));

  const unmatched = jobs.filter((j) => !byId.has(j.docId));
  if (unmatched.length > 0) {
    console.error("Could not match these folders to a project document:\n");
    for (const j of unmatched) {
      console.error(`  ${j.category}/${j.folder}`);
      console.error(`    tried slug: ${j.slug}`);
    }
    console.error(
      "\nAdd the correct slug to SLUG_OVERRIDES and re-run. Nothing was uploaded.",
    );
    process.exit(1);
  }

  const work = jobs.filter((j) => FORCE || !byId.get(j.docId)!.hasGallery);
  const skipped = jobs.length - work.length;
  if (skipped > 0) {
    console.log(`Skipping ${skipped} project(s) that already have a gallery.`);
    console.log("Re-run with --force to replace them.\n");
  }

  if (!WRITE) {
    console.log("DRY RUN — pass --write to upload.\n");
    for (const j of work) {
      const doc = byId.get(j.docId)!;
      const cover = pickCover(j.images);
      console.log(`${doc.title}  (${j.slug})`);
      console.log(`  from  ${j.category}/${j.folder}`);
      console.log(`  cover ${basename(cover)}`);
      console.log(`  gallery ${j.images.length} image(s)`);
      const ordered = [cover, ...j.images.filter((p) => p !== cover)];
      const captions = dedupeCaptions(
        ordered.map((p) => captionFrom(p, stripPrefix(j.folder))),
      ).filter(Boolean);
      console.log(
        `  captions ${captions.length}/${j.images.length}` +
          (captions.length ? `  ${captions.slice(0, 4).join(" / ")}` : ""),
      );
      console.log();
    }
    return;
  }

  const staging = await mkdtemp(join(tmpdir(), "csi-ingest-"));
  let uploaded = 0;

  for (const j of work) {
    const doc = byId.get(j.docId)!;
    console.log(`\n${doc.title}  (${j.images.length} images)`);

    const cover = pickCover(j.images);
    const ordered = [cover, ...j.images.filter((p) => p !== cover)];
    const assets: { path: string; ref: string }[] = [];

    for (const path of ordered) {
      const name = basename(path);
      const resized = join(staging, `${assets.length}-${name}`);
      try {
        await sharp(path)
          .rotate() // honour EXIF orientation before we discard the metadata
          .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
          .toFile(resized);

        const asset = await client.assets.upload(
          "image",
          createReadStream(resized),
          { filename: name },
        );
        assets.push({ path, ref: asset._id });
        uploaded++;
        console.log(`  ✓ ${name}`);
      } catch (err) {
        // One unreadable file should not cost us the whole project's upload.
        console.error(`  ✗ ${name}: ${(err as Error).message}`);
      } finally {
        await unlink(resized).catch(() => {});
      }
    }

    if (assets.length === 0) {
      console.error(`  no images uploaded, leaving ${doc.title} untouched`);
      continue;
    }

    const projectName = stripPrefix(j.folder);
    const captions = dedupeCaptions(
      assets.map((a) => captionFrom(a.path, projectName)),
    );
    await client
      .patch(j.docId)
      .set({
        coverImage: {
          _type: "image",
          asset: { _type: "reference", _ref: assets[0].ref },
        },
        gallery: assets.map((a, i) => ({
          _type: "image",
          _key: `img-${i}-${a.ref.slice(-8)}`,
          asset: { _type: "reference", _ref: a.ref },
          ...(captions[i] ? { caption: captions[i] } : {}),
        })),
      })
      .commit();
    console.log(`  → patched ${j.docId}`);
  }

  console.log(`\nDone. Uploaded ${uploaded} images across ${work.length} projects.`);
  console.log("All writes went to drafts — publish in the Studio when ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
