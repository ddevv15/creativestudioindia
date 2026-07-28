You are an expert Next.js 15 and TypeScript engineer helping me build Creative Studio India's architecture portfolio website.

Write clean, simple, maintainable code. Prioritize clarity over unnecessary abstraction.

Think like a senior full-stack web developer.

---

## Project Overview

We are building the portfolio website for Creative Studio India, an Ahmedabad-based architecture firm founded and led by principal architect Jignesh Patel, with 25+ years of practice.

The site includes:

- Portfolio showcase with filterable project grid and individual project detail pages
- Studio/About page featuring the firm's history, principal designer, team, and design process
- Services page covering Architecture, 3D Visualization, and CAD/Documentation
- Sketches gallery showcasing hand-drawn architectural sketches as a design signature
- Contact page with inquiry form, Google Maps embed, and WhatsApp integration
- Sanity v3 CMS for client-managed content (projects, team members, sketches, news, site settings)
- ISR with on-demand revalidation via Sanity webhooks so the client can publish instantly

Keep the implementation simple, readable, and maintainable.

---

## Tech Stack

- Next.js 15 (App Router)
- TypeScript 5.x
- Tailwind CSS v3
- shadcn/ui (Radix UI primitives)
- GSAP + ScrollTrigger (scroll-driven animations)
- Framer Motion (route transitions and hover microinteractions)
- Sanity v3 + next-sanity v9 (CMS and content delivery)
- @sanity/image-url (Sanity image URL builder)
- Resend (transactional email via serverless API route)
- Vercel (hosting, serverless functions, ISR revalidation)
- Google Analytics 4

Do not introduce new major libraries unless there is a strong reason. Ask before installing anything new.

---

## Development Philosophy

Build feature by feature.

For every feature:

1. Read this file first.
2. Keep the implementation simple.
3. Avoid overengineering.
4. Prefer readable code over clever code.
5. Build the smallest useful version first.
6. Refactor only when repetition appears.

---

## Decision Making

If something is unclear or could be improved, suggest a better approach. If a new library would significantly help, recommend it, explain why, and ask before adding it.

Do not install new libraries without approval.

---

## Architecture

Use this folder structure:

```
app/
  (site)/
    page.tsx                     — Home page
    projects/
      page.tsx                   — Projects listing (filterable grid)
      [slug]/
        page.tsx                 — Project detail page
    about/
      page.tsx                   — Studio/About page (nav label: "Studio")
    services/
      page.tsx                   — Services page
    sketches/
      page.tsx                   — Sketches masonry gallery
    contact/
      page.tsx                   — Contact page
  studio/
    [[...tool]]/
      page.tsx                   — Sanity Studio (CMS — not a public page)
  api/
    contact/
      route.ts                   — Resend email handler
    revalidate/
      route.ts                   — Sanity webhook ISR revalidation endpoint

components/
  layout/
    Nav.tsx                      — Desktop navigation (transparent → solid dark on scroll)
    MobileNav.tsx                — Hamburger → full-screen overlay navigation
    Footer.tsx                   — Dark footer with links, address, social
    WhatsAppButton.tsx           — Fixed floating WhatsApp CTA (bottom-right)

  sections/
    Hero.tsx                     — Full-viewport hero (video/image bg, headline, CTA)
    CredentialBar.tsx            — Horizontal credential strip
    FeaturedProjects.tsx         — Homepage 3-card project grid (Sanity: featured: true)
    FounderBlock.tsx             — 2-col layout: Jignesh photo left, copy right
    SketchesStrip.tsx            — Horizontal scroll sketch strip (dark panel)
    ServicesOverview.tsx         — 3-card services overview (homepage)
    ContactCTA.tsx               — Pre-footer CTA block

  ProjectCard.tsx                — 3:2 ratio card with gradient overlay, hover state
  FilterTabs.tsx                 — Category filter pills (projects page)
  TeamCard.tsx                   — Greyscale portrait, colour on hover
  SketchCard.tsx                 — Sketch image with caption

  ui/                            — shadcn/ui components (Button, Input, Dialog, etc.)

lib/
  sanity/
    client.ts                    — Sanity client (projectId, dataset, apiVersion)
    queries.ts                   — All GROQ queries in one place
    image.ts                     — @sanity/image-url builder instance
  resend.ts                      — Resend email helper
  utils.ts                       — cn() and shared utilities

types/
  sanity.ts                      — TypeScript types matching Sanity document schemas
  index.ts                       — Shared types (NavItem, ServiceItem, etc.)

constants/
  nav.ts                         — Nav items array (label + href)
  site.ts                        — Site-wide constants (name, address, phone, WhatsApp number, social links)

public/
  fonts/                         — Self-hosted fonts if needed
  og-image.jpg                   — Default Open Graph image
```

**app/(site)/** holds all public-facing routes. The route group keeps URLs clean (no /site/ prefix).

**app/studio/** is the embedded Sanity Studio. It is the CMS for the client. It is NOT the firm's About page. The firm's About page lives at /about with nav label "Studio". Do not confuse these two.

**components/sections/** holds homepage and page-level section components. Each section is a self-contained, independently testable block.

**components/layout/** holds globally persistent UI rendered on every page.

**lib/sanity/queries.ts** is the single source of all GROQ queries. Never write GROQ inline inside page components.

---

## UI Rules

There are no Figma files for this project. The written spec in `filesCreative/` is the design source of truth.

For any UI task:

- Build to the spec in `filesCreative/` exactly. Every value it names — layout, spacing, padding, font sizes, font hierarchy, colors, border radius, shadows, alignment, proportions — is a requirement, not a suggestion.
- Where the spec names a value, use that value. Do not approximate. Do not simplify unless explicitly asked.
- Where the spec is silent, follow the locked design decisions below and match the patterns already established in the built homepage sections.

### Design decisions (locked — do not change without asking)

- **Color mode**: Light body with dark hero and dark footer. Body sections alternate between white (#FAFAF8) and linen (#F1EFE8). Never full dark body.
- **Palette**: Ink #1A1A17 · Charcoal #2C2C2A · Stone #5F5E5A · Linen #F1EFE8 · Off-white #FAFAF8 · Red #C0391B · Deep Red #8C2812
- **Typography**: Cormorant Garamond for display headlines at 40px and above only. DM Sans for all other text (H2, body, labels, captions, UI).
- **Nav behavior**: Transparent with white text on hero. Transitions to solid #1A1A17 background when scrolled past the hero. Handled by GSAP ScrollTrigger.
- **Buttons**: border-radius: 0 on all buttons and form inputs (sharp corners = architectural feel). Pills (border-radius: 9999px) only for category filter tags on the projects page.
- **Project card ratio**: aspect-ratio: 3/2 on all project cards.
- **Section labels**: "01 / About" pattern — monospaced number + slash + label, 11px, uppercase, tracked. Always appears above section headlines.
- **Mobile nav**: Hamburger icon (top-right) → full-screen dark (#1A1A17) overlay with large links and generous touch targets (min 44px height).
- **WhatsApp button**: Fixed, bottom-right, always visible. Links to wa.me with the studio phone number.

---

## Styling Rules

Use Tailwind CSS v3 utility classes for all styling.

Use cn() from lib/utils.ts for all conditional class merging.

Use shadcn/ui components from components/ui/ for primitives (Button, Input, Dialog, Select, etc.). Do not rebuild primitives shadcn already provides.

Do not use inline styles unless a value cannot be expressed in Tailwind (e.g., GSAP transform values, dynamic runtime values).

---

## GSAP Rules

GSAP ScrollTrigger owns all scroll-driven animations:
- Hero text and CTA button reveal on page load
- Section entrance animations (fade up + Y translate) for all homepage sections
- Project card stagger on the projects page on load and after filter change
- Nav background transition (transparent → #1A1A17 with a subtle border-bottom)

Framer Motion owns:
- Page route transitions
- Project filter tab active state animation (layout animation on the active indicator)
- Team card colour reveal on hover

Never apply both GSAP and Framer Motion to the same element.

Register all GSAP plugins (ScrollTrigger, etc.) once, in a single top-level client component. Never re-register inside individual section components.

---

## Sanity Rules

All Sanity queries live in lib/sanity/queries.ts. Never write GROQ inline in page or component files.

All Sanity image URL building uses the builder exported from lib/sanity/image.ts.

Pages that consume Sanity data must use ISR. Export `export const revalidate = false` and use `fetch` with `{ next: { tags: ['project'] } }` for on-demand revalidation, OR use `export const revalidate = 3600` for time-based fallback.

The /api/revalidate route verifies the webhook secret token before calling revalidatePath(). Never skip this check.

The Sanity Studio at /studio is excluded from public crawlers via robots.txt. Do not link to it from any public page.

The five Sanity document types are: project, teamMember, sketch, now, siteSettings.

---

## Image Rules

Use Next.js <Image> component for all images.

For Sanity images, build the URL using lib/sanity/image.ts and pass it to <Image> src. Always provide meaningful alt text. Always specify width and height, or use fill with a relative-positioned parent.

Static assets (logo, OG image, favicon) live in public/. Reference them as /filename.ext — do not import them with require() or import.

---

## TypeScript Rules

- Strict mode.
- No `any`.
- Keep types simple and readable.
- All Sanity document types are defined in types/sanity.ts.
- All shared UI types are defined in types/index.ts.

---

## Secret Rules

Never expose secret keys in client-side code or client components.

Server-only secrets (must only be used in API routes, Server Components, or server actions):
- SANITY_API_TOKEN
- RESEND_API_KEY
- REVALIDATE_SECRET

Public environment variables (safe to use anywhere, prefix with NEXT_PUBLIC_):
- NEXT_PUBLIC_SANITY_PROJECT_ID
- NEXT_PUBLIC_SANITY_DATASET
- NEXT_PUBLIC_GA_MEASUREMENT_ID

---

## Communication

Be concise. State what files were changed and how to verify the result.

---

## Final Reminder

Before every feature:

- Read this file.
- Read the matching spec in `filesCreative/`.
- Follow both strictly.
- Build clean, simple code.
- Replicate the written spec exactly — it is the design source of truth.
