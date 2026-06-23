Read AGENTS.md first and follow it strictly.

Build two things in this prompt: the shared ProjectCard.tsx component and the FeaturedProjects.tsx homepage section.

ProjectCard.tsx:
- aspect-ratio: 3/2 on the image wrapper
- Full-bleed Next.js <Image> with object-cover
- Gradient overlay at the bottom (transparent → rgba(0,0,0,0.65))
- Bottom-left overlay content: project name in DM Sans 14px font-weight 500 white, and category tag below it in DM Sans 11px rgba(255,255,255,0.6)
- On desktop hover: image scales to 1.04 (CSS transition, 0.4s ease). Name gets a 1px solid white bottom border that animates in (Framer Motion width: 0 → 100%).
- On mobile: overlay text is always visible (no hover state)
- Clicking the card navigates to /projects/[slug]
- Props: title, slug, category, coverImage (Sanity image object), year (optional)

FeaturedProjects.tsx:
- Background: white (#FAFAF8)
- Section label: "02 / Projects"
- Headline: "From concept to creation." in Cormorant Garamond 40px
- 3-column responsive grid: 3 cols desktop (lg), 2 cols tablet (md), 1 col mobile
- Fetches the three projects where featured: true from Sanity using getFeaturedProjects GROQ query in lib/sanity/queries.ts
- "View all projects →" text link below the grid, routes to /projects
- GSAP ScrollTrigger: cards stagger in from Y: 40px → 0, opacity 0 → 1, 0.15s stagger, trigger "top 80%"

Do not change Hero, CredentialBar, Nav, Footer, or any Sanity schema.

---

[Attach Figma design: Featured projects section and project card]
