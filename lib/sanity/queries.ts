/**
 * All GROQ lives here. Never write GROQ inline in a page or component.
 *
 * These queries are executed by lib/content/*, which is the only module that
 * imports them. Page components call lib/content and never reach in here.
 *
 * Note: `relatedProject->{ "slug": slug.current }` flattens the slug object to a
 * string, matching the `{ slug: string }` shape in types/sanity.ts.
 *
 * Note: ordering uses `coalesce(order, 999999)` so documents with no `order`
 * sort last. Plain `order(order asc)` sorts nulls first in GROQ, which would
 * float unordered drafts to the top of every listing.
 */

/** Full project document fields, shared by the list and detail queries. */
const projectFields = `
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  headline,
  category,
  coverImage,
  gallery,
  description,
  location,
  year,
  area,
  status,
  featured,
  order,
  seo{
    metaTitle,
    metaDescription,
    ogImage
  }
`;

/** The narrow projection ProjectCard consumes. */
const projectCardFields = `
  _id,
  title,
  "slug": slug.current,
  category,
  coverImage,
  year
`;

export const getAllProjects = `
  *[_type == "project"] | order(coalesce(order, 999999) asc) {${projectFields}}
`;

export const getProjectBySlug = `
  *[_type == "project" && slug.current == $slug][0] {${projectFields}}
`;

/**
 * Slugs only, for generateStaticParams. Pulling full documents there would
 * fetch every gallery image and Portable Text body just to read one string.
 * `defined(slug.current)` guards against a half-filled draft breaking the build.
 */
export const getAllProjectSlugs = `
  *[_type == "project" && defined(slug.current)] {"slug": slug.current}
`;

export const getFeaturedProjects = `
  *[_type == "project" && featured == true] | order(coalesce(order, 999999) asc) [0...3] {${projectCardFields}}
`;

export const getRelatedProjects = `
  *[_type == "project" && category == $category && slug.current != $slug]
    | order(coalesce(order, 999999) asc) [0...3] {${projectCardFields}}
`;

export const getAllTeamMembers = `
  *[_type == "teamMember"] | order(coalesce(order, 999999) asc) {
    _id,
    name,
    role,
    photo,
    department,
    bio,
    order
  }
`;

export const getAllSketches = `
  *[_type == "sketch"] | order(coalesce(order, 999999) asc) {
    _id,
    title,
    image,
    year,
    relatedProject->{
      "slug": slug.current
    }
  }
`;

export const getAllNowItems = `
  *[_type == "now"] | order(date desc) {
    _id,
    title,
    type,
    date,
    body,
    image,
    relatedProject->{
      "slug": slug.current
    }
  }
`;

/**
 * Note the `heroMedia{ ... }` spread. It deliberately does NOT dereference the
 * asset. `urlFor()` needs the raw image object, with `asset._ref` plus the
 * `hotspot` and `crop` fields, to honour the hotspot the studio sets; a
 * dereferenced `asset->` would hand it an asset document and silently lose the
 * crop. The blur placeholder is pulled out as a flat `lqip` field instead, so
 * the image object stays intact.
 */
export const getSiteSettings = `
  *[_type == "siteSettings"][0]{
    _id,
    studioName,
    heroHeadline,
    heroMedia{
      ...,
      "lqip": asset->metadata.lqip
    },
    principalBio,
    principalPhoto{
      asset->{
        url
      }
    },
    phone,
    email,
    address,
    instagramUrl,
    linkedinUrl,
    defaultSeo{
      metaTitle,
      metaDescription,
      ogImage{
        asset->{
          url
        }
      }
    }
  }
`;
