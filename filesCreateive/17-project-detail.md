Read AGENTS.md first and follow it strictly.

Build the individual project detail page at app/(site)/projects/[slug]/page.tsx.

Implement generateStaticParams to pre-build all project slug paths at deploy time using getAllProjects from lib/sanity/queries.ts. Set notFound() if a slug returns no result.

Page structure from top to bottom as shown in the attached design:

Hero: full-viewport coverImage as background (Next.js <Image> fill + object-cover). Dark gradient overlay bottom-up. Over the image: category tag (pill, white border, white text), project headline (verb-phrase, Cormorant Garamond 56px desktop / 36px mobile, white), and a spec strip below the headline in DM Sans 13px rgba(255,255,255,0.65) — location · year · area · status — separated by center-dots.

Gallery: below the hero, full-width image grid. First image is large (full-width, 16:9). Remaining images are 2-column grid, aspect-ratio 4:3. All images are from the gallery array in Sanity. Clicking any image opens it in a shadcn Dialog (lightbox) at max size. Include caption if present.

Description: two-column layout (lg and above). Left: project description from Sanity Portable Text (DM Sans 16px, line-height 1.75). Right: a specs sidebar — category, year, location, area, status — each as a labeled row with a 0.5px divider.

Related projects: "More projects" heading, 3-column grid of ProjectCard.tsx components. Fetch three projects in the same category (excluding the current one) using a GROQ query in lib/sanity/queries.ts named getRelatedProjects.

Set dynamic page metadata: title "[project.title] | Creative Studio India", description from project.seo.metaDescription or first 160 chars of description. OG image from project.seo.ogImage or project.coverImage.

Do not change the projects listing page, homepage sections, Nav, Footer, or Sanity schemas.

---

[Attach Figma design: Project detail page]
