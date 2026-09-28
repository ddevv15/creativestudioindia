import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      /**
       * These six mirror the PROJECT TYPE column in the client's
       * "CSI WEBSITE_PROJECT LIST.xlsx" exactly, which is also how their
       * photography is foldered. Keeping the two in lockstep is what lets
       * scripts/ingest-media.ts route a folder to the right document.
       *
       * `bungalow` used to stand in for both PRIVATE RESIDENCE and
       * WEEKEND VILLA. The client treats them as distinct offerings — a
       * private home versus a weekend retreat — so the single value was split
       * and the 12 documents holding it were migrated to the correct half.
       * Do not reintroduce `bungalow`.
       */
      options: {
        list: [
          { title: "Commercial", value: "commercial" },
          { title: "Mixed Use", value: "mixed-use" },
          { title: "Residential", value: "residential" },
          // Schools, the gurukul and the GSC Bank campus. Added when the
          // client's project list arrived with four institutional builds and
          // nowhere to file them; they had been landing under Commercial,
          // which is wrong for a school.
          { title: "Institutional", value: "institutional" },
          { title: "Private Residence", value: "private-residence" },
          { title: "Weekend Villa", value: "weekend-villa" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description:
        "Place name as it should read on the project card, e.g. 'Bopal, Ahmedabad'. Not a link — the map link goes in Map URL below.",
    }),
    /**
     * The client's project list supplies locations only as Google Maps short
     * links, which are not place names and must never be rendered as the
     * card's location text. They are kept here so the data is not thrown away
     * while `location` waits for a human-written name.
     *
     * Not every link still resolves; they are stored as given rather than
     * validated against the network, and are not rendered anywhere yet.
     */
    defineField({
      name: "mapUrl",
      title: "Map URL",
      type: "url",
      description: "Google Maps link for the site. Optional.",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "area",
      title: "Area",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Completed", value: "completed" },
          { title: "Under Construction", value: "under-construction" },
          { title: "Concept", value: "concept" },
        ],
      },
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
    defineField({
      name: "seo",
      title: "SEO",
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
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
