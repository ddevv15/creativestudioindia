Read AGENTS.md first and follow it strictly.

Implement WhatsAppButton.tsx. It is a fixed floating button, always visible, positioned bottom-right (bottom: 24px, right: 24px) on both mobile and desktop.

The button links to https://wa.me/[WHATSAPP_NUMBER] where the number is pulled from constants/site.ts. It opens in a new tab.

The button renders the WhatsApp icon (use an inline SVG — do not install an icon library for this). Background is #25D366 (WhatsApp green). Shape is a circle, 52px × 52px. No border-radius: 0 exception here — this is a floating action button, not an architectural UI element.

Add a subtle drop-shadow. On hover, scale to 1.05 using a Framer Motion whileHover.

Do not change any other component, layout, or page.
