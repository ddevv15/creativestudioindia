Read AGENTS.md first and follow it strictly.

Compose the homepage at app/(site)/page.tsx by assembling all built sections in this exact order:

1. Hero
2. CredentialBar
3. FeaturedProjects
4. FounderBlock
5. SketchesStrip
6. ServicesOverview
7. ContactCTA

The homepage is a React Server Component. Fetch siteSettings from Sanity once at the top of the page and pass heroHeadline, heroMedia, principalBio, and principalPhoto as props to the sections that need them. Sections that fetch their own data (FeaturedProjects, SketchesStrip) call their own GROQ queries internally as Server Components.

Set ISR revalidation: export const revalidate = false and use fetch with next: { tags: ['siteSettings', 'project', 'sketch'] } so Sanity webhook revalidation works correctly.

Set page-level metadata: title "Creative Studio India | Architecture & 3D Visualization, Ahmedabad", description pulled from siteSettings.defaultSeo.metaDescription.

Do not change any individual section component. Do not change Nav, Footer, WhatsAppButton, or any Sanity/API file.
