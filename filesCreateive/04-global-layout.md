Read AGENTS.md first and follow it strictly.

Create the root layout at app/layout.tsx. Apply the DM Sans and Cormorant Garamond font CSS variables from next/font/google to the html element. Set the default background to #FAFAF8 and default text color to #1A1A17.

Set up default site metadata using Next.js Metadata API. Pull the site name, description, and default OG image from constants/site.ts. Set metadataBase to the production Vercel URL.

Create the (site) route group layout at app/(site)/layout.tsx. This layout renders Nav, the page children, Footer, and WhatsAppButton. Nav and Footer are placeholder components for now — just render their names as divs so the layout compiles.

Create placeholder components for Nav, MobileNav, Footer, and WhatsAppButton in components/layout/. Each should return a clearly labeled placeholder div for now. They will be fully implemented in separate prompts.

Wrap app/layout.tsx children with a Framer Motion AnimatePresence block for future route transition support.

Do not implement any Nav or Footer UI yet. Do not change any Sanity or API files.
