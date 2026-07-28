# UI Registry — Creative Studio India

The consistency reference for this interface. Read this **before** building any new
component. When a component type already has an entry, match it exactly.

Source of truth for design decisions is [`AGENTS.md`](AGENTS.md) and the specs in
[`filesCreative/`](filesCreative/). This file records what the code *actually does*, so
the two can be checked against each other.

---

## Baseline — Established 2026-07-28

*(Established via `/imprint audit` across 38 component and page files.)*

| Property | Correct class |
| --- | --- |
| Page background | `bg-offwhite` (`#FAFAF8`) |
| Alternate section background | `bg-linen` (`#F1EFE8`) |
| Dark section background | `bg-charcoal` (`#2C2C2A`) |
| Darkest / footer + CTA background | `bg-ink` (`#1A1A17`) |
| Card background | `bg-offwhite` on linen, `bg-linen` on offwhite |
| Border radius — everything | `rounded-none` |
| Border radius — pills only | `rounded-full` |
| Hairline divider | `border-[0.5px] border-stone/20` |
| Input border | `border-stone/30` |
| Text — primary | `text-ink` |
| Text — secondary | `text-stone` |
| Text — on dark, label | `text-white/40` |
| Text — on dark, body | `text-white/60` |
| Text — on dark, strong | `text-white` |
| Accent / link | `text-red` (flat token — `text-red-500` does not exist) |
| Page gutter | `px-24 md:px-48` |
| Section vertical rhythm | `py-96` |
| Image hover zoom | `md:group-hover:scale-[1.04]`, 400ms ease |

### Typography scale

| Role | Class |
| --- | --- |
| Page `h1` (display) | `display-headline text-[52px]` — 44px contact, 56px about/detail, 64px home hero |
| Section `h2` (display) | `display-headline text-[40px]` |
| Card / sub heading | `font-sans text-[18px] font-medium` |
| Body | `font-sans text-base leading-[1.75]` |
| UI / link text | `font-sans text-[13px]` |
| Caption / meta | `font-sans text-[12px]` |
| Section label | `.section-label` utility (11px, uppercase, 0.07em) |

**Cormorant Garamond (`display-headline`) is for 40px and above only.** DM Sans
(`font-sans`) for everything else. This is a locked decision in `AGENTS.md`.

### Spacing convention — read this before writing any class

`tailwind.config.ts` **overrides** the spacing scale. Keys `4, 8, 16, 24, 32, 48, 64, 96`
mean **pixels**; `128` is new; every *other* key is stock Tailwind.

```
p-4  → 4px   (overridden)      p-2  → 8px   (stock 0.5rem)
p-16 → 16px  (overridden)      p-6  → 24px  (stock 1.5rem)
p-96 → 96px  (overridden)      p-12 → 48px  (stock 3rem)
```

Never paste stock shadcn/Tailwind classes without converting them. Use an arbitrary
value (`h-[36px]`) when the pixel figure is not on the overridden scale.

### Design-token variables

`app/globals.css` defines shadcn's tokens as **bare HSL channels** (`60 17% 98%`),
because `tailwind.config.ts` consumes them as `hsl(var(--token))`. Never paste
`oklch(...)` values in — `hsl(oklch(...))` is invalid CSS and browsers discard it
silently, which renders primitives fully transparent.

---

## Components

### Page section shell

File: all of `app/(site)/**/page.tsx`
Last updated: 2026-07-28

| Property | Class |
| --- | --- |
| Background | `bg-offwhite` / `bg-linen` alternating; `bg-charcoal` or `bg-ink` for dark |
| Spacing | `px-24 py-96 md:px-48` |
| Label | `.section-label`, plus `!text-white/40` on dark |
| Heading | `display-headline text-[40px] text-ink` (h2) |
| Body | `font-sans text-base leading-[1.75] text-stone` |

**Pattern notes:** Page heroes use `pt-96` with no bottom padding when a filter or
sub-block follows. `/about` and `/sketches` heroes use `py-[80px]` — that breaks the
`py-96` rhythm deliberately because specs 18 and 20 both name "80px padding". Do not
"correct" it.

---

### ProjectCard

File: [components/ProjectCard.tsx](components/ProjectCard.tsx)
Last updated: 2026-07-28

| Property | Class |
| --- | --- |
| Container | `aspect-[3/2] overflow-hidden` |
| Radius | `rounded-none` (default) |
| Overlay | `bg-gradient-to-b from-transparent to-black/65` |
| Text — primary | `font-sans text-[14px] font-medium text-white` |
| Text — secondary | `font-sans text-[11px] text-white/60` |
| Spacing | `p-16` inside overlay |
| Hover | `md:group-hover:scale-[1.04]`, 400ms ease + Framer underline `width: 0 → 100%` |
| Shadow | none |
| Accent | none |

**Pattern notes:** 3:2 ratio is locked in `AGENTS.md`. The 1.04 zoom is mandated by
spec 10 line 10 — **it is the canonical image-hover value**; align new components to it
rather than the other way round. Category renders through `CATEGORY_LABELS`, never the
raw schema slug. Takes an optional `priority` prop — set it on the first above-the-fold
card so it is not an unoptimised LCP.

---

### FilterTabs

File: [components/FilterTabs.tsx](components/FilterTabs.tsx)
Last updated: 2026-07-28

| Property | Class |
| --- | --- |
| Radius | `rounded-full` — the one sanctioned exception |
| Border | `border-[0.5px]`; `border-stone` inactive, `border-transparent` active |
| Text — active | `text-white` over `bg-ink` indicator |
| Text — inactive | `text-stone`, `hover:text-ink` |
| Spacing | `px-24 py-8`, `gap-8` between pills |
| Active indicator | Framer `layoutId`, spring `stiffness: 380, damping: 32` |

**Pattern notes:** The active pill keeps a *transparent* 0.5px border so pills never
resize as selection moves — without it the `layoutId` indicator visibly jitters. Any
future segmented control should copy this.

---

### SketchCard

File: [components/SketchCard.tsx](components/SketchCard.tsx)
Last updated: 2026-07-28

| Property | Class |
| --- | --- |
| Border | `border-[0.5px] border-stone/15` |
| Radius | `rounded-none` |
| Image fit | `object-contain` — sketches must never be cropped |
| Text — primary | `font-sans text-[13px] text-stone` |
| Accent link | `font-sans text-[12px] text-red` |
| Spacing | `px-16 pb-16 pt-8` |

**Pattern notes:** `stone/15` here is spec 20's explicit "15% opacity" and is the one
sanctioned deviation from the `/20` divider baseline. Image sits in a `<button>`;
the related-project `<Link>` is a **sibling**, never nested inside it.

---

### TeamCard

File: [components/TeamCard.tsx](components/TeamCard.tsx)
Last updated: 2026-07-28

| Property | Class |
| --- | --- |
| Container | `aspect-square overflow-hidden` |
| Placeholder background | `bg-linen` |
| Text — primary | `font-sans text-[14px] font-medium text-ink` |
| Text — secondary | `font-sans text-[12px] text-stone` |
| Spacing | `mt-16` name, `mt-4` role |
| Hover | Framer `grayscale(100%) → grayscale(0%)`, 0.3s |

**Pattern notes:** Branches on whether the resolved photo URL is empty, not on a demo
flag — real Sanity photos activate the `<Image>` path with no code change. The
placeholder branch animates `color` instead of `filter` so the hover still reads.

---

### Lightbox (shared)

File: [components/Lightbox.tsx](components/Lightbox.tsx)
Last updated: 2026-07-28

| Property | Class |
| --- | --- |
| Overlay | `bg-black/90` via `overlayClassName` |
| Content | `max-w-none border-0 bg-transparent p-24 text-white shadow-none` |
| Image | `max-h-[90vh] w-auto object-contain` |
| Caption | `font-sans text-[12px] text-white/60` |

**Pattern notes:** `text-white` on the content is load-bearing — DialogContent's built-in
✕ inherits its colour and would otherwise render ink-on-black. Always pass a
`sr-only` `DialogTitle` or Radix warns. Used by both spec 17 and spec 20; build any
future image viewer on this rather than a second dialog.

---

### ContactForm

File: [components/ContactForm.tsx](components/ContactForm.tsx)
Last updated: 2026-07-28

| Property | Class |
| --- | --- |
| Field border | `border-stone/30` |
| Field text | `font-sans text-[14px] text-ink`, placeholder `text-stone/50` |
| Label | `font-sans text-[11px] uppercase tracking-wider text-stone` |
| Radius | `rounded-none` on every control |
| Spacing | `gap-24` between fields, `mt-8` label→field |
| Submit | `h-48 w-full bg-ink text-white hover:bg-ink/90`, `text-[13px]` |
| Error | `text-red`, `role="alert"` |
| Success panel | `border-[0.5px] border-stone/30 bg-linen p-32` |

**Pattern notes:** 48px submit height and 0 radius are spec 21 requirements and were
verified in-browser. Uses controlled `useState` — no form library, by spec.

---

### Primary button / CTA

File: [components/sections/ContactCTA.tsx](components/sections/ContactCTA.tsx), services CTA
Last updated: 2026-07-28

| Property | Class |
| --- | --- |
| Shape | `flex h-48 items-center justify-center px-32` |
| Radius | `rounded-none` |
| On dark — primary | `bg-white text-ink hover:bg-white/90` |
| On dark — secondary | `border border-white text-white hover:bg-white/10` |
| On light — primary | `bg-ink text-white hover:bg-ink/90` |
| Text | `font-sans text-[13px]` |

**Pattern notes:** 48px is the standard button height sitewide. Labels end with `→`.
Prefer this pattern over the shadcn `Button` for page-level CTAs; use `Button` where a
form control is genuinely needed.

---

### Text link

Files: throughout
Last updated: 2026-07-28

| Property | Class |
| --- | --- |
| On light | `font-sans text-[13px] text-ink underline-offset-4 hover:underline` |
| On dark | `font-sans text-[13px] text-white hover:text-white/50` |
| Accent | `font-sans text-[12px] text-red underline-offset-4 hover:underline` |

**Pattern notes:** `underline-offset-4` always accompanies `hover:underline`.

---

### ScrollProgress

File: [components/ScrollProgress.tsx](components/ScrollProgress.tsx)
Last updated: 2026-07-28

| Property | Class |
| --- | --- |
| Shape | `fixed left-0 top-0 z-50 h-[2px] w-full origin-left scale-x-0` |
| Accent | `bg-red` |

**Pattern notes:** GSAP `scrub: true` inside `gsap.context()`; `ctx.revert()` on unmount
is what makes it Strict-Mode safe. Verified 0 → 0.61 → 1.0 across the page.

---

### shadcn primitives

Files: [components/ui/](components/ui/)
Last updated: 2026-07-28

| Property | Class |
| --- | --- |
| Radius | `rounded-none` throughout |
| Panel background | `bg-popover` / `bg-background` → offwhite via tokens |
| Panel border | `border border-border` |
| Hover state | `bg-accent` → linen via tokens |
| Muted text | `text-muted-foreground` → stone via tokens |

**Pattern notes:** All five primitives were regenerated then hand-corrected — stock
shadcn spacing renders at ~¼ size under the spacing override (`h-8` produced an 8px-tall
button, `size-4` produced 4px icons). Each file carries a header note. Colour comes from
the remapped variables in `globals.css`, so **restyle by editing those tokens, not by
patching classes component-by-component.**

---

## Sanctioned exceptions

These deviate from the baseline **on purpose**. Do not "fix" them.

| Value | Where | Why |
| --- | --- | --- |
| `bg-[#25D366]` | [WhatsAppButton.tsx:28](components/layout/WhatsAppButton.tsx#L28) | WhatsApp's official brand green; must not be palette-shifted |
| `rounded-full` | FilterTabs, WhatsApp FAB, category tag | The documented pill exception in `AGENTS.md` |
| `border-stone/15` | SketchCard | Spec 20 names "15% opacity" explicitly |
| `py-[80px]` | `/about`, `/sketches` heroes | Specs 18 and 20 both name "80px padding" |
| `text-white/65` | Project detail hero strip | Spec 17 names `rgba(255,255,255,0.65)` |

---

## Components to fix

Ordered by severity.

**1. Nav is illegible on four routes — WCAG failure.**
[components/layout/Nav.tsx:31-32](components/layout/Nav.tsx#L31-L32)
The nav is transparent with white text until scrolled past `window.innerHeight`. That
assumes every page opens with a full-viewport dark hero. `/projects`, `/about`,
`/services`, and `/contact` open on linen or offwhite, so the links are white-on-offwhite:
**measured contrast 1.05:1, against a 4.5:1 AA requirement.** `/sketches` is affected
below its short charcoal hero.
→ Either make the nav solid by default and transparent only on the routes with dark
heroes (`/`, `/projects/[slug]`, `/sketches`), or give the interior heroes dark
backgrounds. This is a design call, not just a code fix.

**2. Muted-white opacity drift — 4 undirected values.**
`text-white/50` (Footer), `/55` (SketchesStrip), `/70` (Hero, SketchesStrip), `/80`.
→ Collapse to the three baseline roles (`/40` label, `/60` body, `/80` strong). All are
in homepage/layout components, which every spec marks as do-not-touch, so these are
recorded rather than changed.

**3. Border opacity drift — `border-stone/40`.**
About blockquote and Recognition badge.
→ Move to `border-stone/20` to match the divider baseline.

**4. Hardcoded palette hex in a component.**
[components/TeamCard.tsx:45-46](components/TeamCard.tsx#L45-L46) — `"#5F5E5A"` / `"#C0391B"`.
Framer Motion cannot interpolate `var()`, so concrete values are required here, but they
duplicate palette values that would silently diverge if the brand red changed.
→ Import them from a shared constants export rather than inlining.

**5. Transient horizontal overflow on the homepage at 390px.**
`gsap.from({ x: 30 })` parks FounderBlock's copy column 30px right until its
ScrollTrigger fires, adding ~6px of document scroll width.
→ `overflow-x-clip` on the section wrapper. Pre-existing.
