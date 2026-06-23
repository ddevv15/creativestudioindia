import Link from "next/link";
import { NAV_ITEMS } from "@/constants/nav";
import { SITE } from "@/constants/site";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink px-24 py-64 md:px-48 md:py-96">
      <div className="flex items-center justify-between border-b-[0.5px] border-white/10 pb-32">
        <Link
          href="/"
          className="font-sans text-sm font-medium tracking-wider text-white"
        >
          CREATIVE STUDIO
        </Link>

        <div className="flex items-center gap-24">
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white transition-colors hover:text-white/50"
          >
            <InstagramIcon />
          </a>
          <a
            href={SITE.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-white transition-colors hover:text-white/50"
          >
            <LinkedinIcon />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-48 py-64 md:grid-cols-3">
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.07em] text-white/50">
            Explore
          </p>
          <nav className="mt-24 flex flex-col gap-16">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-[13px] text-white transition-colors hover:text-white/50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.07em] text-white/50">
            Contact
          </p>
          <div className="mt-24 flex flex-col gap-16 font-sans text-[13px] text-white">
            <p>{SITE.address}</p>
            <a
              href={`tel:${SITE.phone}`}
              className="transition-colors hover:text-white/50"
            >
              {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="transition-colors hover:text-white/50"
            >
              {SITE.email}
            </a>
          </div>
        </div>

        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.07em] text-white/50">
            Studio
          </p>
          <p className="mt-24 font-sans text-[13px] text-white/50">
            {SITE.description}
          </p>
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-24 inline-block font-sans text-[13px] text-white transition-colors hover:text-white/50"
          >
            Follow our work on Instagram →
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-16 border-t-[0.5px] border-white/10 pt-32 font-sans text-[13px] text-white/50 md:flex-row md:items-center md:justify-between">
        <p>© {year} Creative Studio. All rights reserved.</p>
        <p>Designed & developed in Ahmedabad</p>
      </div>
    </footer>
  );
}
