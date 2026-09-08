# Scope: Creative Studio India

The portfolio website for Creative Studio India, an Ahmedabad architecture practice led by principal architect Jignesh Patel. Public marketing site with a Sanity CMS the studio runs itself.

**Build approach:** Tracer Bullet (each feature built through every layer, working, before the next one starts).
**Workflow:** Alpha (after `/develop`, run `/check verify` against the real app). The project default level of rigor. `/architect` is the recommended first stop for a feature with a real decision, but skippable when you already know the build. Any feature can carry its own tag (e.g. `· GA`) to do more or less.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use `/develop` and skip `/architect`. You decide when a feature is `done`._

Features 1 to 23 were built before this workflow existed, from the written specs in `filesCreative/`. They are enrolled as `existing` for context, so later work can point at them. Features 24 to 27 are what stands between the site as it is and a launch the studio can run on its own.

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Project setup | Foundation | existing |
| 2 | Design system | Foundation | existing |
| 3 | Sanity CMS setup | Foundation | existing |
| 4 | Global layout | Global chrome | existing |
| 5 | Navigation | Global chrome | existing |
| 6 | Footer | Global chrome | existing |
| 7 | WhatsApp button | Global chrome | existing |
| 8 | Hero section | Slice 1: Homepage | existing |
| 9 | Credential bar | Slice 1: Homepage | existing |
| 10 | Featured projects | Slice 1: Homepage | existing |
| 11 | Founder block | Slice 1: Homepage | existing |
| 12 | Sketches strip | Slice 1: Homepage | existing |
| 13 | Services overview | Slice 1: Homepage | existing |
| 14 | Contact CTA | Slice 1: Homepage | existing |
| 15 | Home page assembly | Slice 1: Homepage | existing |
| 16 | Projects listing | Slice 2: Projects | existing |
| 17 | Project detail | Slice 2: Projects | existing |
| 18 | Studio / About page | Slice 3: Inner pages | existing |
| 19 | Services page | Slice 3: Inner pages | existing |
| 20 | Sketches gallery | Slice 3: Inner pages | existing |
| 21 | Contact page | Slice 3: Inner pages | existing |
| 22 | GSAP animation pass | Slice 4: Motion and SEO | existing |
| 23 | SEO and metadata layer | Slice 4: Motion and SEO | existing |
| 24 | Hero media delivery | Slice 5: Launch readiness | planned |
| 25 | Real studio content | Slice 5: Launch readiness | planned |
| 26 | GA4 analytics | Slice 5: Launch readiness | planned |
| 27 | Test foundation | Slice 5: Launch readiness | planned |

## Foundation

### 1. Project setup · existing
Next.js 15 App Router scaffold on TypeScript, with the full dependency set and folder structure from `AGENTS.md`. code in `./`

### 2. Design system · existing
The locked palette, type scale, and spacing tokens, plus the sharp corner rule, as Tailwind theme extensions. code in `tailwind.config.ts`, `app/globals.css`

### 3. Sanity CMS setup · existing
Five document types, the embedded Studio, every GROQ query in one file, the image URL builder, and the webhook that rebuilds pages the moment the studio publishes. Dataset is seeded and live. code in `sanity/`, `lib/sanity/`, `lib/content/`, `app/studio/`, `app/api/revalidate/`

## Global chrome

### 4. Global layout · existing
Root layout, the two Google fonts as CSS variables, and the default metadata every page builds on. code in `app/layout.tsx`, `app/providers.tsx`

### 5. Navigation · existing
Desktop nav that starts transparent over a dark hero and turns solid on scroll, plus the full screen mobile overlay. Bar height lives in one variable so page clearance cannot drift from it. code in `components/layout/Nav.tsx`, `components/layout/MobileNav.tsx`, `constants/nav.ts`

### 6. Footer · existing
Dark footer with the wordmark, social links, address, and legal line, all read from `constants/site.ts`. code in `components/layout/Footer.tsx`

### 7. WhatsApp button · existing
Floating button pinned bottom right on every page, opening a chat with the studio number. code in `components/layout/WhatsAppButton.tsx`

## Slice 1: Homepage

### 8. Hero section · existing
Full viewport opening panel. Reads `heroMedia` from Sanity and renders it as either a looping background video or an image, under a gradient that keeps the headline readable. code in `components/sections/Hero.tsx`

### 9. Credential bar · existing
Thin linen strip under the hero carrying the practice's credentials. code in `components/sections/CredentialBar.tsx`

### 10. Featured projects · existing
The shared project card, plus the three card homepage grid driven by the `featured` flag in Sanity. code in `components/sections/FeaturedProjects.tsx`, `components/ProjectCard.tsx`

### 11. Founder block · existing
Two column introduction to Jignesh Patel, photo beside the biography. code in `components/sections/FounderBlock.tsx`

### 12. Sketches strip · existing
Charcoal panel of hand drawn sketches that scrolls sideways. The practice's design signature. code in `components/sections/SketchesStrip.tsx`

### 13. Services overview · existing
Three card summary of Architecture, 3D Visualization, and Documentation. code in `components/sections/ServicesOverview.tsx`

### 14. Contact CTA · existing
The closing invitation before the footer. code in `components/sections/ContactCTA.tsx`

### 15. Home page assembly · existing
The homepage itself, composing every section in spec order with its own metadata and local business structured data. code in `app/(site)/page.tsx`

## Slice 2: Projects

### 16. Projects listing · existing
Filterable grid of the whole portfolio, with pill category tabs and animated reordering. code in `app/(site)/projects/page.tsx`, `components/ProjectsBrowser.tsx`, `components/FilterTabs.tsx`

### 17. Project detail · existing
Per project page with a full viewport cover, gallery with lightbox, facts panel, and related projects. Slugs are prebuilt at deploy time. code in `app/(site)/projects/[slug]/page.tsx`, `components/ProjectGallery.tsx`, `components/Lightbox.tsx`

## Slice 3: Inner pages

### 18. Studio / About page · existing
Long scroll page covering the practice's history, the principal, the team, the design process, and recognition. Lives at `/about` under the nav label "Studio". code in `app/(site)/about/page.tsx`, `components/TeamCard.tsx`

### 19. Services page · existing
The three services in depth, with process and deliverables. code in `app/(site)/services/page.tsx`

### 20. Sketches gallery · existing
Masonry gallery of sketches with a lightbox, on a charcoal hero. code in `app/(site)/sketches/page.tsx`, `components/SketchesGallery.tsx`, `components/SketchCard.tsx`

### 21. Contact page · existing
Enquiry form, map embed, and studio details, with the form posting to a serverless route that sends through Resend. code in `app/(site)/contact/page.tsx`, `components/ContactForm.tsx`, `app/api/contact/route.ts`, `lib/resend.ts`

## Slice 4: Motion and SEO

### 22. GSAP animation pass · existing
Scroll driven reveals across every section, with the plugins registered exactly once in a shared module rather than in a component. code in `lib/gsap.ts`

### 23. SEO and metadata layer · existing
Unique metadata per page, Open Graph and Twitter cards, JSON LD for the practice and its galleries, sitemap, and a robots file that keeps the Studio out of search. code in `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, `components/JsonLd.tsx`

## Slice 5: Launch readiness

### 24. Hero media delivery · needs a decision
`heroMedia` is a Sanity `file` field and the hero has a branch that autoplays it when the file is a video. Sanity serves file assets as plain downloads, with no transcoding and no adaptive streaming, so the first time the studio uploads an MP4 every visitor pulls the whole file on every uncached load. Nothing breaks; the bill just grows quietly.
**Done when:** the schema can no longer accept a video that streams straight off Sanity file storage, the hero renders correctly for whatever the field now allows, and the reasoning is written down so nobody reintroduces it.
- [ ] Design it (spec): `/architect hero media delivery`

### 25. Real studio content
Every document in Sanity currently holds the reviewed placeholder copy the seed script loaded, team members have no portraits, and `constants/site.ts` still carries a demo phone number and address. This is the last thing standing between the site and being genuinely the studio's.
**Done when:** every Sanity document holds the studio's own words and images, team portraits are in, `constants/site.ts` carries real contact details, and `lib/demoData.ts` plus `scripts/seed.ts` are deleted together.
- [ ] Build it: `/develop real studio content`
- [ ] Verify it: `/check verify real studio content`

### 26. GA4 analytics · needs a decision
`NEXT_PUBLIC_GA_MEASUREMENT_ID` sits in both env files and nothing reads it. `AGENTS.md` lists GA4 in the stack, so this is an unfinished foundation rather than a new idea. It carries a real question: a public site serving visitors in India and abroad may need cookie consent before analytics loads at all.
**Done when:** page views reach the GA4 property from public routes, the Studio route is excluded, and the consent question has an answer the site actually implements.
- [ ] Design it (spec): `/architect ga4 analytics`

### 27. Test foundation · needs a decision
There is no test runner, no test files, and no `test` script. Today the only gates are `npm run typecheck`, `npm run lint`, and `npm run build`. Those catch real breakage but prove nothing about behavior, and they are why this project sits at Alpha rather than Beta.
**Done when:** `npm test` runs a real suite, the content layer in `lib/` has coverage for its shapes and fallbacks, and `/test` has something to run.
- [ ] Design it (spec): `/architect test foundation`

## Deferred
Out of scope for the current build pass, kept so the plan stays honest.
- **Team portraits as a Sanity requirement**: the `photo` field is deliberately unset on all seven team members so the Studio flags them as incomplete; folds into feature 25 · needs a decision if it becomes its own flow
- **Cookie consent banner**: only if feature 26's decision says analytics needs gating · needs a decision
- **Accessibility audit**: no WCAG target has been set for the site yet · needs a decision
- **Performance budget**: no Core Web Vitals targets agreed, though the hero and gallery are the obvious risks · needs a decision

## Legend

**The decision box.** Every feature carries exactly one, the sub task whose label ends with `(spec)`. Its wording varies, so skills locate it by that `(spec)` suffix, never by an exact label. Every other box is an execution box and `/architect` never ticks one.

- **Next step** = the first unticked box (always a command or a tracked milestone).
- **needs a decision** = run `/architect` first; otherwise straight to `/develop`. The tag drops once the spec is captured.
- **Atomic build tasks live in the spec's `## Build plan`, not here**: the scope carries only the milestone rollup.
- **Status** `planned` → `in-progress` → `done`, plus `existing` (pre workflow) and `dropped` (de scoped, kept for history).
- **Approach tag** beside a heading (e.g. `· Facade`) overrides the project default for that feature; no tag inherits it.
- **Workflow tier tag** beside a heading (e.g. `· GA`) sets that one feature's rigor above or below the project default; no tag inherits the default.
- **Workflow** (header line) is the project default, what runs after `/develop`: **Prototype** = nothing; **Alpha** = `/check verify`; **Beta** = `/check verify` then `/test`; **GA** = adds a fresh model `/check review` then `/document`.
- **`existing` is not `done`**: features 1 to 23 predate this workflow, so `/develop` and `/sync` leave them alone.
- **Pointer line** (`spec <n> · code in <path>`): the spec link added by `/architect`, the code path by `/develop`.
