Read AGENTS.md first and follow it strictly.

Implement FounderBlock.tsx to the written specification below.

Background: linen (#F1EFE8).

Two-column layout on desktop (lg and above): left column is the principal photo, right column is the copy. On mobile: stacked, photo above copy.

Left column: principalPhoto from Sanity siteSettings. Rendered as Next.js <Image> with a fixed aspect ratio (4:5 portrait). No border-radius. Full bleed to the column edge.

Right column:
- Section label: "03 / Studio"
- Name: "Jignesh Patel" in DM Sans 13px, stone color, uppercase tracked — above the headline as a preheader
- Headline: "25 years of design. One principle." in Cormorant Garamond 40px, ink color
- Body copy: principalBio from Sanity siteSettings rendered as Portable Text (use @portabletext/react). DM Sans 16px, stone color, line-height 1.7. Cap at 3 paragraphs on homepage.
- CTA text link: "Meet the studio →" — routes to /about

GSAP ScrollTrigger entrance: right column content fades in from X: 30px → 0, opacity 0 → 1, staggered 0.15s per element. Left column photo fades in opacity 0 → 1. Trigger: "top 75%".

Do not change any previously built sections, Nav, Footer, or Sanity files.
