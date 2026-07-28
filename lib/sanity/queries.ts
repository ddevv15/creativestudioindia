/**
 * All GROQ lives here. Never write GROQ inline in a page or component.
 *
 * These queries are written but not yet executed — the site currently serves
 * demo data through lib/content/*. Each function in that directory documents
 * which query it will call. Ordering and limits are kept in lockstep between
 * the two so behaviour does not shift on the swap.
 *
 * Note: `relatedProject->{ "slug": slug.current }` flattens the slug object to a
 * string, matching the `{ slug: string }` shape in types/sanity.ts.
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
  *[_type == "project"] | order(order asc) {${projectFields}}
`;

export const getProjectBySlug = `
  *[_type == "project" && slug.current == $slug][0] {${projectFields}}
`;

export const getFeaturedProjects = `
  *[_type == "project" && featured == true] | order(order asc) [0...3] {${projectCardFields}}
`;

export const getRelatedProjects = `
  *[_type == "project" && category == $category && slug.current != $slug]
    | order(order asc) [0...3] {${projectCardFields}}
`;

export const getAllTeamMembers = `
  *[_type == "teamMember"] | order(order asc) {
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
  *[_type == "sketch"] | order(order asc) {
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

export const getSiteSettings = `
  *[_type == "siteSettings"][0]{
    _id,
    studioName,
    heroHeadline,
    heroMedia{
      asset->{
        url,
        mimeType
      }
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
