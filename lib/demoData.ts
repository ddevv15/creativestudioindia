// =============================================================================
// TEMPORARY DEMO DATA — not for production.
// -----------------------------------------------------------------------------
// The whole site is normally driven by Sanity. Until the Sanity project is set
// up, lib/content/* returns the data below so the client can preview the built
// site. Page components never import this file directly — they only ever call
// lib/content/*, which is the single seam between demo data and the CMS.
//
// TO REMOVE when Sanity is live:
//   1. Swap the function bodies in lib/content/* to client.fetch(<query>) using
//      the GROQ already written in lib/sanity/queries.ts.
//   2. Delete this file and public/demo/*.
//   3. Delete the DEMO SHIM block in lib/sanity/image.ts.
//   4. Fill real env vars (the fallbacks in lib/sanity/client.ts become inert).
//
// Step 3 is the one that bites: demo images resolve through a passthrough in
// urlFor() that reads `_demoUrl`. Real Sanity image objects have no such field,
// and demoImage() casts through `as unknown as`, so TypeScript cannot catch a
// missed step 3 — it fails at runtime, not build time.
//
// Category and status values below MUST match the option lists in
// sanity/schemas/project.ts. Filtering compares against the value, not the label.
// =============================================================================

import type { PortableTextBlock } from "@sanity/types";
import type { SanityImageObject } from "@sanity/image-url";
import type {
  GalleryImage,
  Now,
  Project,
  Sketch,
  SiteSettings,
  TeamMember,
} from "@/types/sanity";

// A local /public image dressed up to satisfy the Sanity image-object shape.
// urlFor() detects `_demoUrl` and returns the local path unchanged.
function demoImage(url: string): SanityImageObject {
  return { _demoUrl: url } as unknown as SanityImageObject;
}

function demoGalleryImage(
  url: string,
  key: string,
  caption?: string,
): GalleryImage {
  return { _demoUrl: url, _key: key, caption } as unknown as GalleryImage;
}

function block(key: string, text: string): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${key}-s`, text, marks: [] }],
  };
}

// Only three project photographs exist in public/demo. Galleries cycle them.
const GALLERY_SOURCES = [
  "/demo/project-1.jpg",
  "/demo/project-2.jpg",
  "/demo/project-3.jpg",
];

function gallery(prefix: string, captions: string[]): GalleryImage[] {
  return captions.map((caption, i) =>
    demoGalleryImage(
      GALLERY_SOURCES[i % GALLERY_SOURCES.length],
      `${prefix}-g${i + 1}`,
      caption,
    ),
  );
}

const SKETCH_SOURCES = [
  "/demo/sketch-1.jpg",
  "/demo/sketch-2.jpg",
  "/demo/sketch-3.jpg",
  "/demo/sketch-4.jpg",
];

// -----------------------------------------------------------------------------
// Site settings
// -----------------------------------------------------------------------------

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
    block(
      "b1",
      "Jignesh Patel founded Creative Studio India with a simple conviction: architecture should serve the people who live inside it, quietly and for decades.",
    ),
    block(
      "b2",
      "Over 25 years of practice in Ahmedabad, the studio has shaped homes, workplaces, and mixed-use buildings that balance climate, craft, and calm.",
    ),
    block(
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

// -----------------------------------------------------------------------------
// Projects — two per category so the /projects filter is visibly meaningful
// -----------------------------------------------------------------------------

export const demoProjects: Project[] = [
  {
    _id: "demo-project-1",
    title: "Riverside Bungalow",
    slug: "riverside-bungalow",
    headline: "A house that opens to the river.",
    category: "bungalow",
    coverImage: demoImage("/demo/project-1.jpg"),
    gallery: gallery("p1", [
      "Approach from the east, screened by a jaali wall",
      "The living volume, opened to the riverfront",
      "Evening light across the double-height stair",
      "Terrace shading, detailed in local stone",
      "The courtyard at the centre of the plan",
    ]),
    description: [
      block(
        "p1d1",
        "A family home on a narrow riverfront plot, planned so that every principal room reaches the water. The street facade is deliberately closed — a stone and jaali screen that buffers noise and the western sun — while the river side dissolves into a sequence of terraces.",
      ),
      block(
        "p1d2",
        "The section does the heavy lifting. Floor levels step down with the site so the ground never feels cut, and a double-height stair pulls light into the middle of the plan where it would otherwise be darkest.",
      ),
      block(
        "p1d3",
        "Materials were kept to three: load-bearing brick, local grey stone, and Burma teak recovered from the client's previous house.",
      ),
    ],
    location: "Sabarmati Riverfront, Ahmedabad",
    year: 2024,
    area: "4,200 sq ft",
    status: "completed",
    featured: true,
    order: 1,
    seo: {
      metaDescription:
        "A riverfront family home in Ahmedabad planned so every principal room reaches the water, screened from the street by stone and jaali.",
    },
  },
  {
    _id: "demo-project-2",
    title: "Sabarmati House",
    slug: "sabarmati-house",
    headline: "Stacking family life around a courtyard.",
    category: "residential",
    coverImage: demoImage("/demo/project-2.jpg"),
    gallery: gallery("p2", [
      "The courtyard, looking up through three floors",
      "Shared living level, opened on two sides",
      "Brick screen detail at the stair core",
      "Upper terrace and the water tank pavilion",
      "Entry threshold in polished kota",
    ]),
    description: [
      block(
        "p2d1",
        "Three generations, one plot, and a brief that asked for privacy without separation. The house answers with a central courtyard that every room addresses — shared enough to keep the family in contact, deep enough that no window looks directly into another.",
      ),
      block(
        "p2d2",
        "Circulation runs along the courtyard edge rather than through the middle of rooms, which keeps the plan efficient and gives the stair a view at every landing.",
      ),
    ],
    location: "Shahibaug, Ahmedabad",
    year: 2023,
    area: "6,800 sq ft",
    status: "completed",
    featured: true,
    order: 2,
    seo: {
      metaDescription:
        "A three-generation family house in Shahibaug organised around a central courtyard that balances privacy with connection.",
    },
  },
  {
    _id: "demo-project-3",
    title: "Ashram Road Offices",
    slug: "ashram-road-offices",
    headline: "Shading a workplace from the western sun.",
    category: "commercial",
    coverImage: demoImage("/demo/project-3.jpg"),
    gallery: gallery("p3", [
      "West facade, with the full depth of the shading fins",
      "Entrance lobby and the double-height void",
      "Typical floor plate, column-free to the perimeter",
      "Fin detail in precast concrete",
      "Roof terrace above the sixth floor",
    ]),
    description: [
      block(
        "p3d1",
        "A speculative office building on a west-facing site — the hardest orientation in this climate. Rather than glazing the facade and cooling it mechanically, the building wears a set of deep precast fins that cut direct gain through the afternoon while keeping the view open.",
      ),
      block(
        "p3d2",
        "Floor plates are column-free to the perimeter so tenants can plan freely, and the core is pushed west to act as a further thermal buffer.",
      ),
      block(
        "p3d3",
        "Measured against a conventional curtain-wall scheme on the same plot, the fins reduced peak cooling load by roughly a third.",
      ),
    ],
    location: "Ashram Road, Ahmedabad",
    year: 2023,
    area: "22,000 sq ft",
    status: "completed",
    featured: true,
    order: 3,
    seo: {
      metaDescription:
        "A west-facing Ahmedabad office building shaded by deep precast fins, cutting peak cooling load by roughly a third.",
    },
  },
  {
    _id: "demo-project-4",
    title: "Courtyard Bungalow",
    slug: "courtyard-bungalow",
    headline: "Wrapping four rooms around a single tree.",
    category: "bungalow",
    coverImage: demoImage("/demo/project-2.jpg"),
    gallery: gallery("p4", [
      "The retained neem at the centre of the plan",
      "Veranda running the length of the south edge",
      "Living room, opened to the courtyard",
      "Roof overhang and rafter detail",
    ]),
    description: [
      block(
        "p4d1",
        "The site came with a mature neem tree almost exactly at its centre. Removing it would have simplified the plan considerably; keeping it produced a better house.",
      ),
      block(
        "p4d2",
        "Four rooms and a veranda wrap the tree in a loose square, each opening onto the shade it casts. The roof is a single plane, pitched away from the courtyard so that monsoon runoff feeds the tree rather than the drain.",
      ),
    ],
    location: "Bopal, Ahmedabad",
    year: 2022,
    area: "3,600 sq ft",
    status: "completed",
    order: 4,
  },
  {
    _id: "demo-project-5",
    title: "Prahlad Nagar Residences",
    slug: "prahlad-nagar-residences",
    headline: "Giving every apartment a corner of sky.",
    category: "residential",
    coverImage: demoImage("/demo/project-1.jpg"),
    gallery: gallery("p5", [
      "Massing model, showing the shifted balconies",
      "Typical corner unit and its double-height loggia",
      "Shared ground-level garden",
      "Balcony soffit and planter detail",
      "Street elevation at dusk",
    ]),
    description: [
      block(
        "p5d1",
        "Twenty-four apartments on a tight urban plot, where the usual answer is a flat slab block with balconies bolted on. Here the balconies are carved into the mass instead, shifting floor to floor so that every unit gets a double-height corner open to the sky.",
      ),
      block(
        "p5d2",
        "The shift also breaks up the street elevation, which at this density would otherwise read as a single undifferentiated wall.",
      ),
    ],
    location: "Prahlad Nagar, Ahmedabad",
    year: 2024,
    area: "48,000 sq ft",
    status: "under-construction",
    order: 5,
  },
  {
    _id: "demo-project-6",
    title: "Navrangpura Retail Block",
    slug: "navrangpura-retail-block",
    headline: "Turning a corner plot into a street.",
    category: "commercial",
    coverImage: demoImage("/demo/project-3.jpg"),
    gallery: gallery("p6", [
      "The cut-through at ground level",
      "Upper-level walkway and shopfronts",
      "Corner entrance under the deep soffit",
      "Signage zone, integrated into the frame",
    ]),
    description: [
      block(
        "p6d1",
        "A corner retail block that gives back more ground than it takes. Rather than filling the plot to its edges, the building is cut through at ground level with a pedestrian lane that links two streets which had never been connected.",
      ),
      block(
        "p6d2",
        "Shops open onto the lane as well as the street, roughly doubling the usable frontage without adding floor area.",
      ),
    ],
    location: "Navrangpura, Ahmedabad",
    year: 2021,
    area: "14,500 sq ft",
    status: "completed",
    order: 6,
  },
  {
    _id: "demo-project-7",
    title: "Vastrapur Live-Work",
    slug: "vastrapur-live-work",
    headline: "Letting work and home share a wall.",
    category: "mixed-use",
    coverImage: demoImage("/demo/project-1.jpg"),
    gallery: gallery("p7", [
      "Section model through a single live-work unit",
      "Studio level, opened to the shared deck",
      "The stair that separates the two halves",
      "Shared courtyard between the blocks",
      "Facade, with operable studio shutters",
    ]),
    description: [
      block(
        "p7d1",
        "Fourteen units, each pairing a ground-level studio with a dwelling above. The two halves share a party wall and a stair but nothing else — separate entrances, separate services, so a unit can be let as one address or two.",
      ),
      block(
        "p7d2",
        "The studios face a shared courtyard rather than the street, which keeps the working side of the building quiet and gives the residents a buffer.",
      ),
    ],
    location: "Vastrapur, Ahmedabad",
    year: 2024,
    area: "31,000 sq ft",
    status: "under-construction",
    order: 7,
  },
  {
    _id: "demo-project-8",
    title: "Satellite Mixed-Use Complex",
    slug: "satellite-mixed-use-complex",
    headline: "Threading retail beneath twelve homes.",
    category: "mixed-use",
    coverImage: demoImage("/demo/project-2.jpg"),
    gallery: gallery("p8", [
      "Concept massing, retail plinth and housing above",
      "The raised deck between the two uses",
      "Housing block, seen from the deck",
      "Retail frontage at street level",
    ]),
    description: [
      block(
        "p8d1",
        "A concept study for a plot the client had held for a decade without a viable scheme. The proposal separates the two uses onto a raised deck: retail occupies the plinth and addresses the street, twelve homes sit above and address a garden that never touches the road.",
      ),
      block(
        "p8d2",
        "Parking is tucked under the deck rather than below grade, which removes the excavation cost that had made every previous scheme uneconomic.",
      ),
    ],
    location: "Satellite, Ahmedabad",
    year: 2022,
    area: "27,400 sq ft",
    status: "concept",
    order: 8,
  },
];

// -----------------------------------------------------------------------------
// Sketches
// -----------------------------------------------------------------------------

const SKETCH_SEED: {
  title: string;
  year: number;
  relatedSlug?: string;
}[] = [
  { title: "Courtyard study", year: 2024, relatedSlug: "courtyard-bungalow" },
  { title: "Facade elevation", year: 2023, relatedSlug: "ashram-road-offices" },
  { title: "Section detail", year: 2024, relatedSlug: "riverside-bungalow" },
  { title: "Massing sketch", year: 2022 },
  { title: "Stair section", year: 2023, relatedSlug: "sabarmati-house" },
  { title: "Jaali screen study", year: 2024 },
  { title: "Roof plane study", year: 2022, relatedSlug: "courtyard-bungalow" },
  { title: "Site approach", year: 2021 },
  {
    title: "Balcony carve study",
    year: 2024,
    relatedSlug: "prahlad-nagar-residences",
  },
  { title: "Shading fin profile", year: 2023 },
  { title: "Street cut-through", year: 2021, relatedSlug: "navrangpura-retail-block" },
  { title: "Deck level sketch", year: 2022 },
];

export const demoSketches: Sketch[] = SKETCH_SEED.map((seed, i) => ({
  _id: `demo-sketch-${i + 1}`,
  title: seed.title,
  image: demoImage(SKETCH_SOURCES[i % SKETCH_SOURCES.length]),
  year: seed.year,
  ...(seed.relatedSlug ? { relatedProject: { slug: seed.relatedSlug } } : {}),
}));

// -----------------------------------------------------------------------------
// Team
// -----------------------------------------------------------------------------
// No portrait photography exists yet. `photo` resolves to an empty URL and
// TeamCard falls back to a typographic placeholder. When real photos land in
// Sanity, TeamCard renders them with no code change.

export const demoTeamMembers: TeamMember[] = [
  {
    _id: "demo-team-1",
    name: "Jignesh Patel",
    role: "Principal Architect",
    photo: demoImage(""),
    department: "leadership",
    bio: "Founded the studio in 2001 after seven years in practice in Mumbai. Leads design on every project.",
    order: 1,
  },
  {
    _id: "demo-team-2",
    name: "Meera Shah",
    role: "Senior Architect",
    photo: demoImage(""),
    department: "architecture",
    bio: "Joined in 2012. Leads the studio's residential work and runs the detailing standards.",
    order: 2,
  },
  {
    _id: "demo-team-3",
    name: "Rohan Desai",
    role: "Project Architect",
    photo: demoImage(""),
    department: "architecture",
    bio: "Runs site delivery across the commercial portfolio.",
    order: 3,
  },
  {
    _id: "demo-team-4",
    name: "Ananya Iyer",
    role: "Architect",
    photo: demoImage(""),
    department: "architecture",
    bio: "Works across concept design and 3D visualization.",
    order: 4,
  },
  {
    _id: "demo-team-5",
    name: "Vikram Joshi",
    role: "Structural Consultant",
    photo: demoImage(""),
    department: "engineering",
    bio: "Twenty years in structural design, with the studio since 2015.",
    order: 5,
  },
  {
    _id: "demo-team-6",
    name: "Priya Mehta",
    role: "Senior Draftsperson",
    photo: demoImage(""),
    department: "drafts",
    bio: "Owns the studio's CAD standards and construction documentation.",
    order: 6,
  },
  {
    _id: "demo-team-7",
    name: "Sanjay Rao",
    role: "Studio Manager",
    photo: demoImage(""),
    department: "admin",
    bio: "Keeps the practice running — approvals, contracts, and client coordination.",
    order: 7,
  },
];

// -----------------------------------------------------------------------------
// Now — at least two award/press items so spec 18's Recognition section renders
// -----------------------------------------------------------------------------

export const demoNowItems: Now[] = [
  {
    _id: "demo-now-1",
    title: "IIA Gujarat Chapter — Merit Award for Residential Design",
    type: "award",
    date: "2025-03-12",
    body: [
      block(
        "n1",
        "Sabarmati House received a Merit Award in the residential category at the Indian Institute of Architects Gujarat Chapter awards.",
      ),
    ],
    relatedProject: { slug: "sabarmati-house" },
  },
  {
    _id: "demo-now-2",
    title: "Riverside Bungalow featured in Architectural Digest India",
    type: "press",
    date: "2024-11-05",
    body: [
      block(
        "n2",
        "A six-page feature on the riverfront house, photographed across a single day from dawn to dusk.",
      ),
    ],
    relatedProject: { slug: "riverside-bungalow" },
  },
  {
    _id: "demo-now-3",
    title: "Riverside Bungalow handed over",
    type: "project-completion",
    date: "2024-08-20",
    body: [block("n3", "Completed and handed over after 26 months on site.")],
    relatedProject: { slug: "riverside-bungalow" },
  },
  {
    _id: "demo-now-4",
    title: "Studio talk at CEPT University",
    type: "event",
    date: "2025-01-15",
    body: [
      block(
        "n4",
        "Jignesh Patel spoke to the third-year studio on drawing by hand as a design tool rather than a presentation technique.",
      ),
    ],
  },
];
