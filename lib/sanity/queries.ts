export const getAllProjects = ``;

export const getProjectBySlug = ``;

export const getFeaturedProjects = `
  *[_type == "project" && featured == true] | order(order asc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    category,
    coverImage,
    year
  }
`;

export const getAllTeamMembers = ``;

export const getAllSketches = `
  *[_type == "sketch"] | order(order asc) {
    _id,
    title,
    image,
    year
  }
`;

export const getAllNowItems = ``;

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
