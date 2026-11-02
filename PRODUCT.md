# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Prospective clients of an Ahmedabad architecture and planning practice, deciding
whether to hire it. Inferred from the studio's portfolio and project list (Dev
pointed to AGENTS.md and the repo rather than naming them; the client should
confirm in `docs/client-questions.md`):

- **Real estate developers** commissioning commercial, mixed-use and residential
  buildings. This is most of the work: Times Square 1 and 2, Front Forever,
  Ananta Arena, Sparsh Technologies, Pehel Lake View.
- **Private homeowners** commissioning a villa, bungalow or weekend home
  (Haridarshan Villa, The Retreat at Pipan).
- **Institutions** such as schools, trusts and campuses (Shree Ghanshyam Gurukul;
  GSC Bank Campus and Sagwara School on the project list).
- **Possibly other firms** wanting 3D visualization or CAD documentation only.
  Not confirmed (client question 6.2).

Many visitors arrive already referred and are checking that the studio is
serious before they get in touch. Others arrive cold, comparing practices.

## Product Purpose

The portfolio website of Creative Studio India, led by principal designer
Jignesh Patel. It shows the built and in-progress work, the principal and team,
the services and the hand sketches, and turns that into a conversation with the
studio.

Success is any of three outcomes, all equally valid:
1. **A direct conversation:** a WhatsApp message or a phone call.
2. **A contact form enquiry** with project details.
3. **A passed credibility check:** a referred visitor leaves confident enough to
   get in touch through whatever channel they already had.

## Positioning

Four candidate differentiators, all selected by Dev but marked "not sure", so
treat them as working hypotheses until the client confirms:

- **Principal-led:** clients work with Jignesh Patel directly.
- **Hand sketching:** designs start as hand sketches, and the sketches are the
  studio's signature (AGENTS.md already treats them that way).
- **Scale and range:** decades of practice and hundreds of projects across
  commercial, residential, mixed-use and institutional work.
- **In-house end to end:** design, 3D visualization and construction
  documentation under one roof.

## Operating Context

- **Content is client-run.** The studio publishes projects, sketches, team
  members, news and site settings itself in Sanity at `/studio`. Pages rebuild on
  publish (ISR plus a webhook). Every layout must survive the content the studio
  actually enters: missing fields, short galleries, long titles.
- **Contact channels:** WhatsApp (a floating button on every page), phone,
  email, and the contact form, which emails the studio through Resend.
- **Hosting and domain:** the site is on Vercel. creativestudioindia.com
  currently serves the old site through Bink Infotech, and the cutover waits for
  the new build and Dev's go-ahead.
- **Visitors:** in India and abroad, on phones and desktops.

## Capabilities and Constraints

- **Pages:** home, projects (filterable by type and status), project detail,
  studio/about, services, sketches, contact.
- **Services offered:** Architecture, 3D Visualization, CAD & Documentation.
  Whether planning, interiors or landscape belong on the list is undecided
  (client question 6.1).
- **Content model:** the five Sanity document types are project, teamMember,
  sketch, now and siteSettings.
- **Undecided facts:** years of practice (the site says 35, the principal's bio
  says 25+, client question 1.2), the "700+ projects" figure (1.3), and which of
  two sets of contact details is correct (1.4).
- **Video:** short silent hero loops are under discussion. Spec 0001 rules out
  hosting video on Sanity file storage (no transcoding, and a bandwidth bill that
  grows with every visitor), so any video needs a separate host first.

## Brand Commitments

- The name is **Creative Studio India**, everywhere on the site (confirmed
  2026-11-01). The header shows it on one line; elsewhere it may stack.
- The principal is referred to as **principal designer Jignesh Patel**.

## Evidence on Hand

- **16 projects** in Sanity, each with a cover image, a gallery (1–20 images,
  some captioned), category, status and often an area.
- **About 60 projects** on the studio's list, with Google Maps links, types,
  areas and statuses. See `CSI WEBSITE_PROJECT LIST.xlsx`.
- **A portfolio PDF**, `CREATIVE STUDIO_Portfolio.pdf`, which is image-only.
- **Principal photo and bio**, plus three team members with photos.

Do not fabricate the following, which are absent or unreliable:
- **Project write-ups:** none exist yet.
- **Years and locality names:** no project has either.
- **Sketches:** the 12 in Sanity are placeholders made from four sample images.
- **News:** the four "Now" entries (an IIA award, an Architectural Digest India
  feature, a CEPT talk, a "Riverside Bungalow") are invented demo data.
- **Credibility material:** there are no testimonials, awards, press, client
  names or published credentials.

`docs/client-questions.md` tracks every open item. Never fill these gaps with
invented copy or claims.

## Product Principles

1. **The work leads.** Photographs and drawings of real buildings carry the
   site. Interface and copy stay out of their way.
2. **Never invent credibility.** Only state what the studio can stand behind.
   An empty section is better than a fabricated one.
3. **A way to talk is always one step away.** WhatsApp, phone or form, from any
   page, without hunting.
4. **The studio can run it alone.** Every page has to hold up with the content
   the studio itself publishes, including incomplete content.
5. **Show the hand.** The principal and the sketches are what make this practice
   distinct. Give them weight once real material exists.

## Accessibility & Inclusion

No formal WCAG target has been set yet (deferred in `docs/scope/scope.md`).
Commitments already in place:
- Touch targets of at least 44px.
- Reduced-motion alternatives for every animation.
- Keyboard-reachable menus with Escape to close.
- A pause control for any auto-playing motion longer than 5 seconds.
