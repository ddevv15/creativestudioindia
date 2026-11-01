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
    Nav.tsx                      — Header for every breakpoint: transparent on image heroes at scroll 0, hides on scroll down, Menu button (spec 0002)
    MenuOverlay.tsx              — Full-screen menu: image panel + link rows, Framer Motion choreography (spec 0002)
    Footer.tsx                   — Light footer with links, address, social (spec 0002)
    WhatsAppButton.tsx           — Fixed floating WhatsApp CTA (bottom-right)

  sections/
    HeroSlider.tsx               — Homepage hero: full-bleed featured project slider (spec 0002)
    Statement.tsx                — Two-column statement: headline left, body (+ facts, links) right
    HomeFeed.tsx                 — Homepage editorial mosaic + feature rows, capped to a taste of the work
    StudioBlock.tsx              — Principal photo + bio (homepage)
    ServicesStrip.tsx            — Three services in a row (homepage); copy in constants/services.ts
    HeroScrollExpand.tsx         — Homepage hero: opens on Ink + headline only, scroll expands an aperture to a full-bleed image
    CredentialBar.tsx            — Horizontal credential strip
    FeaturedProjects.tsx         — Homepage 3-card project grid (Sanity: featured: true)
    FounderBlock.tsx             — 2-col layout: Jignesh photo left, copy right
    SketchesStrip.tsx            — Horizontal scroll sketch strip (dark panel)
    ServicesOverview.tsx         — 3-card services overview (homepage)
    ContactCTA.tsx               — Pre-footer CTA block

  ProjectCard.tsx                — 3:2 ratio card with gradient overlay, hover state
  FilterTabs.tsx                 — Category filter pills (unused since the zha-style /projects page)
  FilterDropdown.tsx             — Multi-select checklist dropdown (projects page filters)
  ProjectGridCard.tsx            — /projects grid cell: image, title + arrow, excerpt, pill tags, CSS glow fallback
  CardGlow.tsx                   — WebGL (ogl) fluid glow behind the hovered /projects card; one shared canvas
  TeamCard.tsx                   — Greyscale portrait, colour on hover
  SketchCard.tsx                 — Sketch image with caption
  SanityImage.tsx                — next/image fed from Sanity's CDN (client component; caps requests at 2560px)
  ScrollReveal.tsx               — Drives every [data-reveal] element via ScrollTrigger.batch (mounted once in the site layout)
  ProjectCarousel.tsx            — Project page gallery carousel: drag (touch + mouse), counter, PREV / NEXT

  ui/                            — shadcn/ui components (Button, Input, Dialog, etc.)

lib/
  sanity/
    client.ts                    — Sanity client (projectId, dataset, apiVersion)
    queries.ts                   — All GROQ queries in one place
    image.ts                     — @sanity/image-url builder instance
  resend.ts                      — Resend email helper
  utils.ts                       — cn() and shared utilities
  useSwipe.ts                    — Shared horizontal swipe for carousels (1:1 drag, momentum projection, opt-in mouse)

types/
  sanity.ts                      — TypeScript types matching Sanity document schemas
  index.ts                       — Shared types (NavItem, ServiceItem, etc.)

constants/
  nav.ts                         — Nav items array (label + href)
  site.ts                        — Site-wide constants (name, address, phone, WhatsApp number, social links)
  services.ts                    — The three services' names and one-line descriptions

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

> **2026-11-01: editorial redesign in progress.** Dev replaced the layout and motion language with the henninglarsen.com reference. `docs/specs/0002-editorial-redesign.md` records the measured values and overrides the color mode, nav, mobile nav and footer decisions below wherever they conflict. Palette and fonts still apply; DM Mono was added for captions.

- **Color mode**: Light body with dark hero and dark footer. Body sections alternate between white (#FAFAF8) and linen (#F1EFE8). Never full dark body. *(Superseded by spec 0002: light footer; full-bleed image heroes.)*
- **Palette**: Ink #1A1A17 · Charcoal #2C2C2A · Stone #5F5E5A · Linen #F1EFE8 · Off-white #FAFAF8 · Red #C0391B · Deep Red #8C2812. Glow-only pastels (`--glow-blush/sand/sage/sky/lilac` in globals.css, approved 2026-11-01) exist solely for the /projects card hover via `--glow-colors`; never use them elsewhere.
- **Typography**: Cormorant Garamond for display headlines at 40px and above only. DM Sans for all other text (H2, body, labels, captions, UI).
- **Nav behavior**: Transparent with white text on hero. Transitions to solid #1A1A17 background when scrolled past the hero. Handled by GSAP ScrollTrigger. *(Superseded by spec 0002: transparent only at scroll 0 on image heroes, hides on scroll down, returns solid off-white on scroll up; Menu button opens a full-screen menu overlay on every breakpoint.)*
- **Buttons**: border-radius: 0 on all buttons and form inputs (sharp corners = architectural feel). Pills (border-radius: 9999px) only for category filter tags on the projects page.
- **Project card ratio**: aspect-ratio: 3/2 on all project cards.
- **Section labels**: "01 / About" pattern — monospaced number + slash + label, 11px, uppercase, tracked. Always appears above section headlines. *(Superseded on redesigned pages by spec 0002: a plain `.caption-mono` label, no number.)*
- **Mobile nav**: Hamburger icon (top-right) → full-screen dark (#1A1A17) overlay with large links and generous touch targets (min 44px height). *(Superseded by spec 0002: the same light menu overlay as desktop, without the image panel; 44px targets still required.)*
- **WhatsApp button**: Fixed, bottom-right, always visible. Links to wa.me with the studio phone number. Because it covers that corner as content scrolls under it, never put interactive controls (buttons, CTAs) at the far bottom-right edge of a section; start them at the halfway column instead.

---

## Styling Rules

Use Tailwind CSS v3 utility classes for all styling.

Use cn() from lib/utils.ts for all conditional class merging.

Use shadcn/ui components from components/ui/ for primitives (Button, Input, Dialog, Select, etc.). Do not rebuild primitives shadcn already provides.

Do not use inline styles unless a value cannot be expressed in Tailwind (e.g., GSAP transform values, dynamic runtime values).

---

## GSAP Rules

GSAP ScrollTrigger owns all scroll-driven animations:
- NOT the homepage hero slider (`components/sections/HeroSlider.tsx`), which uses CSS transitions and pointer events
- Section entrance animations: `[data-reveal]` elements, triggered by `components/ScrollReveal.tsx` (ScrollTrigger.batch), opacity-only CSS transition (spec 0002)
- Project card stagger on the projects page on load and after filter change
- Nav background transition (transparent → #1A1A17 with a subtle border-bottom)

Framer Motion owns:
- The menu overlay open/close choreography (`components/layout/MenuOverlay.tsx`)
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

For Sanity images, prefer `components/SanityImage.tsx` (pass `source`, optional `ratio` to hard-crop on the CDN); it is a client component, so Server Components can use it where they cannot pass a `loader` to next/image. Otherwise build the URL using lib/sanity/image.ts and pass it to <Image> src. Always provide meaningful alt text. Always specify width and height, or use fill with a relative-positioned parent.

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

Anything still needed from the client (missing or doubtful content, conflicting facts, photos, captions, account access) goes in `docs/client-questions.md` as a numbered item. Never fill those gaps with invented copy or claims.

---

## Final Reminder

Before every feature:

- Read this file.
- Read the matching spec in `filesCreative/`.
- Follow both strictly.
- Build clean, simple code.
- Replicate the written spec exactly — it is the design source of truth.
