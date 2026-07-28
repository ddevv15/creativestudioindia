# Memory — Creative Studio India

Last updated: 2026-07-28

> **Scope.** [`REGISTRY.md`](REGISTRY.md) owns spec-by-spec status. [`AGENTS.md`](AGENTS.md)
> owns the rules. [`filesCreative/`](filesCreative/) (specs 01–23) owns the requirements.
> This file holds what those three don't: verified tree state, traps, and live decisions.
> Don't duplicate the registry's tables here.

## What was built

No application code this session — it was audit, correction, and doc repair.

- **Full codebase audit.** Read all 23 specs in `filesCreative/` against the working
  tree and ran the toolchain. Findings below are verified, not inferred.
- **Rewrote [`REGISTRY.md`](REGISTRY.md)** from that audit. The previous version was
  committed in `eb089e0` and already contradicted the tree in three places. New
  verified tally: **✅ 13 · 🟡 3 · ⬜ 7**.
- **Removed the Figma dependency across 18 files.** Stripped 15 `[Attach Figma
  design: …]` trailers and rewrote 13 inline "as shown in the attached design"
  references to point at the written spec. Rewrote the `AGENTS.md` UI Rules and Final
  Reminder to name `filesCreative/` as the design source of truth.
- Seeded and then merged this file.

Nothing in `app/`, `components/`, or `lib/` was touched. Changes are docs + specs only.

## Decisions made

- **There are no Figma files and there will not be.** The written spec is the design
  source of truth. Do not reintroduce a Figma dependency or treat missing designs as
  a blocker. Where a spec is silent on a value, follow the locked design decisions in
  `AGENTS.md` and match the patterns already set by the built homepage sections.
- **The homepage runs on mock data deliberately.** [`lib/demoData.ts`](lib/demoData.ts)
  feeds `app/(site)/page.tsx` so the client can preview the design before the CMS
  exists. Load-bearing for the preview — do not revert casually.
- **`lib/sanity/client.ts` hardcodes `"demo"`/`"production"` fallbacks** so
  `createClient()` doesn't throw while env vars are empty. Real values win when set.
- **GSAP/ScrollTrigger is registered centrally in [`lib/gsap.ts`](lib/gsap.ts).**
  Specs 05 and 22 both say "register in `Nav.tsx`" — the central module is better and
  still single-registration. **Treat the specs as outdated here, not the code.**

## Problems solved

### The demo shim breaks silently if reverted out of order

Removal is a **4-step, order-sensitive** procedure documented in the header of
`lib/demoData.ts`:

1. Delete `lib/demoData.ts` and `public/demo/*`
2. Restore the Sanity fetches in `app/(site)/page.tsx`
3. Delete the DEMO SHIM block in `lib/sanity/image.ts`
4. Fill real env vars (the `client.ts` fallbacks then go inert)

Skip step 3 and `urlFor()` keeps probing for a `_demoUrl` field that real Sanity image
objects don't have. `demoImage()` casts via `as unknown as SanityImageObject`, so
**TypeScript cannot catch this** — it fails at runtime, not build time.

### Tailwind's spacing scale is OVERRIDDEN, not extended

[`tailwind.config.ts`](tailwind.config.ts) sets `spacing: { '4':'4px', '8':'8px', … }`.
Keys `4` and `8` already exist in stock Tailwind as `1rem`/`2rem`. So here `p-4` = **4px**,
`gap-8` = **8px**.

Existing code is written against the override and is internally consistent —
[`Nav.tsx`](components/layout/Nav.tsx) uses `h-96` meaning 96px, `px-48` meaning 48px.
**Do not "fix" these.**

The landmine: shadcn primitives assume *default* spacing. Specs 17, 20, 21 all require
generating them (Dialog, Select, Input, Textarea, Button). Every one will land with
~4× too little padding. Audit each before use.

### The `red` token replaces Tailwind's entire red palette

`colors: { red: '#C0391B' }` is a string, not a scale. `text-red-500`, `bg-red-50` **do
not exist** in this project. Only bare `text-red` / `bg-red`. Same for `deepred`.
Spec 20 needs red on the sketch card link — use `text-red`.

### `constants/site.ts` contains plausible fakes, not real data

An earlier note in this file claimed real values had been filled in. **That was wrong.**
The `TODO:` strings were replaced with realistic-looking placeholders (an Ahmedabad
address, a `+91` phone, a matching WhatsApp number, a studio email, and bare
`instagram.com/` / `linkedin.com/` roots). More dangerous than `TODO:` because nothing
scans as unfinished — yet the WhatsApp FAB, footer socials, and the `ContactCTA` `tel:`
link all point somewhere wrong.

## Current state

Verified 2026-07-28 by running the toolchain, not by reading the registry:

```
npm run typecheck  → exit 0
npm run lint       → exit 0
npm run build      → passes, 13 routes generated
```

The repo is green. What's missing is **unbuilt, not failing**.

Stack: Next 15.5.19 · React 19.1.0 · Tailwind 3.4.19 · GSAP 3.15 · Framer Motion 12.40 ·
next-sanity 9.12.3 · Resend 6.14 (installed, unused) · @portabletext/react 6.2.

- **`/` homepage** — built, all 7 sections, on demo data.
- **6 interior routes are `return null` stubs** — `/projects`, `/projects/[slug]`,
  `/about`, `/services`, `/sketches`, `/contact`. The homepage links to all of them.
- **`components/ui/` is empty** — zero shadcn primitives generated.
- **All 5 Sanity schemas match spec 03 field-for-field.** That layer is done.
- **All 6 keys in `.env.local` are present but EMPTY.** No Sanity project is
  provisioned. No secrets are stored in this repo.
- **`memory.md` is untracked** (`?? memory.md`). Commit vs gitignore is undecided.

### Gaps the registry didn't catch

- `/api/revalidate` has **no `sketch` case** — sketch edits fall through to `default`,
  which revalidates `/` only. Harmless today; a silent content bug once `/sketches` ships.
- [`types/sanity.ts`](types/sanity.ts) has 3 of 5 document types, and `Project` is the
  6-field homepage projection, not the full 15-field document. No `TeamMember`, no `Now`.
  `AGENTS.md` claims all types live there.
- `getAllSketches` omits the `relatedProject->{ slug }` projection spec 20 requires.
- `robots.ts` disallows `/studio` but not `/api/` (spec 23 wants both).
- Build warns: `The default export of @sanity/image-url has been deprecated. Use the
  named export createImageUrlBuilder instead.` One-line fix in `lib/sanity/image.ts`.

## Next session starts with

**Phase 0 — shared unblockers.** Nothing on specs 16–21 can proceed without these:

1. Write the 4 empty GROQ queries in [`lib/sanity/queries.ts`](lib/sanity/queries.ts) —
   `getAllProjects`, `getProjectBySlug`, `getAllTeamMembers`, `getAllNowItems` — add
   `getRelatedProjects`, and add `relatedProject->{ slug }` to `getAllSketches`.
2. Expand [`types/sanity.ts`](types/sanity.ts) — full `Project`, plus `TeamMember` and `Now`.
3. Generate shadcn primitives into `components/ui/` (Button, Input, Textarea, Select,
   Dialog), then immediately audit their padding against the spacing override.

Then **spec 16 — `/projects` + `FilterTabs.tsx`**, which turns the nav into real navigation.

Alternative if visible progress is wanted first: **spec 19 (Services)** is nearly static
and needs none of Phase 0.

Full order in [`REGISTRY.md`](REGISTRY.md) §6.

## Open questions

- **When is the Sanity project provisioned?** Phase 0 steps 1–2 can be written but not
  verified against real content until a dataset exists.
- **Do interior pages get built on demo data too**, so the client preview covers the whole
  site — or do they wait for Sanity? Biggest unresolved call; it changes the build order.
- **When does the demo build get reverted?** Needs a trigger condition, not a vibe.
- **What are the studio's real contact details?** Blocks launch. Needs Jignesh to supply
  address, phone, WhatsApp, email, and the real Instagram/LinkedIn URLs.
- **Commit `memory.md` or gitignore it?**
