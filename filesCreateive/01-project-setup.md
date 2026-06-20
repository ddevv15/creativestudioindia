Read AGENTS.md first and follow it strictly.

Scaffold the Next.js 15 App Router project with TypeScript. Create the complete folder structure defined in AGENTS.md. Install all dependencies from the tech stack: Tailwind CSS v3, shadcn/ui (init with default style and CSS variables), GSAP, Framer Motion, next-sanity, @sanity/image-url, and Resend.

Initialize git with an initial commit message of "init". Add .env.local and .env.example. Gitignore .env.local.

The .env.example must include placeholders for all required environment variables:

- NEXT_PUBLIC_SANITY_PROJECT_ID
- NEXT_PUBLIC_SANITY_DATASET
- SANITY_API_TOKEN
- REVALIDATE_SECRET
- RESEND_API_KEY
- NEXT_PUBLIC_GA_MEASUREMENT_ID

Create constants/site.ts with the studio name, address, phone number, WhatsApp number, and email pulled from the project brief. Create constants/nav.ts with the four nav items: Projects (/projects), Studio (/about), Services (/services), Contact (/contact).

Create lib/utils.ts with the cn() utility using clsx and tailwind-merge.

Wire up lint and typecheck scripts. Confirm they pass with no errors before finishing.

Do not implement any UI yet.
