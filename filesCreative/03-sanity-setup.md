Read AGENTS.md first and follow it strictly.

Set up Sanity v3 in this Next.js project by following the next-sanity documentation provided below.

Create lib/sanity/client.ts with the Sanity client configured using NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and apiVersion set to today's date.

Create lib/sanity/image.ts exporting a configured @sanity/image-url builder instance.

Create lib/sanity/queries.ts with empty named GROQ query exports as placeholders. One export per document type: getAllProjects, getProjectBySlug, getFeaturedProjects, getAllTeamMembers, getAllSketches, getAllNowItems, getSiteSettings.

Create all five Sanity document schemas exactly as defined below. Place schemas in sanity/schemas/:

project schema fields: title (string, required), slug (slug from title, required), headline (string, required), category (string enum: bungalow | residential | commercial | mixed-use, required), coverImage (image with hotspot, required), gallery (array of image with optional caption, required), description (block content), location (string), year (number), area (string), status (string enum: completed | under-construction | concept), featured (boolean), order (number), seo (object: metaTitle, metaDescription, ogImage).

teamMember schema fields: name (string, required), role (string, required), photo (image with hotspot, required), department (string enum: leadership | architecture | engineering | drafts | admin, required), bio (text), order (number).

sketch schema fields: title (string, required), image (image with hotspot, required), relatedProject (reference to project), year (number), order (number).

now schema fields: title (string, required), type (string enum: project-completion | award | press | event | partnership, required), date (date, required), body (block content), image (image), relatedProject (reference to project).

siteSettings schema fields: _type singleton. studioName (string, required), heroHeadline (string, required), heroMedia (file, required), principalBio (block content, required), principalPhoto (image with hotspot, required), phone (string, required), email (string, required), address (text, required), instagramUrl (url), linkedinUrl (url), defaultSeo (object: metaTitle, metaDescription, ogImage).

Embed Sanity Studio at app/studio/[[...tool]]/page.tsx. Add 'use client' and mark it with force-dynamic. Import and render NextStudio from next-sanity/studio.

Create the /api/revalidate webhook endpoint at app/api/revalidate/route.ts. It must verify the REVALIDATE_SECRET header before calling revalidatePath(). Return 401 if the secret does not match. Support revalidating /projects, /projects/[slug], /about, and / depending on the document type in the webhook payload.

Exclude /studio from public crawlers by creating app/robots.ts.

Do not expose SANITY_API_TOKEN in any client-side file.

---

[Paste latest next-sanity documentation: https://www.sanity.io/docs/next-js-app-router-live-preview]
