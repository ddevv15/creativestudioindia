# 0001. Hero media delivery: image only field and a curved cutout hero

**Date**: 2026-09-08
**Status**: Proposed

## Summary

The homepage hero changes in two coupled ways. The Sanity `heroMedia` field stops being a `file` (which could hold a video that streams straight off Sanity storage, with no transcoding and a bandwidth bill to match) and becomes an `image`. On top of that, the hero is rebuilt so the picture sits inside a shape with a notch cut out of its top left corner, and the headline sits in that notch on the dark background rather than on top of the picture. The studio keeps control of both the headline and the image. Nothing about the nav, the fonts, or the sharp cornered buttons changes.

## Context

> ⚠️ Premise note: the reference for this work is the React Bits Pro "Hero 12" block, from an interior design site. Once the design system conflicts were resolved, the only idea actually being adopted from it is the curved cutout. The grotesque sans headline, the soft radii on buttons and cards, the pill call to action, and the feature card were all declined in favour of the locked decisions in `AGENTS.md`. That is the right call, and it means the finished hero will not look like the screenshot. Expect a Cormorant Garamond hero, sharp cornered, with a curved notch. If a closer match to the reference is wanted later, the thing to reopen is the typography rule, not this spec.

`components/sections/Hero.tsx` renders a full viewport panel with the picture behind the text and a gradient scrim keeping the words readable. The picture comes from `siteSettings.heroMedia`, which `sanity/schemas/siteSettings.ts` declares as a `file`. The component branches on `heroMedia.asset.mimeType.startsWith("video/")` and, for a video, renders an autoplaying looping `<video>` pointed straight at the Sanity asset URL.

That branch is the problem. Sanity serves file assets as plain downloads. There is no transcoding and no adaptive streaming, so the first time anyone at the studio uploads an MP4 the whole file is pulled from the CDN on every uncached load of the busiest page on the site. Nothing errors. The bill simply grows, and the page gets slower on poor connections. The field type invites exactly this, and the component is built to accept it.

Being a `file` also costs something every day it stays. Sanity's image pipeline only works on image assets: hotspot cropping, low quality image placeholders, and width based responsive sources are all unavailable to a `file`. The hero is the largest image on the site and the element that decides the page's Largest Contentful Paint, so it is the worst place to give that up.

Separately, the studio asked for a different hero composition: the headline lifted out of the picture and set into a curved notch cut from its corner. That is not a cosmetic change layered on top. It needs the image inside a masked shape rather than a full bleed background, so it lands naturally in the same piece of work.

The constraint that shapes everything here is that this hero is not free standing. `components/layout/Nav.tsx` finds it with `document.querySelector("[data-nav-overlay]")` and measures that element to decide when the nav turns from transparent to solid. `constants/nav.ts` lists `/` as an overlay route. Break that contract and the homepage nav regresses to the bug fixed in commit `ba2a4c7`.

## Requirements

**User stories**:
- As a visitor, I want the homepage to open with a striking image and a legible headline so that I understand what the practice does within a few seconds.
- As the studio, I want to change the hero image and headline myself in the Studio so that I do not need a developer to refresh the front page.
- As the studio owner, I want the hero to stay cheap to serve so that a content change cannot quietly multiply the hosting bill.

**Acceptance criteria**:
- **AC-1**: `siteSettings.heroMedia` is a Sanity `image` field with hotspot enabled and is required. The schema cannot accept a video or any other file asset.
- **AC-2**: The hero renders the image inset from the section edges by the page gutter, with Ink visible around all four sides, and its top left corner cut away by a notch. All four outer corners and both concave notch corners carry the radius named in Geometry below.
- **AC-3**: The headline sits inside that notch on the Ink background, is `heroHeadline` from the `siteSettings` singleton, and renders as a real `<h1>` in Cormorant Garamond whose text is selectable and reachable by a screen reader.
- **AC-4**: The notch is sized from the rendered headline plus the gutter named in Geometry, and keeps growing for any headline length. The image never shrinks below its `min-height` floor. No overflow, no clipped text, no overlap into the image, at any length.
- **AC-5**: Below the `md` breakpoint the notch is gone: the headline sits above the image, which keeps its outer radius. The page still has exactly one `<h1>` and one hero image.
- **AC-6**: The call to action links to `/projects` and renders with `border-radius: 0`.
- **AC-7**: When `heroMedia` is absent or unpublished, the hero renders `public/hero-default.jpg` through the identical composition (same inset, notch, and radii) and the route returns 200.
- **AC-8**: The outer `<section>` keeps its `data-nav-overlay` attribute, and Nav logs no missing element warning on `/`.
- **AC-9**: The GSAP SplitText line reveal still runs after `document.fonts.ready`, and is skipped entirely when the visitor has `prefers-reduced-motion: reduce`.
- **AC-10**: The hero image is served through Sanity's image pipeline with `priority` and `sizes="calc(100vw - 48px)"` below `md`, `calc(100vw - 96px)` above. It paints immediately with its CSS default shape and is never gated behind JavaScript, so it remains the Largest Contentful Paint element.
- **AC-11**: The section label "01 / Architecture" and the sub copy line are removed from the hero.

## Options considered

### Option 1: Narrow the field to `image` and rebuild the hero around a cutout mask

Change the schema type, delete the video branch, drop `mimeType` from the GROQ projection, and rebuild the composition so the image sits in a masked shape with the headline in the notch.

**Pros**:
- Removes the bandwidth risk permanently rather than documenting it.
- Unlocks hotspot, low quality placeholders, and responsive sources on the site's LCP image.
- One field means one obvious thing for the studio to set.

**Cons**:
- The existing `heroMedia` value becomes invalid and someone has to re upload the image.
- Rules out a video hero without another spec.

### Option 2: Keep `file`, reject video by validation

Leave the type alone and add a Sanity validation rule rejecting video mime types.

**Pros**:
- Smallest change, and the current stored value stays valid.

**Cons**:
- The video branch stays in `Hero.tsx` as a trap for whoever reads it next.
- Still no image pipeline, so the LCP image stays unoptimised.
- Validation guards the Studio, not the API, so a scripted write can still put a video there.

### Option 3: Keep video, move it to Mux

Install `sanity-plugin-mux-input` so video is transcoded and adaptively streamed.

**Pros**:
- Real video support, done the way video should be done.

**Cons**:
- A new paid third party service and a new plugin for one background loop nobody has asked for.
- More for the studio to learn, and another account to keep alive.

## Decision

**Chosen option**: Option 1: narrow the field to `image` and rebuild the hero around a cutout mask.

`heroMedia` becomes a required Sanity `image` with hotspot enabled, the video branch and the `mimeType` projection are deleted, and the hero is recomposed so the image sits inside a masked shape with the headline set into a notch cut from its top left corner.

**Implementation skills**: `sanity-best-practices` (`sanity-io/agent-toolkit`, `.claude/skills/sanity-best-practices/`)

## Rationale

The bandwidth exposure is latent, not theoretical: the component is written to autoplay a video and the field type accepts one, so it takes a single content upload by someone who has no idea about any of this. A validation rule (Option 2) leaves that shape in place and only narrows who can trigger it. Deleting the branch is what actually closes it.

The image pipeline settles it beyond the bandwidth question. This is the largest image on the busiest page and the element that decides the page's LCP, and a `file` asset cannot be cropped by hotspot, cannot emit a placeholder, and cannot produce width based sources. Giving that up on the hero specifically is the worst possible place to give it up. Option 3 would solve video properly, but it answers a question nobody has asked: there is no video, no plan for one, and no appetite for another paid service on a brochure site.

The engineer originally described the effect as text bent along a curve, and the reference screenshot showed something different: straight text in a curved cutout. Building it as a cutout is both what was actually wanted and the safer engineering. Text on an SVG path is hard to keep accessible, hard to keep readable at small widths, and hostile to a headline whose length the studio controls.

## Feature design

**Data model sketch**:

| Document | Field | Before | After | Notes |
|---|---|---|---|---|
| `siteSettings` (singleton, `_id: "siteSettings"`) | `heroMedia` | `file`, required | `image`, required, `options: { hotspot: true }` | The stored file asset reference becomes invalid and must be replaced |
| `siteSettings` | `heroHeadline` | `string`, required | unchanged | Now also drives the notch geometry |

No other document or field changes. No new fields.

**Geometry** (named here so the build does not have to invent it; all values are the design, not suggestions):

| Property | Below `md` | `md` and up |
|---|---|---|
| Image inset from section edges | 24px, all four sides | 48px, all four sides |
| Outer corner radius, all four corners | 32px | 56px |
| Concave notch corner radius | not applicable, no notch | 56px, same as outer |
| Gutter between headline box and cut edge | not applicable | 32px on all sides |
| Image `min-height` floor | 45vh | 45vh |
| Notch | none, headline sits above the image | cut from the top left corner, sized to the headline box plus the gutter |

The section fills `100vh`. The image fills that height minus its insets, floored at `min-height`. A headline long enough to push past the floor grows the section rather than crushing the image.

**Mask technique**: the concave corners are built with the CSS inverse radius approach, meaning elements painted in the Ink background colour carrying their own `border-radius` and a `box-shadow` spread in the same colour. Not an SVG `clipPath`. An SVG path's `d` attribute is a literal coordinate string and cannot be parametrized with CSS custom properties, so a `clipPath` notch would have to be recomputed as a string in JavaScript on every measurement. The CSS approach is genuinely driven by custom properties, which means the notch has a correct default at first paint with no JavaScript at all, and the measurement only refines it.

**API surface**: no HTTP endpoints. The read path changes only in the GROQ projection:

| Query | Before | After |
|---|---|---|
| `getSiteSettings` | `heroMedia{ asset->{ url, mimeType } }` | `heroMedia{ ..., asset->{ _id, url, metadata{ lqip, dimensions } } }` |

`types/sanity.ts` changes with it: `SiteSettings.heroMedia` moves from `SanityFile` to a Sanity image object so `urlFor()` accepts it.

**Value sourcing**:

| Action | Value produced or displayed | Source |
|---|---|---|
| Render hero | Headline text | `siteSettings.heroHeadline` |
| Render hero | Image sources and sizes | `siteSettings.heroMedia`, through `urlFor()` |
| Render hero | Blur placeholder | `heroMedia.asset.metadata.lqip` |
| Render hero | Image when `heroMedia` is absent | `public/hero-default.jpg`, 2400x1600, path fixed in code |
| Render hero | Insets, radii, gutter, min-height | The Geometry table above, as CSS custom properties |
| Render hero | Notch width and height, first paint | The CSS default from the Geometry table, no JavaScript |
| Render hero | Notch width and height, refined | Measured from the rendered `<h1>` box after `document.fonts.ready`, written back to the same custom properties |
| Render hero | `sizes` attribute | Derived from the insets in the Geometry table |
| Render hero | Call to action label and target | Fixed in the component, links to `/projects` |
| Nav scroll trigger | Hero height | The `[data-nav-overlay]` element, unchanged contract |

**Key invariants**:
- Exactly one `[data-nav-overlay]` element on `/`, and it is the hero's outer section.
- Exactly one `<h1>` on the homepage, containing the headline as real text.
- The notch never overlaps the headline text box, at any headline length or viewport width.
- `border-radius: 0` holds for the call to action. Curvature applies only to the image mask.

**Security model**: not applicable. The hero is public, read only, unauthenticated content. No PII, no compliance scope.

**Configuration required**: none. No new environment variables or credentials.

**Critical test scenarios**:
- Happy path: the homepage loads in a browser, the image renders inside the notched shape, the headline sits in the notch and is selectable, and the nav turns solid on scroll past the hero. Verifies **AC-2**, **AC-3**, **AC-8**.
- Content case: a headline is edited in the Studio from three words to a long sentence, and the notch grows to fit with no clipping or overlap. Verifies **AC-4**.
- Failure case: `heroMedia` is unset on the singleton and the homepage still returns 200 with the default image. Verifies **AC-7**.
- Responsive case: at 375px wide the notch is gone, the headline sits above the image, and the page still has one `<h1>`. Verifies **AC-5**.
- Accessibility case: with `prefers-reduced-motion: reduce` set, no entrance animation runs and the headline is visible immediately. Verifies **AC-9**.

## Build plan

Ordered as a thin thread first, per the project's Tracer Bullet approach: steps 1 to 5 give a working, shippable image hero end to end through schema, query, content and component. Steps 6 to 9 then thicken it with the shape and the motion. The build is releasable after step 5.

1. Change `heroMedia` to `image` with hotspot in `sanity/schemas/siteSettings.ts` and deploy the schema. Satisfies **AC-1**.
2. Update the `getSiteSettings` projection in `lib/sanity/queries.ts` and the `SiteSettings` type in `types/sanity.ts`. Satisfies **AC-1**, **AC-10**.
3. Re upload the hero image in the Studio and confirm the singleton validates. Satisfies **AC-1**.
4. Rewrite `Hero.tsx` as a plain image hero: delete the video branch, render through `urlFor()` with `priority`, a width based `sizes`, and the LQIP blur placeholder. Keep `data-nav-overlay`, keep the headline as `<h1>` and the call to action, remove the section label and sub copy. Satisfies **AC-3**, **AC-6**, **AC-8**, **AC-10**, **AC-11**.
5. Add the committed default image in `public/` and use it when `heroMedia` is absent. Satisfies **AC-7**.
6. Add the cutout with the CSS inverse radius technique, every value from the Geometry table as a custom property, so the notch is correct at first paint with no JavaScript. Satisfies **AC-2**.
7. Refine the notch to the real headline: measure the `<h1>` box with a `ResizeObserver`, gated behind `document.fonts.ready` exactly as the animation is, and write the result back to the same custom properties. Add the `min-height` floor. Satisfies **AC-4**.
8. Remove the notch below `md`, keeping the outer radius and moving the headline above the image. Satisfies **AC-5**.
9. Keep the SplitText reveal and guard it with `prefers-reduced-motion`. Satisfies **AC-9**.

## Migration plan

**Strategy**: two step, forward only. The change transforms live content (one document), so it does not fit in a single deploy.

**Phases**:
1. Deploy the schema change and the projection change together. The stored file reference on `siteSettings.heroMedia` no longer matches the field type, so the Studio flags the singleton as invalid and the site falls back to the default image from step 5. The homepage stays up throughout.
2. Re upload the hero image in the Studio. The singleton validates again and the real image returns.

**Rollback**: revert the schema and projection commits. The original file asset is still in the dataset and is never deleted, so the old hero returns as soon as the code does.

**Prerequisite**: scope feature 3, the broken publish to live path, should be fixed before phase 1 runs. See Risks for why.

**Risks**: the window between phase 1 and phase 2 shows the default image on the homepage. How long that window actually lasts depends on something outside this spec. On demand revalidation is currently broken: `REVALIDATE_SECRET` is empty, so `/api/revalidate` returns 401 for every request, which scope feature 3 records. Until that is fixed, publishing the re uploaded image in the Studio does **not** refresh the page. The homepage keeps serving the default image until the 3600 second fallback expires or someone redeploys. So the honest window today is up to an hour, not however fast someone clicks publish.

Fix feature 3 first and the window collapses to seconds. Ship this without fixing it and the default image is on the front page for up to an hour, which is survivable but should be a decision rather than a surprise. Only one document is affected either way, so there is no backfill and no data loss path.

## Consequences

**Positive**:
- The bandwidth exposure is gone by construction, not by policy.
- The hero image gains hotspot cropping, a blur placeholder, and responsive sources, on the element that sets the page's LCP.
- One media field with one obvious meaning, which is easier for the studio than a field that behaves differently depending on what was uploaded.
- The reduced motion gap in the current hero gets fixed on the way past.

**Negative / tradeoffs**:
- The notch is bespoke geometry. It is the kind of thing that looks right at the two widths it was built at and subtly wrong at a third, and it will need checking across breakpoints whenever the headline or type scale changes.
- The inverse radius technique needs elements painted in the exact background colour to sell the illusion. Change the hero's background and the notch corners break until they are changed with it, which is a coupling that is invisible until someone hits it.
- Refining the notch from the rendered headline is still a client side measurement. Gating it on `document.fonts.ready` and giving it a CSS default means a wrong cut is no longer possible at first paint, but a headline whose measured size differs a lot from the default will visibly settle once.
- Removing the section label deviates from a locked rule in `AGENTS.md` that says the "01 / About" pattern always sits above section headlines. The homepage becomes the only page without one.
- A video hero is now off the table without a further decision.
- Someone must re upload the hero image. It is one action, but it is a manual step in the deploy.

**Neutral**:
- `filesCreative/08-hero-section.md` still describes the video branch and the old composition, so it stops matching the code.
- `components/sections/Hero.tsx` becomes a more involved component than the current one, with a measurement effect alongside the existing animation effect.

## Follow-up

- [ ] Scope features 28 and 29 are open runtime defects that break the homepage in the browser. This hero cannot be verified with `/check verify` until both are fixed. Do them first.
- [ ] Scope feature 3, the broken publish to live path, is a prerequisite of the migration, not just a nice to have. See the Migration plan Risks. Fixing it turns the default image window from up to an hour into seconds.
- [ ] Add `public/hero-default.jpg` at 2400x1600 before step 5. It is a real asset someone has to choose, not a placeholder the build can generate.
- [ ] `AGENTS.md` records the section label as a locked rule with no exceptions. It now has one. `/sync` owns that file, so reconcile it there rather than editing it during the build.
- [ ] `filesCreative/08-hero-section.md` is partly superseded by this spec. Decide whether to update it or mark it historical.
- [ ] Consider whether the hero needs art direction on mobile, meaning a different crop rather than the same image scaled. Hotspot helps but is not the same thing.
