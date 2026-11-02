---
version: 1
slug: "app-site-about-page-tsx"
primary_target: "app/(site)/about/page.tsx"
related_targets: []
---

Scope: /about (nav label "Studio"). Mode: persuade (a credibility check on the people behind the work).

Audience and job: developers, homeowners and institutions, often referred, checking that a real principal and team stand behind the portfolio. Action: get in touch (WhatsApp is always present; the page closes on "Start a project →").

Content constraints: the bio, quote and process copy are the studio's own. Recognition entries are demo data: they stay visible but are labelled as a draft until the studio sends real ones (client question 1.1). No years or project-count figure on this page until 1.2 and 1.3 are answered.

## Direction contract

THESIS: the page is a monograph about one principal and his studio. It refuses the category's stack of equal sections (hero, about, process cards, team grid).

OWN-WORLD: DESIGN.md "The Drawing Board", unchanged: off-white sheet, ink, graphite mono annotations, 1px ink hairlines, square frames, a 12-column grid with 10px gutters. Cormorant is spent once, on the principal's quote.

STORY: the visitor meets Jignesh Patel's face first and keeps it in view while reading his bio, his words, how the studio works and who works with him. They leave knowing who they would deal with.

FIRST VIEWPORT: a full-bleed banner at 62svh with "Studio" at page-title scale, bottom left. Below it, a 4:5 portrait across columns 1 to 5, pinned while it scrolls. The name and bio begin at column 7.

FORM: Principal monograph, position 4 of 7 on the ranked list. seed:037e6aabd9417b97. Signature interaction: the pinned portrait zooms slowly as the right column scrolls past it (GSAP scrub, still under reduced motion).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

BUILD PATH: code-led, not a skipped comp round. The config default is comp, but no image generation was available in the 2026-11-02 session (no OPENAI_API_KEY, no harness image tool), so the decision round served HTML sketches with the build-path toggle off, as new-work.md prescribes. The chosen sketch is the critique reference.
