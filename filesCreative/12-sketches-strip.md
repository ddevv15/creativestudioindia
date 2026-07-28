Read AGENTS.md first and follow it strictly.

Implement SketchesStrip.tsx to the written specification below. This section is CSI's design signature — it must feel distinct and crafted.

Background: charcoal (#2C2C2A). Full width.

Layout: horizontally scrollable strip of sketch images. Overflow-x: auto. White-space: nowrap. Hide scrollbar (scrollbar-width: none / ::-webkit-scrollbar: none).

Each sketch card:
- Fixed width: 280px desktop, 220px mobile
- Height: auto, aspect-ratio: 4:3
- Next.js <Image> with object-contain (not cover — sketches should not be cropped)
- Below the image: sketch title in DM Sans 12px rgba(255,255,255,0.6), and year if available

Section header (above the strip, full-width):
- Section label: "04 / Process"
- Headline: "Design begins by hand." in Cormorant Garamond 40px, color white
- Sub-copy: "Every project starts as a sketch." in DM Sans 16px, rgba(255,255,255,0.55)
- "View all sketches →" text link, white, routes to /sketches — positioned right-aligned in the header row on desktop

Drag-to-scroll on desktop: implement pointer-event-based drag scrolling (mousedown → mousemove delta → scrollLeft). No library needed.

On mobile: native touch scroll. Show a partial right-edge card as a visual affordance that more content exists.

Fetches all sketches from Sanity using getAllSketches GROQ query, ordered by the order field.

GSAP ScrollTrigger entrance: section header fades in from Y: 24px → 0. The strip itself does not animate — it appears immediately once the header is in view. Trigger: "top 80%".

Do not change any previously built section, Nav, Footer, or Sanity schemas.
