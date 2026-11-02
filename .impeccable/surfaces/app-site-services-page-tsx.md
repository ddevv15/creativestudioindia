---
version: 1
slug: "app-site-services-page-tsx"
primary_target: "app/(site)/services/page.tsx"
related_targets: []
---

Scope: /services. Mode: persuade (developers, homeowners and possibly other firms checking what the studio does in-house).

Content constraints: the three one-line descriptions in constants/services.ts are the only confirmed copy. The "includes" lists are our draft, kept on the page and listed under client question 6.1 for the studio to confirm. Images must match the service honestly: a completed building for Architecture, an under-construction project's visualization for 3D Visualization, and no image for CAD & Documentation until real drawings arrive (2.9).

## Direction contract

THESIS: each service is shown through the studio's own pictures of that kind of work, as an editorial image pair, rather than icon cards or a feature checklist.

OWN-WORLD: DESIGN.md "The Drawing Board", unchanged: off-white sheet, ink, graphite mono captions, 1px hairlines, square frames, a 12-column grid with 10px gutters. No serif on this page.

STORY: the visitor sees what each service produces (a built building, a visualization), reads the one-line promise and the scope, and moves to contact.

FIRST VIEWPORT: a full-bleed banner at 62svh with "Services" at page-title scale. Below it, the top of the first pair: a 4:5 photo in columns 1 to 4 beside a 16:7 photo in columns 5 to 12, bottom-aligned. "Architecture" (column 5) and its one-liner (column 9) follow just below the fold.

FORM: Image pairs, position 5 of 7 on the ranked list. seed:7b1b3f1bca65ec5d. Pairs mirror on alternate rows; the text-only service keeps the same columns over a hairline. Signature motion: each pair's two frames reveal together, with the slow 1.03 image scale on hover.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

BUILD PATH: code-led, not a skipped comp round. The config default is comp, but no image generation was available in the 2026-11-02 session (no OPENAI_API_KEY, no harness image tool), so the decision round served HTML sketches with the build-path toggle off, as new-work.md prescribes. The chosen sketch is the critique reference.
