import type { PortableTextBlock } from "@sanity/types";
import type { SanityImageObject } from "@sanity/image-url";

export type SanityFile = {
  asset: {
    url: string;
    mimeType: string;
  };
};

export type SanityImage = {
  asset: {
    url: string;
  };
};

/**
 * Array members inside a Sanity image array carry a _key and may carry a caption.
 * Kept assignable to SanityImageObject so urlFor() accepts it directly.
 */
export type GalleryImage = SanityImageObject & {
  _key: string;
  caption?: string;
};

/** Matches the `category` option list in sanity/schemas/project.ts exactly. */
export type ProjectCategory =
  | "bungalow"
  | "residential"
  | "commercial"
  | "mixed-use";

/** Matches the `status` option list in sanity/schemas/project.ts exactly. */
export type ProjectStatus = "completed" | "under-construction" | "concept";

/** Matches the `department` option list in sanity/schemas/teamMember.ts exactly. */
export type Department =
  | "leadership"
  | "architecture"
  | "engineering"
  | "drafts"
  | "admin";

/** Matches the `type` option list in sanity/schemas/now.ts exactly. */
export type NowType =
  | "project-completion"
  | "award"
  | "press"
  | "event"
  | "partnership";

/**
 * The narrow projection ProjectCard consumes — six fields, nothing more.
 * getFeaturedProjects returns exactly this shape.
 */
export type ProjectCardData = {
  _id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  coverImage: SanityImageObject;
  year?: number;
};

/**
 * The full project document. Intersected with ProjectCardData so a complete
 * Project remains assignable wherever the card projection is expected.
 */
export type Project = ProjectCardData & {
  /** Sanity system field — absent on demo data, drives sitemap lastModified. */
  _updatedAt?: string;
  headline: string;
  gallery: GalleryImage[];
  description?: PortableTextBlock[];
  location?: string;
  area?: string;
  status?: ProjectStatus;
  featured?: boolean;
  order?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImageObject;
  };
};

export type Sketch = {
  _id: string;
  title: string;
  image: SanityImageObject;
  year?: number;
  /** Projected via `relatedProject->{ slug }` — absent when unlinked. */
  relatedProject?: { slug: string };
};

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  /**
   * Optional even though the schema marks it required. Sanity validation runs
   * in the Studio, not at the API, so a document written by a script or an
   * import can be missing it and the query will still return that document.
   * The type describes what the API can hand back, not what the Studio asks
   * for. Keeping it required here is what let TeamCard call urlFor() on a
   * missing photo and take /about down with a 500.
   */
  photo?: SanityImageObject;
  department: Department;
  bio?: string;
  order?: number;
};

export type Now = {
  _id: string;
  title: string;
  type: NowType;
  /** ISO date string (Sanity `date` type). */
  date: string;
  body?: PortableTextBlock[];
  image?: SanityImageObject;
  relatedProject?: { slug: string };
};

export type SiteSettings = {
  _id: string;
  studioName: string;
  heroHeadline: string;
  heroMedia: SanityFile;
  principalBio: PortableTextBlock[];
  principalPhoto: SanityImage;
  phone: string;
  email: string;
  address: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  defaultSeo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  };
};
