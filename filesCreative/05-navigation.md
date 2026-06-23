Read AGENTS.md first and follow it strictly.

Implement Nav.tsx and MobileNav.tsx as shown in the attached design exactly.

Nav.tsx (desktop):
- Fixed position, full width, z-index above hero
- Logo (left): "CREATIVE STUDIO" in DM Sans, 14px, font-weight 500, letter-spacing 0.05em
- Nav links (center): four items from constants/nav.ts — Projects, Studio, Services, Contact — in DM Sans 13px
- CTA button (right): "Start a project →" with border-radius 0 (sharp corners)
- Default state: transparent background, all text white — sits over the dark hero
- Scrolled state: background transitions to #1A1A17 with a 0.5px bottom border at rgba(255,255,255,0.1) — triggered by GSAP ScrollTrigger when the user scrolls past the hero section height
- Active link: current path gets a white underline using Next.js usePathname()

MobileNav.tsx:
- Hidden on desktop (md and above), visible below md
- Logo left, hamburger icon (3 bars, 18px wide, 1.5px stroke) right — both in the same fixed bar
- On hamburger tap: full-screen overlay slides down, background #1A1A17
- Overlay links: all four nav items at 18px, DM Sans, color rgba(255,255,255,0.8), min touch target 44px height, separated by a 0.5px rgba(255,255,255,0.07) border
- "Start a project →" appears below the links in white, font-weight 500
- Close on any link tap or ✕ icon tap

Register GSAP and ScrollTrigger once in Nav.tsx using a useEffect with a cleanup. Do not register them anywhere else.

Do not change the global layout. Do not change any Sanity or API files.

---

[Attach Figma design: Navigation — desktop and mobile states]
