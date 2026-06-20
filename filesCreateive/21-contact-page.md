Read AGENTS.md first and follow it strictly.

Build the contact page at app/(site)/contact/page.tsx and the /api/contact API route at app/api/contact/route.ts as shown in the attached design exactly.

Contact page layout — two columns on desktop (lg and above), stacked on mobile:

Left column: contact details and map
- Section label "Contact"
- Headline "Start a conversation." Cormorant Garamond 44px
- Studio address, phone number (tel: link), and email (mailto: link) from constants/site.ts. DM Sans 15px, line-height 1.9.
- WhatsApp CTA: "Chat on WhatsApp →" text link that opens wa.me URL from constants/site.ts
- Google Maps embed: <iframe> with the studio address. Height 280px, no border, border-radius: 0. Map style should be clean/minimal. Width 100% of the column.

Right column: inquiry form
- Form fields (all DM Sans 14px, border-radius: 0 on all inputs):
  1. Full name (text input, required)
  2. Company / Organization (text input, optional)
  3. Phone number (tel input, required)
  4. Project type (shadcn Select dropdown): Bungalow · Residential · Commercial · Mixed-Use · 3D Visualization · Other
  5. Message (textarea, 5 rows, required)
- Submit button: "Send inquiry →" full-width, #1A1A17 background, white text, border-radius: 0, 48px height
- Below submit: "Or reach us directly on WhatsApp →" text link
- Form state: idle → submitting (button shows "Sending…", disabled) → success (show a success message, hide form) → error (show error message below submit button)
- Use React controlled inputs with useState. No form library.

/api/contact/route.ts:
- POST handler only
- Reads name, company, phone, projectType, message from the request body
- Sends an email via Resend to the studio email address from constants/site.ts
- Email subject: "New project inquiry from [name]"
- Email body: all form fields formatted clearly
- Returns 200 on success, 500 on Resend error
- RESEND_API_KEY is server-only. Never expose it.

Set page metadata: title "Contact | Creative Studio India".

Do not change any other page, section, Nav, Footer, or Sanity files.

---

[Attach Figma design: Contact page]
