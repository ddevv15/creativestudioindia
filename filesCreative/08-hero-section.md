Read AGENTS.md first and follow it strictly.

Implement Hero.tsx to the written specification below.

The hero is full-viewport height (100vh). It has a dark background (#1A1A17). The heroMedia field from Sanity siteSettings drives the background — if it is a video file, render it as a muted, autoplay, looping, playsinline background video. If it is an image, render it as a Next.js <Image> with fill and object-cover. Overlay a gradient from transparent to rgba(0,0,0,0.45) bottom-up so the headline stays readable.

Content is centered vertically and horizontally:
- Section label above the headline: "01 / Architecture" in the section-label utility class
- Headline: three stacked lines in Cormorant Garamond, 64px desktop / 44px tablet / 34px mobile, font-weight 500, color white, line-height 1.1. Pull the text from the heroHeadline field in Sanity siteSettings.
- Sub-copy: one line below the headline in DM Sans 16px, rgba(255,255,255,0.65)
- CTA button: "View our projects →" — sharp corners (border-radius: 0), white border, white text, transparent bg. On hover: white bg, #1A1A17 text. Routes to /projects on click.

GSAP animations on load (not scroll-triggered — these play once on mount):
- Section label fades in first (opacity 0 → 1, duration 0.6s)
- Headline lines stagger in from Y: 30px to Y: 0, opacity 0 → 1, 0.8s each, 0.15s stagger
- Sub-copy and CTA fade in last, 0.5s, 0.2s apart

Do not change Nav, Footer, or any other section. Do not change Sanity schemas or API files.
