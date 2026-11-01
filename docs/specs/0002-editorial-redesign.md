# 0002. Editorial redesign: reference layout and motion

**Date**: 2026-11-01
**Status**: In Progress (shell + homepage built; inner pages pending)

## Summary

Dev asked to replace the whole layout with the editorial language of
henninglarsen.com, including its motion. This spec records what was measured
on the reference (live DOM sampling, not guesswork) and how it maps onto this
site. It supersedes these locked decisions in AGENTS.md: dark hero / dark
footer, solid-ink scrolled nav, and the dark full-screen mobile menu.

Only the layout and motion language come from the reference. Its logo, typeface
(Circular), copy and photography do not, and must not be copied. Palette stays
the studio's tokens. Type stays DM Sans, with DM Mono added for captions.

## Measured on the reference (1512px viewport)

**Header**
- Fixed, 90px tall. Transparent with white text at scroll 0 over the hero.
- Scrolling down hides it (`translateY(-100%)`). Scrolling up brings it back on
  a white background with near-black text. `transition: all 0.3s ease-in-out`.
- A full-width 2px rule runs from the logo to the right gutter. The Menu button
  sits above the rule, aligned with the left edge of the menu's content panel
  (~27vw). Quick links and search sit on the right.

**Menu: open** (framer-motion values, read frame by frame)
| t (ms) | What moves | Values |
| --- | --- | --- |
| 0–330 | Right-hand quick links | opacity 1→0, x 0→10px, ease-out |
| 0–315 | Whole overlay | translateY(-100%→0), ease-out |
| 315–615 | White cover over the image panel | translateX(0→100%), ease-in-out (wipe reveal) |
| 615–940 | Image caption, then each menu row | opacity 0→1, x -10px→0, 300ms, 50ms stagger |

**Menu: close**
- The overlay translates up (0 → -100%) over 300ms, ease-out, and the quick links
  come back. Rows don't animate out; they reset while hidden.

**Menu layout**
- Left: image panel, 27vw, a project photograph with a mono location and an
  uppercase title in the bottom-left corner.
- Right: white panel. The link list is bottom-aligned, one primary link per row
  (underlined) followed by muted sub-links, comma-separated. Below that, a
  bottom rule with the footer line and socials.

**Scroll reveal**
- Tiles sit at low opacity until they enter the viewport, then
  `transition: 1s cubic-bezier(0.17, 0.55, 0.55, 1) 0.6s` brings them to 1.
  Opacity only, with no translate.

**Homepage**
1. Full-bleed hero slider (~90vh). Bottom-left: mono location, then an
   uppercase title. Bottom-right: PREV, segmented progress, NEXT.
2. Two-column statement: a 40px headline on the left, 24px body on the right.
3. Editorial mosaic on a 12-column grid. Large project tiles (3:2 plus a
   stretched portrait companion) mix with small tiles. Captions are a mono
   meta line plus a title.
4. Feature rows: an uppercase 32px title and, on the right, mono year and
   location. Below that, a wide image plus portrait companions.

**Footer**
- Light, not dark. A two-segment top rule, the logo on the left, link columns,
  "Back to top ↑" on the right, then a hairline and the copyright line.

## Mapping to this site

- Header: `components/layout/Nav.tsx` (single header for every breakpoint;
  MobileNav removed). Overlay routes stay in `constants/nav.ts` and now include `/`.
- Menu: `components/layout/MenuOverlay.tsx`. Framer Motion owns it, since it isn't
  scroll-driven. The header's hide/show stays on GSAP ScrollTrigger, per AGENTS.md.
- Reveal: `components/ScrollReveal.tsx`, which is ScrollTrigger.batch toggling
  `data-revealed`, with CSS doing the transition.
- Home: `HeroSlider`, `Statement`, `HomeFeed` (mosaic + feature rows).
- Small tiles in the mosaic are sketches. They're the studio's signature, in the
  slot the reference uses for news.
- Reduced motion: no slide, wipe or offset. Opacity cross-fades only, and the
  slider doesn't autoplay.

## Pending

- Inner pages (/projects, /projects/[slug], /about, /services, /sketches,
  /contact) still have the old page bodies. They inherit the new header, menu
  and footer.
- The old homepage sections in `components/sections/` are now unused, apart from
  StudioHero and ContactCTA. Delete them once the redesign is signed off.

## Revision: 2026-11-01, lag and density

Dev's feedback: it looks right, but it feels laggy and leaves too much empty space.

- **Reveal**: dropped the reference's 0.6s hold and 1s fade. It now runs for 700ms on a strong ease-out, with no delay.
- **Menu**: same stages in the same order, but overlapped. The wipe starts at 150ms, rows start at 350ms with a 40ms stagger, and the drop uses a strong ease-out. The last row now lands at about 0.65s instead of about 1s.
- **Images**: `SanityImage` caps every request at 2560px, where it had been fetching 3840px. The hero mounts only the active slide and its neighbours. The next menu image is preloaded on lg screens after 2s.
- **Density**: each mosaic row is now a cluster around one project: its tile, a detail photograph (`gallery[2]`, with that photo's caption) and a note (the project's headline), plus sketches. A sketch fills the detail slot when the gallery is short. Feature rows gained a headline plus a spec list. The intro gained a facts row. Vertical rhythm went down one step (rows 96, sections 64/96, footer 96/128).

## Project page (/projects/[slug]): 2026-11-01

After the reference's project pages:
1. Full-bleed cover (92svh), with no text on the image.
2. Intro panel on linen. A "View gallery" anchor and mono location / year. An
   uppercase title in the left half; the lead in the right half (the first
   description block, or the headline when there's no description). A ruled
   "Project details" table.
3. With body text (description blocks 2+), a captioned image on the left and
   the body in cols 7–10.
4. Image pair: narrow 4:5 plus wide 16:7. Without body text, a second, mirrored
   pair takes the place of section 3.
5. Pull quote (the headline), only when the description supplied the lead.
6. Gallery carousel (`components/ProjectCarousel.tsx`). Slides are the width of
   the content column, so neighbours peek from the gutters. Caption, 01/NN,
   PREV / NEXT. It doesn't loop, and rubber-bands past the ends.
7. Contact strip: principal photo, email, phone, "Start a project".
8. Next project, by order and wrapping: a linen panel, then a full-bleed image.

Gallery photographs are dealt out in order and never repeat. The pairs only
take photos while at least two remain for the carousel.

Swipe logic shared by the hero and the carousel lives in `lib/useSwipe.ts`.
`ProjectGallery.tsx` and `ScrollProgress.tsx` are no longer used.

Content note: as of today no project in Sanity has a `description`, so
sections 3 and 5 don't render yet. They appear as soon as the studio writes one.

## Revision: 2026-11-01, homepage trim and carousel input

- **Homepage**: the feed is capped at 4 mosaic rows plus 2 feature rows, so 6
  projects, featured first, ending in an "All N projects →" link. Two sections
  follow it: `StudioBlock` (principal photo and bio) and `ServicesStrip` (copy in
  `constants/services.ts`). Final order: hero → intro → feed → studio →
  services → contact statement. The sketch strip was considered and left out,
  since sketches already appear in the feed.
- **WhatsApp button clearance**: the button is fixed bottom-right and always
  visible (AGENTS.md), so it covers whatever scrolls under that corner. Nothing
  interactive sits at the far right edge: carousel controls start at the
  halfway column, the project contact strip's CTA sits under the phone number,
  and "All N projects" starts halfway across.
- **Carousel input**: `useSwipe({ mouse: true })` adds click-and-drag with a
  grab cursor. A drag swallows the click that follows. Gesture bookkeeping
  lives in a ref, which fixed fast flicks being dropped when the release
  arrived before a re-render. A slide now changes once the projected landing
  passes a quarter of the width (it was half).

## Projects listing (/projects): 2026-11-01

Dev asked for a page like zha.com/projects. Only the structure and the
interactions follow that reference. ZHA's page is dark; this one stays on the
studio's light palette (locked in AGENTS.md).

- **Banner**: the first featured project's cover at 62svh, with "Projects" set
  at 64 / 112 / 136px bottom left. It's an overlay route, so the header sits
  transparent over it.
- **Filters** (`components/FilterDropdown.tsx`): multi-select checklists for
  Typology and Construction status, the only facets the data has (no project
  has a country or region). Ticked values in one filter widen the result (OR);
  the two filters narrow it together (AND). Each option shows a count that
  respects the other filter, and options with zero matches are disabled, not
  hidden. Under the filters: "Clear all" plus a live project count.
- **Grid** (`components/ProjectsBrowser.tsx`, `components/ProjectGridCard.tsx`):
  ruled cells in blocks of six. One large card (2×2) sits beside four small
  ones, and the large card swaps sides on every other block (lg, 4 columns,
  `grid-flow-dense`). There are 2 columns at md and 1 on mobile. Each card has
  an image, a title with an arrow that rotates → to ↗ on hover, the headline
  as its excerpt, and pill tags for type and status. A cursor-following glow
  in the studio red at 14% appears on hover devices (`.card-glow`).
- **Motion**: Framer owns the grid. On a filter change the whole grid swaps,
  and the cards stagger in (12px rise, 350ms strong ease-out, 40ms apart).
  With reduced motion they only fade.
- `FilterTabs.tsx` and `ProjectCard.tsx` are now unused here (`ProjectCard`
  only survives in the unused `ProjectsCarousel`).

### Card hover glow, revised: 2026-11-01

ZHA's card hover is a WebGL2 canvas placed over the hovered card, behind the
card's content: photos cover it, text sits on it. Watched frame by frame with
the cursor held still, it's a liquid fill, not a cursor trail:
- **0s**: a soft glow behind the text.
- **About 1s**: the colour floods most of the card.
- **2 to 8s**: it keeps flowing on its own, gathering into large soft blobs,
  filling again and drifting toward an edge.

An earlier version here (a cursor-trail dye simulation that faded when the
cursor stopped) got this wrong, and Dev caught it.

`components/CardGlow.tsx` (ogl, already a dependency) is now one shader with
domain-warped, low-frequency noise that flows over time, cut by a soft
threshold:
- **Fill**: eases 0 → 1 over 0.9s on hover and lowers the threshold, so the
  colour floods the card.
- **Breath**: a slow 0.7 rad/s oscillation makes it ebb and fill while you
  stay.
- **Cursor weight**: weight around the cursor makes the fill rise from where
  you entered.
- **Leaving**: it drains over 0.45s.

The colour changes on every hover. Each new hover picks at random from
`--glow-colors` and never repeats the colour just used. The list holds five
glow-only pastel tokens Dev approved on 2026-11-01 (blush, sand, sage, sky,
lilac) at up to 75% strength, which reads as a soft pastel wash on the light
palette. Brand colours alone were tried first: the stone came out muddy.

One canvas hops between cells (`data-glow-cell`), and it stops rendering once
drained. It's for fine pointers only and off with reduced motion. In those
cases, and without WebGL, the CSS `.card-glow` stays as the fallback.
