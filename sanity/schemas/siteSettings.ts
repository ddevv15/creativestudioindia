import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "studioName",
      title: "Studio Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroMedia",
      title: "Hero Image",
      // `image`, not `file`. A file asset is served as a plain download with no
      // transcoding and no adaptive streaming, so a video here would pull the
      // whole thing from the CDN on every uncached load of the busiest page.
      // An image asset also unlocks hotspot cropping, the blur placeholder, and
      // width based sources, which matter most on the page's LCP element.
      // See docs/specs/0001-hero-media-delivery.md.
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "principalBio",
      title: "Principal Bio",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "principalPhoto",
      title: "Principal Photo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
        }),
        defineField({ name: "ogImage", title: "OG Image", type: "image" }),
      ],
    }),
  ],
  preview: {
    select: { title: "studioName" },
  },
});
