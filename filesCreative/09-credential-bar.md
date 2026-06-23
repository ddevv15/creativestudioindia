Read AGENTS.md first and follow it strictly.

Implement CredentialBar.tsx as shown in the attached design exactly.

It is a thin single-line horizontal strip sitting immediately below the hero. Background is linen (#F1EFE8). Padding: 14px vertical.

It renders eight credential tokens in a row, separated by a center-dot (·) in stone (#5F5E5A):

- 25+ Years
- Ahmedabad
- Architecture
- 3D Visualization
- Bungalows
- Residential
- Commercial
- Mixed-Use

Each token is in DM Sans, 12px, font-weight 500, color stone (#5F5E5A), uppercase, letter-spacing 0.05em.

On mobile (below md), the strip scrolls horizontally with overflow-x: auto and white-space: nowrap. Hide the scrollbar visually (scrollbar-width: none / ::-webkit-scrollbar: none).

Add a GSAP ScrollTrigger entrance: the strip fades in and translates up 16px → 0 when it enters the viewport. Trigger: "top 90%".

Do not change the Hero, Nav, Footer, or any other file.
