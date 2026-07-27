# Creative Studio India — Implementation Registry

A living status map of the build defined in [`filesCreative/`](filesCreative/) (specs `01`–`23`) and [`AGENTS.md`](AGENTS.md).

**Snapshot:** The full **homepage experience + CMS + infra** (specs 01–15) is essentially built. All **interior route pages** (Projects, Project detail, About/Studio, Services, Sketches, Contact — specs 16–21), the **transactional email backend**, and the **SEO layer** (spec 23) are not yet implemented — most page files are `return null` stubs.

Legend: ✅ Done · 🟡 Partial · ⬜ Not started

---

## 1. Spec-by-spec status (`filesCreative/`)

| # | Spec | Status | What's left |
|---|------|--------|-------------|
| 01 | Project setup | 🟡 | Scaffold, deps, git, `.env.example`, `lib/utils.ts`, constants all present. **Left:** real values in [`constants/site.ts`](constants/site.ts) (address/phone/WhatsApp/email/socials are `TODO:` strings); no `public/og-image.jpg`; `components/ui/` empty (shadcn config present, primitives not generated). |
| 02 | Design system | ✅ | Tailwind tokens, `display`/`sans` fonts, base-8 spacing, `.section-label` + `.display-headline` utilities all in place. |
| 03 | Sanity setup | ✅ | Client, image builder, all 5 schemas (`project`, `teamMember`, `sketch`, `now`, `siteSettings`), embedded Studio, `/api/revalidate` (secret-checked), `robots.ts`. Query file exists but several exports are placeholders (tracked under 16–18). |
| 04 | Global layout | ✅ | Root layout (fonts, metadata, `metadataBase`), `(site)` layout (Nav/Footer/WhatsApp), `AnimatePresence` provider. |
| 05 | Navigation | ✅ | `Nav.tsx` + `MobileNav.tsx` complete. *Deviation:* GSAP/ScrollTrigger registered centrally in [`lib/gsap.ts`](lib/gsap.ts) rather than inside `Nav.tsx` — cleaner, still single-registration. |
| 06 | Footer | ✅ | Dark footer, dynamic year, Instagram/LinkedIn, Instagram-follow line (no newsletter). |
| 07 | WhatsApp button | ✅ | Fixed FAB, `wa.me` link, Framer Motion hover. *(Link is dead until `whatsappNumber` is set — see 01.)* |
| 08 | Hero | ✅ | Full-viewport, video/image branch, gradient, GSAP load timeline (uses `SplitText` for line stagger). |
| 09 | Credential bar | ✅ | 8 tokens, mobile horizontal scroll, ScrollTrigger entrance. |
| 10 | Featured projects + `ProjectCard` | ✅ | Section + shared card (3:2, gradient, Framer underline hover, stagger). |
| 11 | Founder block | ✅ | 2-col, Portable Text bio capped to 3 blocks, ScrollTrigger. |
| 12 | Sketches strip | ✅ | Charcoal strip, pointer drag-to-scroll, ScrollTrigger header. |
| 13 | Services overview | ✅ | 3 hardcoded services, ScrollTrigger stagger. |
| 14 | Contact CTA | ✅ | Ink pre-footer block, two buttons, ScrollTrigger. |
| 15 | Home page | ✅ | All 7 sections assembled, ISR `revalidate=false` + fetch tags, page metadata. |
| 16 | Projects page + `FilterTabs` | ⬜ | [`projects/page.tsx`](app/(site)/projects/page.tsx) is `return null`. Need `FilterTabs.tsx`, client filter wrapper, `getAllProjects` GROQ, count line, AnimatePresence grid. |
| 17 | Project detail | ⬜ | [`projects/[slug]/page.tsx`](app/(site)/projects/[slug]/page.tsx) is a stub. Need `generateStaticParams`, `getProjectBySlug` + `getRelatedProjects`, hero/gallery/lightbox (shadcn Dialog)/specs/related, dynamic metadata. |
| 18 | About / Studio page + `TeamCard` | ⬜ | [`about/page.tsx`](app/(site)/about/page.tsx) is `return null`. Need story, principal, process, team grid (`TeamCard.tsx` + `getAllTeamMembers`), conditional Recognition (`getAllNowItems`). |
| 19 | Services page | ⬜ | [`services/page.tsx`](app/(site)/services/page.tsx) is `return null`. Need 3 alternating service sections + CTA. |
| 20 | Sketches page + `SketchCard` | ⬜ | [`sketches/page.tsx`](app/(site)/sketches/page.tsx) is `return null`. Need masonry gallery, `SketchCard.tsx`, lightbox, `getAllSketches` projection incl. `relatedProject->{slug}`. |
| 21 | Contact page + `/api/contact` | ⬜ | [`contact/page.tsx`](app/(site)/contact/page.tsx) is `return null`; [`api/contact/route.ts`](app/api/contact/route.ts) returns `{ok:true}` with **no Resend call**. Need form (shadcn Select/inputs), map embed, `lib/resend.ts`, real email send. |
| 22 | GSAP animation pass | 🟡 | Homepage section entrances already built inline; registration already consolidated. **Left:** project-detail scroll-progress bar (blocked on 17); re-audit interior pages once they exist. |
| 23 | SEO / metadata | ⬜ | No `app/sitemap.ts`; no JSON-LD (LocalBusiness / ImageObject); stub pages have no per-page metadata; `robots.ts` still allows `/api/`; no `og-image.jpg`. |

**Tally:** ✅ 14 · 🟡 3 · ⬜ 6 (of 23)

---

## 2. Route / page status

| Route | File | Status |
|-------|------|--------|
| `/` Home | [`app/(site)/page.tsx`](app/(site)/page.tsx) | ✅ Fully assembled |
| `/projects` | [`app/(site)/projects/page.tsx`](app/(site)/projects/page.tsx) | ⬜ `return null` |
| `/projects/[slug]` | [`app/(site)/projects/[slug]/page.tsx`](app/(site)/projects/[slug]/page.tsx) | ⬜ stub |
| `/about` (Studio) | [`app/(site)/about/page.tsx`](app/(site)/about/page.tsx) | ⬜ `return null` |
| `/services` | [`app/(site)/services/page.tsx`](app/(site)/services/page.tsx) | ⬜ `return null` |
| `/sketches` | [`app/(site)/sketches/page.tsx`](app/(site)/sketches/page.tsx) | ⬜ `return null` |
| `/contact` | [`app/(site)/contact/page.tsx`](app/(site)/contact/page.tsx) | ⬜ `return null` |
| `/studio` (CMS) | [`app/studio/[[...tool]]/page.tsx`](app/studio/[[...tool]]/page.tsx) | ✅ Embedded Studio |
| `POST /api/revalidate` | [`app/api/revalidate/route.ts`](app/api/revalidate/route.ts) | ✅ Secret-checked ISR |
| `POST /api/contact` | [`app/api/contact/route.ts`](app/api/contact/route.ts) | 🟡 Stub — no email sent |
| `robots.txt` | [`app/robots.ts`](app/robots.ts) | 🟡 Disallows `/studio`; missing `/api/` |
| `sitemap.xml` | `app/sitemap.ts` | ⬜ Missing |

---

## 3. Component inventory

**Layout** — all ✅: [`Nav`](components/layout/Nav.tsx) · [`MobileNav`](components/layout/MobileNav.tsx) · [`Footer`](components/layout/Footer.tsx) · [`WhatsAppButton`](components/layout/WhatsAppButton.tsx)

**Sections (homepage)** — all ✅: [`Hero`](components/sections/Hero.tsx) · [`CredentialBar`](components/sections/CredentialBar.tsx) · [`FeaturedProjects`](components/sections/FeaturedProjects.tsx) · [`FounderBlock`](components/sections/FounderBlock.tsx) · [`SketchesStrip`](components/sections/SketchesStrip.tsx) · [`ServicesOverview`](components/sections/ServicesOverview.tsx) · [`ContactCTA`](components/sections/ContactCTA.tsx)

**Shared / page components**

| Component | Status | Needed by |
|-----------|--------|-----------|
| [`ProjectCard`](components/ProjectCard.tsx) | ✅ | Home, Projects, Detail |
| `FilterTabs` | ⬜ | Projects (16) |
| `TeamCard` | ⬜ | About (18) |
| `SketchCard` | ⬜ | Sketches (20) |
| `components/ui/*` (shadcn Button/Input/Select/Dialog/Textarea) | ⬜ | Contact form (21), lightboxes (17, 20) |

---

## 4. Data & infrastructure

| Item | Status | Notes |
|------|--------|-------|
| Sanity schemas (5) | ✅ | Match spec 03 field-for-field. |
| `getFeaturedProjects` / `getAllSketches` / `getSiteSettings` | ✅ | Used by homepage. |
| `getAllProjects` / `getProjectBySlug` / `getAllTeamMembers` / `getAllNowItems` | ⬜ | Empty-string placeholders in [`queries.ts`](lib/sanity/queries.ts). |
| `getRelatedProjects` | ⬜ | Not created (needed for 17). |
| `lib/sanity` client + image builder | ✅ | |
| `lib/resend.ts` | ⬜ | Missing (needed for 21). |
| `constants/site.ts` values | 🟡 | Structure ✅, values are `TODO:` placeholders. |
| GA4 script | ⬜ | Env var declared; no analytics script wired anywhere. |
| ISR revalidation | ✅ | Home wired; interior pages wire as built. |

---

## 5. What's left — suggested build order

1. **Unblock shared deps first** — real values in `constants/site.ts`; fill the 4 empty GROQ queries + add `getRelatedProjects`; generate needed shadcn `ui/` primitives; add `public/og-image.jpg`.
2. **16 — Projects page** + `FilterTabs` (also unblocks nav → project browsing).
3. **17 — Project detail** + scroll-progress bar (the 22 leftover).
4. **20 — Sketches page** + `SketchCard`.
5. **19 — Services page** (mostly static, quick win).
6. **18 — About/Studio page** + `TeamCard`.
7. **21 — Contact page** + `lib/resend.ts` + real `/api/contact` handler.
8. **23 — SEO pass** across all now-real pages (sitemap, JSON-LD, per-page metadata, robots `/api/` disallow).

> Note: the homepage links to `/projects`, `/about`, `/services`, `/sketches`, `/contact` — all currently render blank pages. Items 2–7 turn those into real destinations.
