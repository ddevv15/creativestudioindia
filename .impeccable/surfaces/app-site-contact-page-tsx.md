---
version: 1
slug: "app-site-contact-page-tsx"
primary_target: "app/(site)/contact/page.tsx"
related_targets: []
---

Scope: /contact. Mode: operate (the visitor's task is to reach the studio: write an enquiry, or pick a channel).

Constraints: the form must never claim an enquiry was sent when it was not. Until RESEND_API_KEY is set, deployed builds tell visitors to use WhatsApp, phone or email instead; local dev keeps the demo success. No promised reply time (client question). Phone or email is required, at least one; email becomes the reply-to. Contact details are still unconfirmed (client question 1.4), so they come only from constants/site.ts.

## Direction contract

THESIS: the form leads, and a way to talk is never out of view while writing. It refuses the category's split of a decorative headline beside a boxed form card.

OWN-WORLD: DESIGN.md "The Drawing Board", unchanged: off-white sheet, ink, hairline-ruled fields (a 1px rule under each field, no boxes), square corners, DM Mono labels on the channel rows, one ink button. Red only for an error.

STORY: the visitor writes a few lines about the project and sends it, or uses WhatsApp, phone or email from the column beside the form, and is told plainly what happened.

FIRST VIEWPORT: "Contact" at page-title scale on the off-white sheet, no banner. Below it, the form in columns 1 to 7 (name; phone and email side by side; company and project type side by side, both optional, kept from the existing enquiry fields; message), and the channels as ruled rows (Phone and WhatsApp, with both actions on the one shared number; Email; Studio) in columns 9 to 11, pinned under the header while the form scrolls.

FORM: Form first, position 7 of 7 on the ranked list. seed:d44c1b0831c2416d. Signature move: the field rule darkens from ink/25 to ink on focus, and the channel column stays put beside the form.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

BUILD PATH: code-led, not a skipped comp round. The config default is comp, but no image generation was available in the 2026-11-02 session (no OPENAI_API_KEY, no harness image tool), so the decision round served HTML sketches with the build-path toggle off, as new-work.md prescribes. The chosen sketch is the critique reference.
