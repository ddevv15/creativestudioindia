Read AGENTS.md first and follow it strictly.

Implement ContactCTA.tsx as shown in the attached design exactly. This is the final section before the footer on the homepage.

Background: ink (#1A1A17).

Layout: centered, generous padding (96px vertical on desktop, 64px mobile).

Content:
- Section label: "06 / Contact" in section-label utility class, color rgba(255,255,255,0.4)
- Headline: "Have a project in mind?" in Cormorant Garamond 52px desktop / 36px mobile, color white, line-height 1.1
- Sub-copy: "Let's talk about what you want to build." in DM Sans 17px, rgba(255,255,255,0.6)
- Two buttons side by side (stacked on mobile):
  1. "Start a project →" — primary, white background, #1A1A17 text, border-radius: 0, 48px height
  2. "Call us →" — ghost, white border, white text, border-radius: 0, 48px height — href is tel:[phone number from constants/site.ts]

"Start a project →" button routes to /contact.

GSAP ScrollTrigger entrance: headline fades in from Y: 32px → 0, opacity 0 → 1, 0.6s. Buttons fade in 0.2s later. Trigger: "top 80%".

Do not change any previously built section, Nav, Footer, or Sanity files.

---

[Attach Figma design: Contact CTA section]
