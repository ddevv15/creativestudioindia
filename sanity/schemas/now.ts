import { defineArrayMember, defineField, defineType } from "sanity";

export const now = defineType({
  name: "now",
  title: "Now",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Project Completion", value: "project-completion" },
          { title: "Award", value: "award" },
          { title: "Press", value: "press" },
          { title: "Event", value: "event" },
          { title: "Partnership", value: "partnership" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "relatedProject",
      title: "Related Project",
      type: "reference",
      to: [{ type: "project" }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "type", media: "image" },
  },
});
