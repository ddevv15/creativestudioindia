---
name: Creative Studio India
description: An architect's drawing board: ruled, measured and quiet, so the buildings lead.
colors:
  ink: "#1A1A17"
  charcoal: "#2C2C2A"
  stone: "#5F5E5A"
  linen: "#F1EFE8"
  offwhite: "#FAFAF8"
  red: "#C0391B"
  deepred: "#8C2812"
  glow-blush: "#E8A598"
  glow-sand: "#D9B98C"
  glow-sage: "#A9BFA0"
  glow-sky: "#9DB7C9"
  glow-lilac: "#B9A7C6"
typography:
  page-title:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "clamp(4rem, 9vw, 8.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.03em"
  display:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: "-0.01em"
  display-serif:
    fontFamily: "Cormorant Garamond, serif"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "0.01em"
  title:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1.3
  lead:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.35
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  ui:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "DM Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.01em"
rounded:
  none: "0px"
  pill: "9999px"
spacing:
  "4": "4px"
  "8": "8px"
  "10": "10px"
  "16": "16px"
  "24": "24px"
  "32": "32px"
  "48": "48px"
  "64": "64px"
  "96": "96px"
  "128": "128px"
  gutter-sm: "24px"
  gutter-md: "48px"
  gutter-xl: "60px"
components:
  link-underline:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  link-underline-hover:
    textColor: "{colors.stone}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.offwhite}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    height: "36px"
  filter-dropdown:
    backgroundColor: "{colors.offwhite}"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "44px"
  tag-pill:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "3px 8px"
  header:
    backgroundColor: "{colors.offwhite}"
    textColor: "{colors.ink}"
    height: "90px"
  header-over-image:
    textColor: "{colors.offwhite}"
  menu-overlay:
    backgroundColor: "{colors.offwhite}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
---

# Design System: Creative Studio India

## Overview

**Creative North Star: "The Drawing Board"**

Every page is an architect's working sheet. A single ruled line runs under the
header like the edge of a drawing. Margins are measured, and content sits on a
12-column grid with a 10px gutter. Captions are small mono annotations: location,
year, counts, the way a drawing labels its parts. Photographs of real buildings
are pinned to that grid at deliberate, uneven sizes. Nothing is decorated. The
structure comes from lines, alignment and whitespace, so the work itself carries
the colour and the emotion.

The density is calm, not sparse. Sections breathe (64px on phones, 96 to 128px on
desktop), but every column is used on purpose: an editorial mosaic, a feature
row, a two-column statement. Motion is unhurried and physical. Photos zoom
slowly and fade in as you reach them. The menu drops in like a sheet laid on the
desk, and the hover fill on project cards moves like ink in water. All of it
respects reduced motion.

The world comes from two references the client chose: henninglarsen.com for the
layout and motion language, and zha.com/projects for the project index. It keeps
the studio's own light palette throughout. It is never a dark site.

**Key Characteristics:**
- Light off-white sheet, ink text, photography as the only large colour.
- One full-width ruled line in the header; hairlines (ink at 15 to 20%) as the
  only dividers.
- DM Sans for nearly everything; DM Mono for annotations; Cormorant Garamond for
  at most one display moment per page.
- Square corners everywhere; pills only for tags and filter chips.
- A 12-column grid, 10px gutters, and page margins of 24 / 48 / 60px.
- Slow, physical, interruptible motion with a still alternative for every
  animation.

## Colors

A near-monochrome drawing palette, with warm paper, ink and graphite. Colour
comes from the photographs, from red used as a rare signal, and from five pastel
washes kept for one hover effect.

### Primary
- **Ink** (`ink`): all text, ruled lines, the active underline, filled buttons.
  The default stroke of the drawing.

### Secondary
- **Signal Red** (`red`): the brand red, used only as a rare signal (see The One
  Red Mark Rule). Examples: the one most important call to action on a page, a
  form error, a live or current state that must be noticed.
- **Deep Red** (`deepred`): the pressed or hover state of anything red. Never
  used on its own.

### Tertiary
- **Glow Pastels** (`glow-blush`, `glow-sand`, `glow-sage`, `glow-sky`,
  `glow-lilac`): exist only for the liquid hover fill on /projects cards,
  rotated at random through `--glow-colors`. They're laid on at up to 75%
  strength over off-white, which turns them into soft washes. Never use them for
  text, backgrounds or any other component.

### Neutral
- **Drawing Paper** (`offwhite`): the page. The header turns this colour once you
  scroll, and the menu overlay uses it too.
- **Linen** (`linen`): the one alternate surface, used for panels that need to
  read as a separate sheet (the project intro panel, the next-project panel) and
  as the placeholder behind images while they load.
- **Graphite** (`stone`): secondary text, mono captions, muted menu sub-links,
  and placeholders.
- **Charcoal** (`charcoal`): the fill behind full-bleed photography while it
  loads (hero, cover, banner). Not used for text surfaces.

### Named Rules
**The One Red Mark Rule.** Red appears at most once per screen, and only where
something must be noticed or acted on. If two things on screen are red, one of
them is wrong.

**The Photographs Are The Colour Rule.** Large areas of colour come from real
photographs of the work. The interface never paints a large coloured surface of
its own.

## Typography

**Display Font:** DM Sans (with sans-serif)
**Body Font:** DM Sans (with sans-serif)
**Label/Mono Font:** DM Mono (with monospace)
**Rare Display Serif:** Cormorant Garamond (with serif)

**Character:** A plain, well-drawn grotesk does almost all the work, the way an
architect letters a drawing. DM Mono annotates. The serif is held back for one
moment per page, so it reads as the hand of the studio.

### Hierarchy
- **Page title** (400, 64 / 112 / 136px, line-height 1, -0.03em): one per inner
  page, set huge over its banner image ("Projects").
- **Display** (400, 32px phone to 40px desktop, 1.18, -0.01em): statement
  headlines and section headlines ("Every building here begins as a sketch.").
- **Display serif** (Cormorant 500, 1.1, -0.02em): one oversized moment per
  page, at 40px and above only, such as a large numeral or a single line of
  voice. Never a running headline style.
- **Headline** (400, 28 to 40px, uppercase, 1.15, +0.01em): project names as
  titles (feature rows, project page title, next project).
- **Lead** (400, 20px phone to 24px desktop, 1.35): the right-hand column of a
  statement and a project's introduction. Keep it to about 30ch.
- **Title** (400, 20 to 22px, 1.3): menu rows, note tiles, service names, card
  titles on large cells.
- **Body** (400, 15 to 16px, 1.55): running prose, at most about 60ch.
- **UI** (400 to 500, 13 to 15px): header links, controls, filter labels
  (uppercase 12px at +0.04em), and the footer.
- **Caption** (DM Mono 400, 12px, 1.3, +0.01em, graphite): location, year,
  counts, image captions, the "Projects" or "Studio" label on a section row.

### Named Rules
**The One Serif Moment Rule.** Cormorant Garamond appears at most once per
page, at 40px or larger. A page with two serif moments has lost its focus.

**The Annotation Rule.** DM Mono is for facts about the work (place, date,
number, caption), never for prose or headings. If it isn't something you'd
letter on a drawing, it isn't mono.

## Layout

The page is a sheet with fixed margins: the gutter is 24px on phones, 48px from
768px and 60px from 1280px. Content sits on a 12-column grid with 10px gutters,
at every width from md up. Phones collapse to 2 or 1 columns.

**Composition patterns**
- **Statement:** two halves, a headline left and a lead right, split at the
  exact middle (column 7).
- **Editorial mosaic:** uneven tiles placed at explicit columns, with deliberate
  vertical offsets of 24 to 128px. The rhythm is irregular on purpose, like
  photos pinned to a board.
- **Feature row:** an uppercase title with mono meta at column 10. Below it, a
  wide image (cols 1 to 8) beside portrait companions (cols 9 to 12) of the same
  height, then text under the image.
- **Ruled index:** the /projects grid, with cells divided by hairlines, a large
  2×2 cell beside four small ones, alternating sides.
- **Image pair:** a narrow 4:5 frame beside a wide 16:7 one, mirrored on
  alternate rows.

**Vertical rhythm:** sections are 64px apart on phones and 96px from lg. Mosaic
rows are 64px apart, then 96px. The footer has 96 to 128px above it.

**The menu column.** `--menu-x` is `max(27vw, 320px)`. It's the left edge of the
open menu's content, and the Menu button sits on it from md up. It's also the
width of the footer's first column. Anything aligned to it lines up across the
header, the menu and the footer.

**Full bleed.** Hero sliders, project covers and page banners run edge to edge
at 62 to 92svh. Everything else respects the gutter.

### Named Rules
**The Clear Corner Rule.** The WhatsApp button is fixed in the bottom-right
corner and always visible. Never put an interactive control at the far right
edge of a section; start it at the halfway column instead.

**The Measured Margin Rule.** Every element aligns to the gutter, a grid column
or `--menu-x`. If something sits at an arbitrary x position, it's a mistake.

## Elevation & Depth

Flat. There are no shadows anywhere in the system. Depth comes from three
things:
- **Surface:** linen panels against off-white paper.
- **Photography:** full-bleed images, with a soft ink gradient (ink at 30 to
  60%) only where text sits on a photo.
- **Layering in motion:** the menu covers the page; header text inverts over
  hero images.

Hover depth on images is a slow 1.03 scale inside a clipped frame, never a lift
or a shadow.

### Named Rules
**The Ruled Not Raised Rule.** Separate things with a hairline or a change of
paper, never a shadow. Hairlines use ink at 15 to 20% at 1px. The header rule is
the only 2px line.

## Shapes

Square. Every frame, image, button, input, dropdown, panel and card has a 0px
radius, like cut paper and drafted rectangles. The only rounded form is the pill
(9999px), reserved for tag chips on project cards and nothing else. Images keep
honest aspect ratios: 3:2 for project frames, 4:5 for portrait detail, 4:3 for
sketches, 16:9 for the gallery carousel, and 8:3 or 16:7 for wide features.

### Named Rules
**The Square Corner Rule.** Radius 0 on everything except tag pills. A rounded
button or card is off-system.

## Components

### Links (the primary call to action)
Calm and textual. Most actions are underlined words, not buttons.
- **Style:** ink text, a 1px underline with a 4px offset (7px in the menu),
  13 to 15px DM Sans. An arrow (→) follows when the link moves you forward
  ("Start a project →", "All 16 projects →").
- **Hover:** colour shifts to graphite over 200ms. The underline stays.
- **Placement:** at the start of a column or the halfway column, never the far
  right (The Clear Corner Rule).

### Buttons
- **Shape:** square (0px).
- **Primary:** an ink fill with off-white text, 36px tall and 16px side padding,
  medium 13px. Used where a real button is expected, such as form submit.
- **Hover / Focus:** a colour transition. A 1px ink focus ring. A press scale of
  0.97 on controls.
- **Text controls:** PREV / NEXT and Clear all are uppercase 12 to 13px text
  buttons, at least 44px tall, at 30% opacity when disabled.

### Tag pills
- **Style:** a 1px ink border at 25%, ink text, 11px uppercase at +0.04em,
  3×8px padding, 9999px radius.
- **Use:** type and status on project grid cards only.

### Filter dropdown
- **Style:** a 44px tall field with a 1px border (ink at 25%, ink when open or
  active), uppercase 12px label with a mono count, and a chevron that rotates
  180°.
- **Panel:** square, a 1px ink border on off-white, checklist rows at least 40px
  tall, a linen hover, a check mark for selected. Opens in 150ms (opacity plus a
  4px drop). Escape closes it and returns focus.

### Header
- **Style:** 90px tall (64px on phones). The logo "Creative Studio India" sits on
  one line in uppercase medium at +0.06em. A 2px rule runs from the logo to the
  right gutter. The Menu button sits on `--menu-x`, and the quick links sit on
  the right. Logo, Menu and links share one baseline.
- **States:** off-white text and a transparent background over image heroes at
  scroll 0. After that, an off-white background with ink text. It hides on
  scroll down and returns on scroll up (300ms, ease-in-out).
- **Menu toggle:** two 1.5px lines close into one when open, and the label reads
  Menu or Close.

### Menu overlay (signature)
A full-screen sheet.
- **Image panel:** on the left, as wide as `--menu-x`, showing a featured project
  with a mono location and an uppercase title.
- **Links:** on the right, bottom-aligned 20 to 22px rows, each a primary link
  underlined at a 7px offset followed by graphite sub-links.
- **Motion:** the sheet drops in (300ms). A cover wipes off the image (from
  150ms). The rows slide 10px in, 40ms apart (from 350ms).
- **Accessibility:** the page behind is inert, and Escape closes the menu.

### Project grid card (signature)
A ruled cell holding a 3:2 image, a title with an arrow that turns from → to ↗
on hover, a 2 to 3 line graphite excerpt, and tag pills pinned to the bottom.
- **Hover:** the image scales to 1.03 over 700ms, and a WebGL liquid fill floods
  the cell behind the content in a random glow pastel. It drains on exit.
- **Fallback:** touch screens and reduced motion get a static CSS glow.

### Captioned image
Any photograph with a mono graphite caption 8 to 16px below it. Captions come
from Sanity. A frame without one shows no empty caption line.

## Do's and Don'ts

### Do:
- **Do** build every page on the 12-column, 10px-gutter grid inside the 24 / 48
  / 60px margins.
- **Do** label facts in DM Mono 12px graphite: location, year, count, caption.
- **Do** use underlined text links with → as the main call to action.
- **Do** separate with 1px hairlines (ink at 15 to 20%) or a linen panel.
- **Do** give every animation a reduced-motion fallback and pause controls on
  anything that runs longer than 5 seconds.
- **Do** keep image frames at their fixed ratios (3:2, 4:5, 4:3, 16:9, 8:3,
  16:7) and crop with the Sanity hotspot.
- **Do** align controls to the gutter, a column or `--menu-x`.

### Don't:
- **Don't** use shadows, rounded corners (except tag pills) or a dark page body.
- **Don't** use red more than once per screen, or as decoration.
- **Don't** use Cormorant Garamond more than once per page, or below 40px.
- **Don't** put buttons or links at the far right edge where the WhatsApp button
  sits.
- **Don't** use the glow pastels anywhere except the /projects hover fill.
- **Don't** use the old "01 / About" numbered section labels on redesigned
  pages.
- **Don't** put text on a photograph without the ink gradient behind it.
