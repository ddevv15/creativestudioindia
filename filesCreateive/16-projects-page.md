Read AGENTS.md first and follow it strictly.

Build the projects listing page at app/(site)/projects/page.tsx and the FilterTabs.tsx component.

FilterTabs.tsx:
- Horizontal row of pill-shaped filter buttons (border-radius: 9999px — the one exception to sharp corners)
- Options: All · Bungalows · Residential · Commercial · Mixed-Use
- Active tab: #1A1A17 background, white text
- Inactive tab: transparent background, stone text, 0.5px stone border
- Active indicator animates between tabs using Framer Motion layoutId on a background span (layout animation)
- On tab change, emits the selected category string to the parent via an onChange prop

Projects page:
- Page header: section label "Projects", headline "Our work." in Cormorant Garamond 52px. Linen (#F1EFE8) background.
- FilterTabs below the headline — "All" selected by default
- Project count line: "Showing [n] projects · [active category]" in DM Sans 12px, stone. Updates on filter change.
- Grid: 3 columns desktop (lg), 2 columns tablet (md), 1 column mobile. Uses ProjectCard.tsx.
- Filter logic: fetch all projects from Sanity on the server using getAllProjects GROQ query (ordered by the order field). Pass all projects to a client component wrapper that handles the filter state and renders the filtered subset.
- Framer Motion AnimatePresence on the grid: cards fade out (opacity 0, scale 0.97) then fade in (opacity 1, scale 1) when the filter changes. Duration 0.25s.

Set page metadata: title "Projects | Creative Studio India".

Do not change any homepage section, Nav, Footer, or Sanity schemas.

---

[Attach Figma design: Projects listing page]
