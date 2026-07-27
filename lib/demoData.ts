// =============================================================================
// TEMPORARY DEMO DATA — not for production.
// -----------------------------------------------------------------------------
// The homepage is normally driven by Sanity (getSiteSettings / getFeaturedProjects
// / getAllSketches). Until the Sanity project is set up, app/(site)/page.tsx
// imports from here so the client can preview the built homepage.
//
// TO REMOVE when Sanity is live:
//   1. Delete this file and public/demo/*.
//   2. Restore the Sanity fetches in app/(site)/page.tsx.
//   3. Delete the DEMO SHIM block in lib/sanity/image.ts.
//   4. Fill real env vars (the fallbacks in lib/sanity/client.ts become inert).
//
// Images resolve through a passthrough in urlFor() that reads `_demoUrl`.
// =============================================================================

import type { PortableTextBlock } from "@sanity/types";
import type { SanityImageObject } from "@sanity/image-url";
import type { Project, Sketch, SiteSettings } from "@/types/sanity";

// A local /public image dressed up to satisfy the Sanity image-object shape.
// urlFor() detects `_demoUrl` and returns the local path unchanged.
function demoImage(url: string): SanityImageObject {
  return { _demoUrl: url } as unknown as SanityImageObject;
}

function bioBlock(key: string, text: string): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${key}-s`, text, marks: [] }],
  };
}

export const demoSiteSettings: SiteSettings = {
  _id: "demo-siteSettings",
  studioName: "Creative Studio India",
  heroHeadline: "We shape spaces that endure.",
  heroMedia: {
    asset: {
      url: "/demo/hero.jpg",
      mimeType: "image/jpeg",
    },
  },
  principalBio: [
    bioBlock(
      "b1",
      "Jignesh Patel founded Creative Studio India with a simple conviction: architecture should serve the people who live inside it, quietly and for decades.",
    ),
    bioBlock(
      "b2",
      "Over 25 years of practice in Ahmedabad, the studio has shaped homes, workplaces, and mixed-use buildings that balance climate, craft, and calm.",
    ),
    bioBlock(
      "b3",
      "Every project begins by hand — a sketch, a section, a study of light — long before it becomes a drawing or a building.",
    ),
  ],
  principalPhoto: {
    asset: {
      url: "/demo/founder.jpg",
    },
  },
  phone: "+91 98250 12345",
  email: "studio@creativestudioindia.com",
  address: "Creative Studio India, CG Road, Navrangpura, Ahmedabad 380009",
  instagramUrl: "https://instagram.com/",
  linkedinUrl: "https://linkedin.com/",
  defaultSeo: {
    metaTitle:
      "Creative Studio India | Architecture & 3D Visualization, Ahmedabad",
    metaDescription:
      "Ahmedabad-based architecture studio led by principal architect Jignesh Patel — 25+ years of residential, commercial, and mixed-use design.",
    ogImage: { asset: { url: "/og-image.jpg" } },
  },
};

export const demoFeaturedProjects: Project[] = [
  {
    _id: "demo-project-1",
    title: "Riverside Bungalow",
    slug: "riverside-bungalow",
    category: "Residential",
    coverImage: demoImage("/demo/project-1.jpg"),
    year: 2024,
  },
  {
    _id: "demo-project-2",
    title: "Sabarmati House",
    slug: "sabarmati-house",
    category: "Residential",
    coverImage: demoImage("/demo/project-2.jpg"),
    year: 2023,
  },
  {
    _id: "demo-project-3",
    title: "Ashram Road Offices",
    slug: "ashram-road-offices",
    category: "Commercial",
    coverImage: demoImage("/demo/project-3.jpg"),
    year: 2023,
  },
];

export const demoSketches: Sketch[] = [
  {
    _id: "demo-sketch-1",
    title: "Courtyard study",
    image: demoImage("/demo/sketch-1.jpg"),
    year: 2024,
  },
  {
    _id: "demo-sketch-2",
    title: "Facade elevation",
    image: demoImage("/demo/sketch-2.jpg"),
    year: 2023,
  },
  {
    _id: "demo-sketch-3",
    title: "Section detail",
    image: demoImage("/demo/sketch-3.jpg"),
    year: 2024,
  },
  {
    _id: "demo-sketch-4",
    title: "Massing sketch",
    image: demoImage("/demo/sketch-4.jpg"),
    year: 2022,
  },
];
