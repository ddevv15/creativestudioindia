Read AGENTS.md first and follow it strictly.

Implement ServicesOverview.tsx to the written specification below.

Background: white (#FAFAF8).

Section header:
- Section label: "05 / Services"
- Headline: "What we do." in Cormorant Garamond 40px

Three service cards in a row on desktop, stacked on mobile. Each card:
- No background — open layout with a top 0.5px border in stone at 20% opacity
- Service number: "01", "02", "03" in DM Sans 11px, stone, uppercase tracked
- Service name in DM Sans 18px, font-weight 500, ink color
- Short description in DM Sans 14px, stone, line-height 1.6 — 2 sentences max

The three services are hardcoded (not from Sanity for this section):
1. Architecture — Commercial, residential, and mixed-use design from concept to completion.
2. 3D Visualization — Photorealistic renders and walkthroughs that bring designs to life before they are built.
3. CAD & Documentation — Precise technical drawings and construction documentation for every project stage.

Below the three cards: a single CTA text link "Explore our services →" centered, routes to /services.

GSAP ScrollTrigger entrance: cards stagger in from Y: 32px → 0, opacity 0 → 1, 0.15s stagger. Trigger: "top 80%".

Do not change any previously built section, Nav, Footer, or Sanity files.
