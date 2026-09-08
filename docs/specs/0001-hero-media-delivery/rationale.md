# 0001. Hero media delivery: decision record

_The reasoning behind [index.md](index.md). Not build input; `/develop` skips this._

## Context

> ⚠️ Premise note: the reference for this work is the React Bits Pro "Hero 12" block, from an interior design site. Once the design system conflicts were resolved, the only idea actually being adopted from it is the curved cutout. The grotesque sans headline, the soft radii on buttons and cards, the pill call to action, and the feature card were all declined in favour of the locked decisions in `AGENTS.md`. That is the right call, and it means the finished hero will not look like the screenshot. Expect a Cormorant Garamond hero, sharp cornered, with a curved notch. If a closer match to the reference is wanted later, the thing to reopen is the typography rule, not this spec.

`components/sections/Hero.tsx` renders a full viewport panel with the picture behind the text and a gradient scrim keeping the words readable. The picture comes from `siteSettings.heroMedia`, which `sanity/schemas/siteSettings.ts` declares as a `file`. The component branches on `heroMedia.asset.mimeType.startsWith("video/")` and, for a video, renders an autoplaying looping `<video>` pointed straight at the Sanity asset URL.

That branch is the problem. Sanity serves file assets as plain downloads. There is no transcoding and no adaptive streaming, so the first time anyone at the studio uploads an MP4 the whole file is pulled from the CDN on every uncached load of the busiest page on the site. Nothing errors. The bill simply grows, and the page gets slower on poor connections. The field type invites exactly this, and the component is built to accept it.

Being a `file` also costs something every day it stays. Sanity's image pipeline only works on image assets: hotspot cropping, low quality image placeholders, and width based responsive sources are all unavailable to a `file`. The hero is the largest image on the site and the element that decides the page's Largest Contentful Paint, so it is the worst place to give that up.

Separately, the studio asked for a different hero composition: the headline lifted out of the picture and set into a curved notch cut from its corner. That is not a cosmetic change layered on top. It needs the image inside a masked shape rather than a full bleed background, so it lands naturally in the same piece of work.

The constraint that shapes everything here is that this hero is not free standing. `components/layout/Nav.tsx` finds it with `document.querySelector("[data-nav-overlay]")` and measures that element to decide when the nav turns from transparent to solid. `constants/nav.ts` lists `/` as an overlay route. Break that contract and the homepage nav regresses to the bug fixed in commit `ba2a4c7`.

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

## Rationale

The bandwidth exposure is latent, not theoretical: the component is written to autoplay a video and the field type accepts one, so it takes a single content upload by someone who has no idea about any of this. A validation rule (Option 2) leaves that shape in place and only narrows who can trigger it. Deleting the branch is what actually closes it.

The image pipeline settles it beyond the bandwidth question. This is the largest image on the busiest page and the element that decides the page's LCP, and a `file` asset cannot be cropped by hotspot, cannot emit a placeholder, and cannot produce width based sources. Giving that up on the hero specifically is the worst possible place to give it up. Option 3 would solve video properly, but it answers a question nobody has asked: there is no video, no plan for one, and no appetite for another paid service on a brochure site.

The engineer originally described the effect as text bent along a curve, and the reference screenshot showed something different: straight text in a curved cutout. Building it as a cutout is both what was actually wanted and the safer engineering. Text on an SVG path is hard to keep accessible, hard to keep readable at small widths, and hostile to a headline whose length the studio controls.
