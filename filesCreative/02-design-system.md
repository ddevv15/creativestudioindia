Read AGENTS.md first and follow it strictly.

Implement the full design system using Tailwind CSS v3. Extend tailwind.config.ts with the complete design token set defined in AGENTS.md.

Colors — extend the palette with these exact tokens:
- ink: #1A1A17
- charcoal: #2C2C2A
- stone: #5F5E5A
- linen: #F1EFE8
- offwhite: #FAFAF8
- red: #C0391B
- deepred: #8C2812

Typography — configure two font families using next/font/google:
- display: Cormorant Garamond (weights: 400, 500) — for headlines 40px and above only
- sans: DM Sans (weights: 400, 500, 600) — for all other text

Add both font CSS variables to the root layout and reference them in tailwind.config.ts fontFamily.

Spacing — extend the Tailwind spacing scale with a base-8 system: 4, 8, 16, 24, 32, 48, 64, 96, 128.

Add global CSS to app/globals.css:
- CSS custom properties for all color tokens
- A section-label utility class: 11px, DM Sans, uppercase, letter-spacing 0.07em, color stone
- A display-headline utility class: Cormorant Garamond, font-weight 500, line-height 1.1, letter-spacing -0.02em

Do not build any page or component UI yet. Verify that a test className using the new tokens resolves correctly in the build.
