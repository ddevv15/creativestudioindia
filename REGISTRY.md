# Creative Studio India — Implementation Registry

Status map of the build defined in [`filesCreative/`](filesCreative/) (specs `01`–`23`)
and [`AGENTS.md`](AGENTS.md).

**Verified 2026-07-28** by reading every spec against the working tree, running the
toolchain, and walking every route in a browser at 390px and 1440px.

```
npm run typecheck   → exit 0
npm run lint        → exit 0
npm run build       → passes, 22 routes (8 project slugs prerendered via SSG)
```

**Snapshot:** Every page in the spec set is built. The site runs end to end on demo
data through the content adapter in [`lib/content/`](lib/content/). What remains is
not unbuilt UI — it is the Sanity content swap and the studio's real contact details.

Legend: ✅ Done · 🟡 Partial · ⬜ Not started

---

## Tally

| | Count | Specs |
|---|---|---|
| ✅ Done | **21** | 02 · 03 · 04 · 05 · 06 · 07 · 08 · 09 · 10 · 11 · 12 · 13 · 14 · 16 · 17 · 18 · 19 · 20 · 22 · 23 |
| 🟡 Partial | **2** | 01 · 15 |
| ⬜ Not started | **0** | — |

*(21 ✅ counts spec 21 as done — the contact page and API route are complete; only the
Resend credential is outstanding, which is a config gap, not a build gap.)*

---

## 1. Spec-by-spec status

| # | Spec | Status | Notes |
|---|------|--------|-------|
| 01 | Project setup | 🟡 | Everything present and passing. **Left:** [`constants/site.ts`](constants/site.ts) holds *fake* contact details (see §5). |
| 02–14 | Design system → homepage sections | ✅ | Unchanged this pass. Homepage refactored onto the content adapter; renders identically. |
| 15 | Home page | 🟡 | All 7 sections ✅, metadata ✅, now `async` and awaiting `lib/content` ✅. **Left:** real ISR (`revalidate = false` + fetch tags) is only meaningful against a live dataset. |
| 16 | Projects page + `FilterTabs` | ✅ | Server page awaits `getAllProjects()`; client `ProjectsBrowser` holds filter state. Framer `layoutId` pill indicator, `AnimatePresence` grid, live count line. |
| 17 | Project detail | ✅ | `generateStaticParams` over all 8 slugs, `notFound()` on miss, dynamic metadata, hero + gallery + lightbox + specs sidebar + related projects. |
| 18 | About / Studio + `TeamCard` | ✅ | Story, principal, process, team grid, conditional Recognition (renders from `now` items of type award/press). |
| 19 | Services page | ✅ | Three alternating sections with borrowed project imagery, includes-lists, CTA block. |
| 20 | Sketches page + `SketchCard` | ✅ | CSS-columns masonry (3/2/1, 12px gutter verified), `object-contain`, `text-red` related links, shared lightbox. |
| 21 | Contact page + `/api/contact` | ✅ | Full form with all four states, keyless Maps embed, real Resend path in [`lib/resend.ts`](lib/resend.ts). Demo fallback logs and succeeds when `RESEND_API_KEY` is unset. |
| 22 | GSAP animation pass | ✅ | Scroll-progress bar built (2px `#C0391B`, scrub verified 0 → 0.61 → 1.0). **Audit fixed a real defect:** `Hero.tsx` imported gsap directly and never registered `SplitText`; both now go through [`lib/gsap.ts`](lib/gsap.ts). |
| 23 | SEO / metadata | ✅ | `sitemap.ts`, `robots.ts` (+`/api/`), `twitter:card`, per-page OpenGraph, LocalBusiness JSON-LD on home + contact, ImageObject JSON-LD per gallery image. |

---

## 2. Route status

| Route | Status |
|-------|--------|
| `/` Home | ✅ On demo data via adapter |
| `/projects` | ✅ Filterable grid, 8 projects |
| `/projects/[slug]` | ✅ 8 slugs prerendered (SSG) |
| `/about` (Studio) | ✅ |
| `/services` | ✅ |
| `/sketches` | ✅ 12 sketches, masonry |
| `/contact` | ✅ Form reaches success state |
| `/studio` (CMS) | ✅ Embedded Studio |
| `POST /api/revalidate` | ✅ Secret-checked; `sketch` and `now` cases added |
| `POST /api/contact` | ✅ Real Resend path + demo fallback |
| `robots.txt` | ✅ Disallows `/studio` and `/api/` |
| `sitemap.xml` | ✅ 6 static + 8 project entries |

---

## 3. Components & data

**All built.** `FilterTabs` · `TeamCard` · `SketchCard` · `ProjectsBrowser` ·
`ProjectGallery` · `SketchesGallery` · `Lightbox` (shared by 17 and 20) ·
`ScrollProgress` · `ContactForm` · `JsonLd`.

`components/ui/` holds Button, Input, Textarea, Select, Dialog — **all padding-audited
against the spacing override** (see §5.1) and set to radius 0.

| Data / infra | Status |
|------|--------|
| [`lib/content/*`](lib/content/) | ✅ The seam. Returns demo data; swaps to `client.fetch()` on Sanity day. |
| [`lib/sanity/queries.ts`](lib/sanity/queries.ts) | ✅ All GROQ written (incl. `getRelatedProjects`, `relatedProject->{slug}`, `_updatedAt`) — written, not yet executed. |
| [`types/sanity.ts`](types/sanity.ts) | ✅ Full `Project`, `TeamMember`, `Now`, `GalleryImage`, `ProjectCardData`. |
| [`lib/demoData.ts`](lib/demoData.ts) | ✅ 8 projects (2 per category), 12 sketches, 7 team, 4 now items. |
| `lib/resend.ts` | ✅ Written; needs `RESEND_API_KEY` to go live. |
| `constants/site.ts` | 🟡 Structure ✅, values are fake (§5). |
| GA4 script | ⬜ Env var declared; no script wired. |

---

## 4. Current mode: demo build, Sanity-ready

Pages never import `lib/demoData.ts`. They call [`lib/content/`](lib/content/), whose
function signatures already match what Sanity will return. **Sanity day is an edit to
one directory**, then deleting the demo data, the `public/demo/*` images, and the shim
in `lib/sanity/image.ts` — the order-sensitive procedure documented in the
`demoData.ts` header.

---

## 5. Read before you start

1. **Tailwind's spacing scale is overridden, not extended.** Keys `4, 8, 16, 24, 32,
   48, 64, 96` mean pixels; `128` is new; every *other* key is stock. So `p-4` is 4px
   but `p-6` is 24px. Existing code is written against this correctly.
   1. **shadcn primitives were generated against stock spacing and have been fixed.**
      Stock `px-4 py-2` rendered as 4px/8px; `h-8` produced an 8px-tall button;
      `size-4` produced 4px icons. Each file in `components/ui/` now carries a header
      note. **Do not paste stock shadcn classes in without converting them.**
2. **`red` is a flat token, not a scale.** `text-red-500` does not exist. Use `text-red`.
3. **`constants/site.ts` contains plausible fakes, not real data** — `+91 98250 12345`,
   `919825012345`, and bare `instagram.com/` / `linkedin.com/` roots. The WhatsApp FAB,
   footer socials, contact page, and `ContactCTA` `tel:` link all point somewhere wrong.
   **Blocks launch. Needs Jignesh.**
4. **The demo image builder shim implements only four methods** — `.width()`,
   `.height()`, `.fit()`, `.url()`. It is cast through `as unknown as`, so `.auto()` or
   `.quality()` type-checks and then returns `undefined` at runtime.

---

## 6. What is left

**Sanity day** (blocked on the client provisioning a project)

1. Swap the function bodies in `lib/content/*` to `client.fetch()` using the GROQ in
   `lib/sanity/queries.ts`.
2. Delete `lib/demoData.ts`, `public/demo/*`, and the DEMO SHIM in `lib/sanity/image.ts`.
3. Fill the six `.env.local` keys.
4. Restore real ISR on the pages (spec 15).

**Launch blockers, independent of Sanity**

5. Real studio contact details in `constants/site.ts`.
6. `RESEND_API_KEY` (+ optional `RESEND_FROM_EMAIL`) to switch `/api/contact` from
   demo-log to real send.
7. GA4 script wiring.

**Known, non-blocking**

8. The homepage transiently overflows ~6px horizontally at 390px before FounderBlock's
   entrance animation runs — `gsap.from({ x: 30 })` parks the copy column 30px right
   until its ScrollTrigger fires. Pre-existing; FounderBlock is untouched. Fix would be
   an `overflow-x-clip` on the section wrapper.
9. Demo sketches are all 560×420, so the masonry reads as a uniform grid until real
   scans with varied aspect ratios land. Layout is correct; the data is uniform.
