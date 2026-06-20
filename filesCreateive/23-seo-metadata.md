Read AGENTS.md first and follow it strictly.

Study all existing pages and implement the full SEO layer. Do not change any page UI, section, Nav, Footer, or Sanity schemas.

Dynamic metadata:
- Verify every page has a unique title and description metadata export. If any page is missing one, add it following the pattern: "[Page Name] | Creative Studio India"
- For /projects/[slug]: pull metaTitle from project.seo.metaTitle or fall back to "[project.title] | Creative Studio India". Pull metaDescription from project.seo.metaDescription or generate from the first 160 characters of the description field.
- OG image: use project.seo.ogImage or project.coverImage for project pages. Use the public/og-image.jpg default for all other pages.
- Set twitter:card to summary_large_image on all pages.

Sitemap — create app/sitemap.ts:
- Static routes: /, /projects, /about, /services, /sketches, /contact
- Dynamic routes: one entry per project slug fetched from Sanity. Set lastModified to the project's _updatedAt field. Set priority: 0.8 for project pages, 1.0 for the homepage, 0.6 for other static pages.

Robots — update app/robots.ts:
- Allow all crawlers on all public routes
- Disallow: /studio (Sanity CMS)
- Disallow: /api/

JSON-LD structured data:
- LocalBusiness schema on the homepage and contact page: pull name, address, phone, email from constants/site.ts. Include geo coordinates for Ahmedabad. Include openingHours if available.
- ImageObject schema on each /projects/[slug] page: one entry per gallery image with contentUrl, name, and description from the image caption if present.

Implement structured data by injecting a <script type="application/ld+json"> tag in each page's head using Next.js Script or a server-rendered script tag. Do not use a third-party library for this.
