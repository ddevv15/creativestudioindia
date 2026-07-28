Read AGENTS.md first and follow it strictly.

Build the Studio/About page at app/(site)/about/page.tsx. The nav label is "Studio" but the URL is /about. Do not confuse this with the Sanity Studio at /studio.

This is a long-scroll page. Build each of the following sections in order as specified below:

Page hero: linen (#F1EFE8) background. Section label "Studio". Headline "25 years of intentional design." Cormorant Garamond 56px. No image needed — typography-only hero. 80px padding.

Firm story: two paragraphs about the firm's history and philosophy. Pull from siteSettings.principalBio (Portable Text). DM Sans 17px, line-height 1.75, max-width 680px, centered.

Principal section: two-column layout (photo left, copy right). principalPhoto from siteSettings. Name, credentials, and a brief quote. Same layout as FounderBlock.tsx on the homepage — reuse the layout pattern but do not reuse the component (this version has different copy structure).

Process section: three horizontal steps showing the design journey — Sketch → Render → Build. Each step has a step number (01, 02, 03), a label, and a one-sentence description. Use placeholder images for now (a sketch sample, a render sample, a completed project photo from Sanity if available). This section has charcoal (#2C2C2A) background.

Team section: headline "The team behind the work." Grid of TeamCard.tsx components fetched from Sanity getAllTeamMembers. TeamCard.tsx: square portrait photo, greyscale by default using CSS filter: grayscale(100%), colour on hover (filter: grayscale(0), Framer Motion transition 0.3s). Name and role below. Grid: 4 columns desktop, 3 tablet, 2 mobile.

Recognition section (conditional): only render this section if there are now items in Sanity with type: award or type: press. Headline "Recognition." Simple card list — each card shows date, type badge, and title. Linen background.

Set page metadata: title "Studio | Creative Studio India".

Do not change the homepage, projects pages, Nav, Footer, or Sanity schemas.
