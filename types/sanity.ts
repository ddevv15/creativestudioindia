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

export type Project = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  coverImage: SanityImageObject;
  year?: number;
};

export type Sketch = {
  _id: string;
  title: string;
  image: SanityImageObject;
  year?: number;
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
