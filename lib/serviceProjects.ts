import type { SanityImageObject } from "@sanity/image-url";
import type { GalleryImage, Project } from "@/types/sanity";

/**
 * Which project honestly illustrates each service: a completed building for
 * Architecture, an under-construction project (so its images are renders) for
 * 3D Visualization. CAD & Documentation has none until real drawings arrive
 * (client question 2.9). Featured projects win; galleries need two images.
 */
export function serviceProjects(projects: Project[]) {
  const withGallery = projects.filter((project) => (project.gallery?.length ?? 0) >= 2);
  const pick = (status: Project["status"]) =>
    withGallery.find((p) => p.status === status && p.featured) ??
    withGallery.find((p) => p.status === status);

  return { built: pick("completed"), visualized: pick("under-construction") };
}

export function assetRef(image: SanityImageObject): string | undefined {
  return image.asset && "_ref" in image.asset ? image.asset._ref : undefined;
}

/** The project's widest gallery image that isn't also its cover. */
export function widestGalleryImage(project: Project): GalleryImage | undefined {
  const coverRef = assetRef(project.coverImage);
  return (project.gallery ?? [])
    .filter((image) => assetRef(image) !== coverRef)
    .sort((a, b) => (b.aspectRatio ?? 0) - (a.aspectRatio ?? 0))[0];
}
