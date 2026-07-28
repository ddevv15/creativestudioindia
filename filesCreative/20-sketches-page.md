Read AGENTS.md first and follow it strictly.

Build the Sketches gallery page at app/(site)/sketches/page.tsx to the written specification below.

Page hero: charcoal (#2C2C2A) background. Section label "Process" in rgba(255,255,255,0.4). Headline "Design begins by hand." Cormorant Garamond 52px, white. Sub-copy: "Every building we have designed started as a sketch. This is where ideas become architecture." DM Sans 17px, rgba(255,255,255,0.6). 80px padding vertical.

Gallery: CSS columns masonry layout below the hero. White (#FAFAF8) background.
- Desktop (lg): column-count: 3, column-gap: 12px
- Tablet (md): column-count: 2
- Mobile: column-count: 1
- Each SketchCard.tsx renders inside a break-inside-avoid-column wrapper div

SketchCard.tsx:
- Next.js <Image> with width/height or fill — use object-contain so sketches are not cropped
- Below the image: sketch title in DM Sans 13px, stone color
- If relatedProject reference is present: "See the built project →" link in DM Sans 12px, red (#C0391B), routes to /projects/[slug]
- Subtle 0.5px border around the card in stone at 15% opacity. No border-radius.

Fetches all sketches from Sanity using getAllSketches GROQ query, including the relatedProject slug via a GROQ projection (_id, title, image, year, relatedProject->{ slug }).

Clicking any sketch image opens it in a shadcn Dialog (lightbox) at full size. Dialog background: rgba(0,0,0,0.9). Image centered with max-height: 90vh. Close on backdrop click or ✕ button.

Set page metadata: title "Sketches | Creative Studio India".

Do not change any other page, section, Nav, Footer, or Sanity schemas.
